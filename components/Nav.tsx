"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LiquidGlass } from "./LiquidGlass";

type Props = {
  lang: string;
  labels: { work: string; about: string; contact: string; menu: string };
};

const sections = ["work", "about", "contact"] as const;
type Section = (typeof sections)[number];

const spring = { type: "spring", stiffness: 420, damping: 34 } as const;

export function Nav({ lang, labels }: Props) {
  const pathname = usePathname();
  const isHome = pathname === `/${lang}`;
  const otherLang = lang === "es" ? "en" : "es";
  const switchHref = pathname.replace(/^\/(es|en)/, `/${otherLang}`);
  const [active, setActive] = useState<Section | null>(null);
  const [hovered, setHovered] = useState<Section | null>(null);

  // Scroll spy: the section closest to the middle of the screen is the active one
  useEffect(() => {
    if (!isHome) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as Section);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [isHome]);

  const current = isHome ? active : "work";
  const highlighted = hovered ?? current;

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.1 }}
      style={{ viewTransitionName: "site-header" }}
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      {/* Desktop */}
      <LiquidGlass className="pointer-events-auto hidden items-center gap-1 p-1.5 sm:flex">
        <Link
          href={`/${lang}`}
          aria-label="Johan Yanten"
          className="mr-1 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[13px] font-semibold tracking-tight text-white transition-transform active:scale-90"
        >
          JY
        </Link>
        <nav className="flex" onMouseLeave={() => setHovered(null)}>
          {sections.map((s) => (
            <Link
              key={s}
              href={`/${lang}#${s}`}
              onMouseEnter={() => setHovered(s)}
              className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                highlighted === s ? "text-ink" : "text-ink/60"
              }`}
            >
              {highlighted === s && (
                <motion.span layoutId="nav-indicator" transition={spring} className="raised absolute inset-0 rounded-full" />
              )}
              <span className="relative">{labels[s]}</span>
            </Link>
          ))}
        </nav>
        <LangSwitch lang={lang} href={switchHref} id="lang-desktop" />
      </LiquidGlass>

      {/* Mobile */}
      <MobileMenu lang={lang} labels={labels} switchHref={switchHref} />
    </motion.header>
  );
}

function LangSwitch({ lang, href, id }: { lang: string; href: string; id: string }) {
  return (
    <Link href={href} aria-label="Cambiar idioma / Switch language" className="well ml-1 inline-flex rounded-full p-0.5 text-xs font-medium">
      {["es", "en"].map((l) => (
        <span key={l} className={`relative rounded-full px-2.5 py-1.5 uppercase ${l === lang ? "text-ink" : "text-ink/45"}`}>
          {l === lang && <motion.span layoutId={id} className="raised absolute inset-0 rounded-full" />}
          <span className="relative">{l}</span>
        </span>
      ))}
    </Link>
  );
}

/**
 * Pill that opens into a menu one axis at a time: taller first, then wider, then the content.
 * Closing runs the same steps in reverse.
 */
function MobileMenu({ lang, labels, switchHref }: { lang: string; labels: Props["labels"]; switchHref: string }) {
  const [open, setOpen] = useState(false);
  const [vw, setVw] = useState(0);

  const toggle = () => {
    setVw(window.innerWidth);
    setOpen((o) => !o);
  };

  const closedW = 196;
  const openW = Math.max(closedW, vw - 32);

  return (
    <motion.div
      className="pointer-events-auto sm:hidden"
      initial={false}
      animate={{ height: open ? 268 : 52, width: open ? openW : closedW }}
      transition={{
        height: { ...spring, delay: open ? 0 : 0.22 },
        width: { ...spring, delay: open ? 0.16 : 0.08 },
      }}
    >
      <LiquidGlass radius={26} tint={open ? 0.94 : 0.32} className="flex h-full w-full flex-col overflow-hidden p-1.5">
        <div className="flex h-10 shrink-0 items-center gap-2">
          <Link
            href={`/${lang}`}
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-[13px] font-semibold text-white"
          >
            JY
          </Link>
          <motion.span layout="position" className="text-sm font-medium tracking-tight whitespace-nowrap">
            Johan Yanten
          </motion.span>
          <button
            onClick={toggle}
            aria-expanded={open}
            aria-label={labels.menu}
            className="raised ml-auto flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[5px] rounded-full"
          >
            <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 3 : 0 }} className="h-[1.5px] w-4 rounded bg-ink" />
            <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -3.5 : 0 }} className="h-[1.5px] w-4 rounded bg-ink" />
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                show: { transition: { staggerChildren: 0.05, delayChildren: 0.34 } },
                hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
              className="flex flex-1 flex-col justify-between px-3 pt-4 pb-2"
            >
              {sections.map((s) => (
                <motion.div
                  key={s}
                  variants={{ hidden: { opacity: 0, y: 8, filter: "blur(4px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)" } }}
                >
                  <Link href={`/${lang}#${s}`} onClick={() => setOpen(false)} className="block py-1.5 text-2xl font-medium tracking-tight">
                    {labels[s]}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="pt-2">
                <LangSwitch lang={lang} href={switchHref} id="lang-mobile" />
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>
      </LiquidGlass>
    </motion.div>
  );
}
