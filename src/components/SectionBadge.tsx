import type { SectionBadgeProps } from "@/interfaces";

function AccentBars() {
  return (
    <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 0H4L2 12H0L2 0Z" fill="#245BA9" fillOpacity="0.3" />
      <path d="M7 0H12L10 12H5L7 0Z" fill="#245BA9" fillOpacity="0.6" />
      <path d="M14 0H22L21 12H13L14 0Z" fill="#245BA9" />
    </svg>
  );
}

export function SectionBadge({
  children,
  mirrored = false,
  className = "sub-title",
}: SectionBadgeProps) {
  return (
    <p className={className}>
      <AccentBars />
      {" "}
      {children}
      {mirrored ? (
        <>
          {" "}
          <AccentBars />
        </>
      ) : null}
    </p>
  );
}
