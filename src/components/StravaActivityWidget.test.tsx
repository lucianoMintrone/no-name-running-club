import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  StravaActivityWidget,
  extractIframeSrc,
  extractIframeDimensions,
} from "./StravaActivityWidget";

describe("StravaActivityWidget", () => {
  const validEmbedCode = `<iframe allowtransparency='true' frameborder='0' height='454' scrolling='no' src='https://www.strava.com/clubs/1922110/latest-rides/ccf86990ecc2a35d766d4fcea3e8aab3b8b2a81b?show_rides=true' width='300'></iframe>`;

  describe("extractIframeSrc", () => {
    it("should extract src from valid Strava iframe with single quotes", () => {
      const src = extractIframeSrc(validEmbedCode);
      expect(src).toBe(
        "https://www.strava.com/clubs/1922110/latest-rides/ccf86990ecc2a35d766d4fcea3e8aab3b8b2a81b?show_rides=true"
      );
    });

    it("should extract src from iframe with double quotes", () => {
      const embedCode = `<iframe src="https://www.strava.com/clubs/12345/latest-rides/abc123" width="300"></iframe>`;
      const src = extractIframeSrc(embedCode);
      expect(src).toBe(
        "https://www.strava.com/clubs/12345/latest-rides/abc123"
      );
    });

    it("should return null for non-Strava URLs", () => {
      const embedCode = `<iframe src="https://evil-site.com/malicious" width="300"></iframe>`;
      const src = extractIframeSrc(embedCode);
      expect(src).toBeNull();
    });

    it("should return null for invalid iframe code", () => {
      const embedCode = `<div>not an iframe</div>`;
      const src = extractIframeSrc(embedCode);
      expect(src).toBeNull();
    });

    it("should return null for empty string", () => {
      const src = extractIframeSrc("");
      expect(src).toBeNull();
    });

    it("should accept strava.com without www prefix", () => {
      const embedCode = `<iframe src="https://strava.com/clubs/12345/latest-rides/abc123" width="300"></iframe>`;
      const src = extractIframeSrc(embedCode);
      expect(src).toBe("https://strava.com/clubs/12345/latest-rides/abc123");
    });

    it("should reject invalid URLs", () => {
      const embedCode = `<iframe src="not-a-valid-url" width="300"></iframe>`;
      const src = extractIframeSrc(embedCode);
      expect(src).toBeNull();
    });
  });

  describe("extractIframeDimensions", () => {
    it("should extract width and height from embed code, enforcing minimum width", () => {
      const dimensions = extractIframeDimensions(validEmbedCode);
      // Original width is 300, but minimum is 320
      expect(dimensions.width).toBe(320);
      expect(dimensions.height).toBe(454);
    });

    it("should return minimum width for missing values", () => {
      const embedCode = `<iframe src="https://www.strava.com/clubs/123/latest-rides/abc"></iframe>`;
      const dimensions = extractIframeDimensions(embedCode);
      // Default width would be 300, but minimum is 320
      expect(dimensions.width).toBe(320);
      expect(dimensions.height).toBe(454);
    });

    it("should handle dimensions without quotes", () => {
      const embedCode = `<iframe width=400 height=600 src="https://www.strava.com/clubs/123"></iframe>`;
      const dimensions = extractIframeDimensions(embedCode);
      expect(dimensions.width).toBe(400);
      expect(dimensions.height).toBe(600);
    });

    it("should handle dimensions with double quotes", () => {
      const embedCode = `<iframe width="350" height="500" src="https://www.strava.com/clubs/123"></iframe>`;
      const dimensions = extractIframeDimensions(embedCode);
      expect(dimensions.width).toBe(350);
      expect(dimensions.height).toBe(500);
    });

    it("should enforce minimum width of 320px for small widths", () => {
      const embedCode = `<iframe width="200" height="400" src="https://www.strava.com/clubs/123"></iframe>`;
      const dimensions = extractIframeDimensions(embedCode);
      expect(dimensions.width).toBe(320);
      expect(dimensions.height).toBe(400);
    });
  });

  describe("rendering", () => {
    beforeEach(() => {
      render(<StravaActivityWidget embedCode={validEmbedCode} />);
    });

    it("should render the Club Activity heading", () => {
      expect(screen.getByText("Club Activity")).toBeInTheDocument();
    });

    it("should render the description text", () => {
      expect(
        screen.getByText("Recent runs from our club")
      ).toBeInTheDocument();
    });

    it("should render an iframe with the correct src", () => {
      const iframe = screen.getByTitle("Strava Club Activity Feed");
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute(
        "src",
        "https://www.strava.com/clubs/1922110/latest-rides/ccf86990ecc2a35d766d4fcea3e8aab3b8b2a81b?show_rides=true"
      );
    });

    it("should render iframe with correct dimensions (minimum width enforced)", () => {
      const iframe = screen.getByTitle("Strava Club Activity Feed");
      // Original width is 300, but minimum width of 320 is enforced
      expect(iframe).toHaveAttribute("width", "320");
      expect(iframe).toHaveAttribute("height", "454");
    });

    it("should have accessibility title on iframe", () => {
      const iframe = screen.getByTitle("Strava Club Activity Feed");
      expect(iframe).toBeInTheDocument();
    });
  });

  describe("security", () => {
    it("should not render anything for invalid embed code", () => {
      const { container } = render(
        <StravaActivityWidget embedCode="<div>malicious</div>" />
      );
      expect(container.querySelector("iframe")).toBeNull();
    });

    it("should not render anything for non-Strava URLs", () => {
      const { container } = render(
        <StravaActivityWidget embedCode="<iframe src='https://evil.com/steal-data'></iframe>" />
      );
      expect(container.querySelector("iframe")).toBeNull();
    });

    it("should not render the widget container for invalid code", () => {
      const { container } = render(
        <StravaActivityWidget embedCode="invalid" />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe("with different embed codes", () => {
    it("should render with a different Strava club URL", () => {
      const embedCode = `<iframe src="https://www.strava.com/clubs/99999/latest-rides/xyz789?show_rides=true" width="320" height="480"></iframe>`;
      render(<StravaActivityWidget embedCode={embedCode} />);

      const iframe = screen.getByTitle("Strava Club Activity Feed");
      expect(iframe).toHaveAttribute(
        "src",
        "https://www.strava.com/clubs/99999/latest-rides/xyz789?show_rides=true"
      );
      expect(iframe).toHaveAttribute("width", "320");
      expect(iframe).toHaveAttribute("height", "480");
    });
  });
});
