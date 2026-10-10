#!/usr/bin/env python3
"""One-shot public Seoul team snapshot. Python 3.10+, standard library only.

No credentials, member fields, email fields, writes to a server, scheduling,
automatic retries, or deletion interpretation. Failures remain explicit.
"""
import argparse
from datetime import datetime, timezone
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import time
import urllib.error
import urllib.parse
import urllib.request
import urllib.robotparser

SOURCE = "https://www.spaceappschallenge.org/2026/local-events/seoul/?tab=teams"
UA = "SpaceAppsSeoulPublicReadCheck/1.0"
FIELDS = "id title meta { relativeUrl } challengeDetails { title } canAcceptMembers location event"
LIST_QUERY = """query PublicSeoulTeams($first:Int!, $after:String, $filtering:[Filter!]) {
 teams(first:$first, after:$after, filtering:$filtering) {
  totalCount pageInfo { hasNextPage endCursor }
  edges { node { %s } }
 }
}""" % FIELDS


def now():
    return datetime.now(timezone.utc).isoformat()


class Failure(Exception):
    pass


class PublicClient:
    def __init__(self, timeout=25, delay=0.5):
        self.timeout, self.delay = timeout, delay
        self.robots = {}
        self.requests = []

    def _request(self, url, payload=None):
        headers = {"User-Agent": UA, "Accept": "application/json" if payload else "text/html"}
        data = None
        if payload is not None:
            headers.update({"Content-Type": "application/json", "X-Client-Origin": "https://www.spaceappschallenge.org"})
            data = json.dumps(payload).encode()
        entry = {"url": url, "method": "POST query (read only)" if payload else "GET", "started_at": now()}
        self.requests.append(entry)
        time.sleep(self.delay)
        # No cookies, authentication headers, credential store, or retry loop.
        try:
            with urllib.request.urlopen(urllib.request.Request(url, data=data, headers=headers), timeout=self.timeout) as response:
                final = urllib.parse.urlparse(response.url)
                if final.scheme != "https" or not (final.hostname == "spaceappschallenge.org" or final.hostname.endswith(".spaceappschallenge.org")):
                    raise Failure("Redirect outside official domain; stopped")
                entry.update(status=response.status, final_url=response.url, fetched_at=now())
                return response.read().decode("utf-8"), entry["fetched_at"]
        except urllib.error.HTTPError as exc:
            entry.update(status=exc.code, fetched_at=now())
            raise Failure(f"HTTP {exc.code} at {url}; no retry or bypass") from exc
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            entry.update(error=type(exc).__name__, fetched_at=now())
            raise Failure(f"Request failed at {url}: {type(exc).__name__}") from exc

    def check_robots(self, url):
        parts = urllib.parse.urlsplit(url)
        origin = f"{parts.scheme}://{parts.netloc}"
        if origin not in self.robots:
            robot_url = origin + "/robots.txt"
            try:
                text, at = self._request(robot_url)
                parser = urllib.robotparser.RobotFileParser()
                parser.parse(text.splitlines())
                self.robots[origin] = {"url": robot_url, "status": 200, "fetched_at": at, "rules": text, "parser": parser}
            except Failure:
                last = self.requests[-1]
                if last.get("status") not in (404, 410):
                    raise
                self.robots[origin] = {"url": robot_url, "status": last["status"], "fetched_at": last["fetched_at"], "parser": None}
        parser = self.robots[origin]["parser"]
        if parser and not parser.can_fetch(UA, url):
            raise Failure(f"robots.txt disallows {url}; stopped")

    def fetch(self, url):
        self.check_robots(url)
        return self._request(url)

    def query(self, endpoint, query, variables):
        if not query.lstrip().startswith("query "):
            raise Failure("Only explicit read-only queries are allowed")
        self.check_robots(endpoint)
        text, at = self._request(endpoint, {"query": query, "variables": variables})
        result = json.loads(text)
        if result.get("errors"):
            # Do not persist a full API response or server error payload.
            raise Failure("GraphQL reported errors; schema/access may have changed")
        if not isinstance(result.get("data"), dict):
            raise Failure("GraphQL data missing")
        return result["data"], at


def flight_text(html):
    fragments = []
    for match in re.finditer(r'self\.__next_f\.push\((\[.*?\])\)</script>', html):
        try:
            value = json.loads(match.group(1))
        except json.JSONDecodeError:
            continue
        if len(value) > 1 and isinstance(value[1], str):
            fragments.append(value[1])
    return "".join(fragments)


