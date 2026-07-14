import { REQUEST_ACCESS } from "@/lib/content";

/**
 * Access CTA used by the hero and the CTA band. A plain link to the app's
 * GitHub sign-in — OAuth happens on the app domain, so the landing site
 * makes no API calls. Replaces the old email waitlist form.
 */
export default function RequestAccessCta({
  label,
  size = "md",
  align = "start",
}: {
  label: string;
  /** md = hero (16px), sm = CTA band (14px) — paddings per the frame */
  size?: "md" | "sm";
  align?: "start" | "center";
}) {
  const buttonClasses =
    size === "md"
      ? "rounded-tight md:rounded-ui bg-foreground px-[10.5px] pt-[5.6px] pb-[5.88px] text-[16px]/[1.5] font-medium text-background"
      : "rounded-tight md:rounded-ui bg-foreground px-[17.5px] pt-[7px] pb-[7.28px] text-sm/[1.43] font-medium text-background";

  const justify = align === "center" ? "justify-center" : "justify-start";

  return (
    <div className={`flex items-center gap-4 ${justify}`}>
      <a
        href={REQUEST_ACCESS.href}
        className={`${buttonClasses} inline-block transition-opacity duration-150 hover:opacity-85`}
      >
        {label}
      </a>
    </div>
  );
}
