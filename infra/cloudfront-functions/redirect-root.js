function handler(event) {
  if (event.request.uri === "/") {
    return {
      statusCode: 302,
      statusDescription: "Found",
      headers: {
        location: { value: "/2026/ko/" },
        "cache-control": { value: "max-age=0, must-revalidate" },
      },
    };
  }

  return event.request;
}
