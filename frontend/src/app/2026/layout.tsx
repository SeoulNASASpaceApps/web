import type { Metadata } from "next";
import "./cohort.css";

export const metadata: Metadata = {
  title: {
    default: "NASA Space Apps Seoul 2026",
    template: "%s | NASA Space Apps Seoul 2026",
  },
  description:
    "Join NASA's global hackathon from Seoul on November 14–15, 2026. Use NASA and Space Agency Partner open data to tackle challenges on Earth and in space.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
