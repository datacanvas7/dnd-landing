"use client";

import { INSTAGRAM_URL } from "@/lib/config/site";
import { trackEvent } from "@/lib/analytics";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Where the link appears, for campaign analytics. */
  location: "header" | "footer" | "success";
};

/** Instagram outbound link with click tracking. Opens in a new tab, safely. */
export function IgLink({ children, className, location }: Props) {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackEvent("instagram_click", { location })}
    >
      {children}
    </a>
  );
}
