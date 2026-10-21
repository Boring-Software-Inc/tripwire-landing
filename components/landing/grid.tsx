import type { ReactNode } from "react";
import { cn } from "@/lib/glaze/utils";

function Plus({ side }: { side: "l" | "r" }) {
  return (
    <svg aria-hidden className={cn("plus", side === "l" ? "plus-l" : "plus-r")} viewBox="0 0 21 21">
      <path d="M10.5 1v19M1 10.5h19" fill="none" stroke="currentColor" />
    </svg>
  );
}

export function Row({
  children,
  plain = false,
  className,
  colClassName,
  edges,
  as: Tag = "section",
  ...rest
}: {
  children: ReactNode;
  plain?: boolean;
  className?: string;
  colClassName?: string;
  edges?: ReactNode;
  as?: "section" | "header" | "footer" | "div";
  "aria-labelledby"?: string;
}) {
  return (
    <Tag className={cn("row", plain && "row-plain", className)} {...rest}>
      <div className={cn("col", colClassName)}>
        {children}
        {plain ? null : (
          <>
            <Plus side="l" />
            <Plus side="r" />
          </>
        )}
        {edges}
      </div>
    </Tag>
  );
}