def embedded_object(text, marker):
    for match in re.finditer(re.escape(marker), text):
        try:
            obj, _ = json.JSONDecoder().raw_decode(text[match.end():])
            if isinstance(obj, dict):
                return obj
        except json.JSONDecodeError:
            pass
    raise Failure(f"Expected public page structure missing: {marker}")


def walk(obj):
    if isinstance(obj, dict):
        yield obj
        for item in obj.values():
            yield from walk(item)
    elif isinstance(obj, list):
        for item in obj:
            yield from walk(item)


def detail_from_html(html, team_id):
    text = flight_text(html)
    for line in text.splitlines():
        if ":" not in line:
            continue
        try:
            obj = json.loads(line.split(":", 1)[1])
        except json.JSONDecodeError:
            continue
        for value in walk(obj):
            if value.get("__typename") == "TeamPage" and value.get("id") == team_id and "canAcceptMembers" in value:
                return value
    raise Failure("Requested public team detail not present in HTML payload")


def project(node, at, source_url):
    relative = (node.get("meta") or {}).get("relativeUrl")
    if not node.get("id") or not node.get("title") or not relative:
        raise Failure("Required team identity/name/URL missing")
    challenge = node.get("challengeDetails")
    recruiting = node.get("canAcceptMembers")
    if recruiting is not None and type(recruiting) is not bool:
        raise Failure("Recruitment field has an unexpected type")
    return {
        "official_team_id": node["id"],
        "official_team_url": urllib.parse.urljoin(SOURCE, relative),
        "team_name": node["title"],
        "challenge": challenge.get("title") if isinstance(challenge, dict) else None,
        "seeking_members": recruiting,
        "retrieved_at": at,
        "source_url": source_url,
    }


