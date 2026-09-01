import type { Metadata } from "next";
import "./cohort.css";

export const metadata: Metadata = {
  title: {
    default: "NASA Space Apps Seoul 2026",
    template: "%s | NASA Space Apps Seoul 2026",
  },
  description: "NASA Space Apps Seoul 2026 public event website. Confirmed information will be published as it becomes available.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
