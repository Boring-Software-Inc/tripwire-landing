"use client";

import { useState } from "react";
import { FAQ, FAQ_ITEMS } from "@/lib/content";
import Reveal from "@/components/Reveal";
import { ChevronDown } from "@/components/icons";

export default function Faq() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <section id="faq" className="scroll-mt-20 border-t border-line">
      <div className="mx-auto w-full max-w-[1280px] px-8 sm:px-12 lg:px-20 py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <h2 className="text-[36px]/[1.11] font-medium text-foreground">
              {FAQ.heading}
            </h2>
            <p className="mt-4 text-[16px]/[1.5] text-faint">{FAQ.subhead}</p>
          </Reveal>

          <Reveal delay={100}>
            <div className="border-t border-line-strong">
              {FAQ_ITEMS.map((item) => {
                const open = openQuestion === item.question;
                const panelId = `faq-panel-${item.question.replace(/\W+/g, "-")}`;
                return (
                  <div key={item.question} className="border-b border-line-strong">
                    <h3>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() =>
                          setOpenQuestion(open ? null : item.question)
                        }
                        className="flex w-full cursor-pointer items-center justify-between py-5 text-left text-[15px]/[1.5] text-foreground"
                      >
                        {item.question}
                        <ChevronDown
                          className={`ml-4 h-5 w-5 shrink-0 text-faint transition-transform duration-300 motion-reduce:transition-none ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </h3>
                    <div id={panelId} className="faq-panel" data-open={open}>
                      <div>
                        <p className="pb-5 text-[15px]/[1.6] text-muted">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
