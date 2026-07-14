import { FOOTER_BOTTOM, FOOTER_COLUMNS } from "@/lib/content";
import { Logo } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto w-full max-w-[1280px] px-8 sm:px-12 lg:px-20 py-12">
        <div className="mb-12 grid gap-8 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h2 className="mb-4 text-[16px]/[1.5] font-semibold text-foreground">
                {column.heading}
              </h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label} className="mb-2 last:mb-0">
                    <a
                      href={link.href}
                      className="inline-block text-sm/[1.43] text-faint transition-colors duration-150 hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 border-t border-line-strong pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <Logo width={24} height={17} />
            <span className="text-sm/[1.43] text-faint">
              {FOOTER_BOTTOM.copyright}
            </span>
          </div>
          <div className="flex items-center gap-6">
            {FOOTER_BOTTOM.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-sm/[1.43] text-faint transition-colors duration-150 hover:text-foreground"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
