import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { StravaWidget } from "./StravaWidget";

// Mock for jsdom environment in tests
describe("StravaWidget", () => {
  const mockStravaUrl = "https://www.strava.com/clubs/test-club";

  beforeEach(() => {
    render(<StravaWidget stravaUrl={mockStravaUrl} />);
  });

  describe("rendering", () => {
    it("should render the Strava Challenge heading", () => {
      expect(screen.getByText("Strava Challenge")).toBeInTheDocument();
    });

    it("should render the description text", () => {
      expect(screen.getByText("Track your runs on Strava")).toBeInTheDocument();
    });

    it("should render the Join button with correct text", () => {
      expect(screen.getByText("Join the Strava Challenge")).toBeInTheDocument();
    });
  });

  describe("link behavior", () => {
    it("should have correct href attribute", () => {
      const link = screen.getByRole("link", { name: /join the strava challenge/i });
      expect(link).toHaveAttribute("href", mockStravaUrl);
    });

    it("should open in a new tab", () => {
      const link = screen.getByRole("link", { name: /join the strava challenge/i });
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("should have noopener noreferrer for security", () => {
      const link = screen.getByRole("link", { name: /join the strava challenge/i });
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("with different URLs", () => {
    it("should render with a Strava challenge URL", () => {
      const { container } = render(
        <StravaWidget stravaUrl="https://www.strava.com/challenges/winter-2026" />
      );
      const link = container.querySelector('a[href="https://www.strava.com/challenges/winter-2026"]');
      expect(link).toBeInTheDocument();
    });

    it("should render with a Strava club URL", () => {
      const { container } = render(
        <StravaWidget stravaUrl="https://www.strava.com/clubs/no-name-running-club" />
      );
      const link = container.querySelector('a[href="https://www.strava.com/clubs/no-name-running-club"]');
      expect(link).toBeInTheDocument();
    });
  });
});