def collect(client, output, page_size, sample_count):
    html, at = client.fetch(SOURCE)
    text = flight_text(html)
    match = re.search(r'"__SERVER_CONTEXT__":("(?:[^"\\]|\\.)*")', text)
    if not match:
        raise Failure("Public API configuration not found in page")
    context = json.loads(json.loads(match.group(1)))
    endpoint = context["urls"]["api"]
    parsed = urllib.parse.urlparse(endpoint)
    if parsed.scheme != "https" or parsed.hostname != "api.spaceappschallenge.org" or parsed.path != "/graphql":
        raise Failure("Public endpoint changed; review before running")
    local = embedded_object(text, '"localEvent":')
    if local.get("title") != "Seoul" or local.get("__typename") != "LocationPage":
        raise Failure("Source is not the public Seoul location page")
    location_id, event_id = local["id"], local["event"]
    parent = local["meta"]["parent"]["id"]
    config, _ = client.query(endpoint, """query PublicTeamsTabConfig($id:EncodedID!) {
      page(id:$id) { id ... on LocationsIndexPage { showTeamsTab teamsFilter } }
    }""", {"id": parent})
    config = config.get("page") or {}
    if config.get("showTeamsTab") is not True or not config.get("teamsFilter"):
        raise Failure("Public teams tab is unavailable")
    data, _ = client.query(endpoint, """query PublicTeamFilter($id:EncodedID!) {
      contentFilterForm(id:$id) { id parentFilter event inheritEvent fields { cleanName fieldType defaultValue } }
    }""", {"id": config["teamsFilter"]})
    form = data.get("contentFilterForm") or {}
    # Verified website useFilterForm adds event plus parent location. Stop if
    # UI defaults change rather than silently guessing the displayed scope.
    active_defaults = [f for f in form.get("fields", []) if f.get("defaultValue") not in (None, "", False, "false", [])]
    if form.get("parentFilter") != "location" or active_defaults:
        raise Failure("UI filter scope/defaults changed; manual review required")
    filter_event = event_id if form.get("inheritEvent") else form.get("event")
    if filter_event != event_id:
        raise Failure("UI event filter does not match source")
    output["collection"].update(endpoint=endpoint, source_html_status=200, source_html_retrieved_at=at,
        location_id=location_id, event_id=event_id, ui_filter={k:v for k,v in form.items() if k != "fields"},
        scope="all publicly listed Seoul teams for 2026; no recruitment filter", page_size=page_size)
    filters = [{"field":"event", "value":event_id, "compare":"id"}, {"field":"location", "value":location_id, "compare":"id"}]
    output["collection"]["filters"] = filters
    cursor, seen, cursors, totals = "", set(), set(), []
    for number in range(1, 101):
        data, at = client.query(endpoint, LIST_QUERY, {"first":page_size, "after":cursor, "filtering":filters})
        connection = data.get("teams")
        if not isinstance(connection, dict):
            raise Failure("Teams connection missing")
        totals.append(connection["totalCount"])
        nodes = [edge["node"] for edge in connection["edges"]]
        output["collection"].setdefault("pages", []).append({"number":number, "count":len(nodes), "total_count":totals[-1], "page_info":connection["pageInfo"], "retrieved_at":at})
        for node in nodes:
            if node.get("location") != location_id or node.get("event") != event_id:
                raise Failure("Team outside requested event/location")
            if node["id"] in seen:
                raise Failure("Duplicate ID across pages; snapshot may be changing")
            seen.add(node["id"])
            output["teams"].append(project(node, at, SOURCE))
        info = connection["pageInfo"]
        if not info["hasNextPage"]:
            break
        cursor = info.get("endCursor")
        if not cursor or cursor in cursors or not nodes:
            raise Failure("Invalid or repeated pagination cursor")
        cursors.add(cursor)
    else:
        raise Failure("Page limit reached")
    if len(set(totals)) != 1 or len(seen) != totals[0]:
        raise Failure("Total count changed or does not equal unique collected IDs")
    output["collection"].update(expected_total=totals[0], collected_total=len(seen), complete=True)
    # Cover both recruitment states and a team beyond page one when possible.
    candidates = []
    teams = output["teams"]
    for desired in (True, False):
        candidates.extend(next(([t] for t in teams if t["seeking_members"] is desired), []))
    if len(teams) > page_size:
        candidates.append(teams[page_size])
    candidates.extend(teams)
    selected = []
    for team in candidates:
        if team["official_team_id"] not in {t["official_team_id"] for t in selected}:
            selected.append(team)
        if len(selected) >= sample_count:
            break
    for team in selected if sample_count else []:
        sample = {"official_team_id":team["official_team_id"], "source_url":team["official_team_url"]}
        try:
            html, at = client.fetch(team["official_team_url"])
            detail = project(detail_from_html(html, team["official_team_id"]), at, team["official_team_url"])
            keys = ["official_team_id", "official_team_url", "team_name", "challenge", "seeking_members"]
            sample.update(status="matched" if all(detail[k] == team[k] for k in keys) else "mismatch", retrieved_at=at,
                          field_matches={k:detail[k] == team[k] for k in keys}, detail=detail)
        except Failure as exc:
            sample.update(status="unverified", reason=str(exc))
        output["validation"].append(sample)
    output["status"] = "success" if all(s["status"] == "matched" for s in output["validation"]) else "collected_validation_incomplete"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", default="seoul_teams.json")
    parser.add_argument("--page-size", type=int, default=20)
    parser.add_argument("--samples", type=int, default=4)
    parser.add_argument("--timeout", type=int, default=25)
    args = parser.parse_args()
    if not 1 <= args.page_size <= 100 or not 0 <= args.samples <= 10 or not 1 <= args.timeout <= 60:
        parser.error("page-size 1..100, samples 0..10, timeout 1..60 required")
    output = {"schema_version":"1.0", "status":"failed", "started_at":now(),
        "source_url":SOURCE, "collection":{"complete":False}, "teams":[], "validation":[],
        "safety":{"db_updated":False, "deletion_inference_allowed":False, "credentials_used":False,
                  "member_or_email_fields_requested":False, "ai_api_used":False}}
    client = PublicClient(timeout=args.timeout)
    try:
        collect(client, output, args.page_size, args.samples)
    except (Failure, KeyError, ValueError, TypeError) as exc:
        output["status"] = "failed"
        output["error"] = str(exc)
        output["collection"]["complete"] = False
    output["finished_at"] = now()
    output["access_checks"] = [{k:v for k,v in record.items() if k != "parser"} for record in client.robots.values()]
    output["request_log"] = client.requests
    target = Path(args.output)
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_name(target.name + ".tmp")
    temporary.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temporary, target)
    print(json.dumps({"status":output["status"], "teams":len(output["teams"]), "complete":output["collection"]["complete"],
                      "sample_matches":sum(v["status"] == "matched" for v in output["validation"]), "output":str(target.resolve()), "error":output.get("error")}, ensure_ascii=False))
    return 0 if output["status"] == "success" else 2


if __name__ == "__main__":
    raise SystemExit(main())
