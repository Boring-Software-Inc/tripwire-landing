import type { ReactNode } from "react";
import { AsciiArt } from "@/components/landing/ascii-art";
import { QUEUE_ASH, WORKFLOW_ASH } from "@/components/landing/ascii-art-data";
import { cn } from "@/lib/glaze/utils";

function Stage({ ash, phone, height, children }: { ash: typeof WORKFLOW_ASH; phone: boolean; height: number; children: ReactNode }) {
  return (
    <div className={cn("hatch flex flex-col border-b border-(--grid)", phone ? "p-3" : "p-5")}>
      <div
        className={cn("feature-stage relative flex shrink-0 flex-col items-center overflow-clip rounded-[12px]", phone ? "pt-7" : "pt-11")}
        style={{ height }}
      >
        <div className={cn("absolute bottom-0", phone ? "-left-[90px] w-[max(517px,calc(100%+90px))]" : "left-0 w-[517px]")}>
          <AsciiArt art={ash} stretch className="block" />
        </div>
        {children}
      </div>
    </div>
  );
}

function Port({ tone, className }: { tone: "idle" | "ok" | "fail"; className: string }) {
  return <span className={cn("node-port absolute h-1 w-2.5 rounded-[2px]", `node-port-${tone}`, className)} />;
}

function Node({
  title,
  kind,
  rows,
  selected = false,
  outs = true,
  className,
}: {
  title: string;
  kind: string;
  rows: [string, string][];
  selected?: boolean;
  outs?: boolean;
  className: string;
}) {
  return (
    <div className={cn("wf-node absolute flex w-[248px] flex-col rounded-[11px] border", selected && "wf-node-selected", className)}>
      <div className="flex items-baseline gap-2 px-3 pt-[9px] pb-2.5">
        <span className="wf-title grow">{title}</span>
        <span className="wf-meta">{kind}</span>
      </div>
      <div className="wf-rule flex flex-col gap-1 border-t px-3 pt-2 pb-2.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <span className="wf-meta grow">{k}</span>
            <span className="wf-value">{v}</span>
          </div>
        ))}
      </div>
      <Port tone="idle" className="top-[15px] -left-[5px]" />
      {outs ? (
        <>
          <Port tone="ok" className="top-[15px] -right-[5px]" />
          <Port tone="fail" className="-right-[5px] bottom-[15px]" />
        </>
      ) : null}
    </div>
  );
}

export function WorkflowPicture({ phone = false }: { phone?: boolean }) {
  return (
    <Stage ash={WORKFLOW_ASH} phone={phone} height={phone ? 336 : 360}>
      <div className={cn("mini-window relative flex h-[340px] shrink-0 rounded-[16px] p-1", phone ? "w-[308px]" : "w-[470px]")}>
        <div className="relative grow overflow-clip rounded-[12px] bg-page">
          {phone ? (
            <svg aria-hidden width="300" height="292" viewBox="0 0 300 292" className="wf-edges absolute top-0 left-0">
              <path d="M0 37 L6 37" />
              <path d="M262 37 C 326 37, -20 167, 44 167" />
              <path d="M262 95 C 326 95, -20 281, 44 281" />
            </svg>
          ) : (
            <svg aria-hidden width="462" height="332" viewBox="0 0 462 332" className="wf-edges absolute top-0 left-0">
              <path d="M0 41 L14 41" />
              <path d="M270 41 C 334 41, 146 167, 210 167" />
              <path d="M270 99 C 334 99, 146 281, 210 281" />
            </svg>
          )}
          <Node
            selected
            title="Account age"
            kind="Rule"
            rows={[
              ["Younger than", "30 days"],
              ["Clears after", "5 days"],
            ]}
            className={phone ? "top-5 left-2.5" : "top-6 left-[18px]"}
          />
          <Node
            title="Send to moderation"
            kind="Action"
            rows={[["Decided by", "A maintainer"]]}
            className={phone ? "top-[150px] left-12" : "top-[150px] left-[214px]"}
          />
          <Node
            title="Block the change request"
            kind="Action"
            rows={[["Comment", "All details"]]}
            outs={false}
            className={phone ? "top-[264px] left-12" : "top-[264px] left-[214px]"}
          />
        </div>
      </div>
    </Stage>
  );
}

const PENDING = [
  { who: "ana-dev", where: "acme/widgets #482", when: "2m ago" },
  { who: "mxl-0921", where: "acme/widgets #479", when: "14m ago" },
];

export function QueuePicture({ phone = false }: { phone?: boolean }) {
  return (
    <Stage ash={QUEUE_ASH} phone={phone} height={phone ? 300 : 360}>
      <div className={cn("mini-window relative flex rounded-[16px] p-1", phone ? "w-[308px]" : "w-[452px]")}>
        <div className={cn("flex min-w-0 grow flex-col overflow-clip rounded-[12px] bg-page", phone ? "p-3.5" : "p-5")}>
          <div className="flex w-full min-w-0 flex-col gap-2 font-system">
            <div className="flex gap-1.5 text-[14px] leading-[18px] font-medium">
              <span className="text-text-1">Pending</span>
              <span className="text-text-2">2</span>
            </div>
            {PENDING.map((p) => (
              <div key={p.where} className="q-shell flex min-w-0 rounded-[14px] bg-shell p-[3px]">
                <div className={cn("flex min-w-0 grow items-center rounded-[11px] bg-paper", phone ? "gap-2 p-3" : "gap-3 px-4 py-3")}>
                  <div className="flex min-w-0 grow basis-0 flex-col gap-0.5 overflow-clip">
                    <div className="flex min-w-0 gap-1 overflow-clip text-[14px] leading-5">
                      <span className="shrink-0 font-medium text-text-1">{p.who}</span>
                      <span className="shrink-0 text-text-2">on</span>
                      <span className="min-w-0 truncate text-text-1">{p.where}</span>
                    </div>
                    <div className="flex gap-2 text-[12px] leading-4 text-text-2">
                      <span>{p.when}</span>
                      <span className="underline decoration-1 [text-underline-position:from-font]">View run</span>
                    </div>
                  </div>
                  <span className={cn("q-approve shrink-0 rounded-[6px] py-1.5 text-[12px] leading-4 font-medium", phone ? "px-2.5" : "px-3")}>
                    Approve
                  </span>
                  <span className={cn("q-deny shrink-0 rounded-[6px] py-1.5 text-[12px] leading-4 font-medium", phone ? "px-2.5" : "px-3")}>
                    Deny
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Stage>
  );
}
