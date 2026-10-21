"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

type Props = {
  lang: string;
  labels: { work: string; about: string; contact: string };
};

export function Nav({ lang, labels }: Props) {
  const pathname = usePathname();
  const otherLang = lang === "es" ? "en" : "es";
  const switchHref = pathname.replace(/^\/(es|en)/, `/${otherLang}`);

  const links = [
    { href: `/${lang}#work`, label: labels.work },
    { href: `/${lang}#about`, label: labels.about },
    { href: `/${lang}#contact`, label: labels.contact },
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav className="glass flex items-center gap-1 rounded-full p-1.5 text-sm">
        <Link href={`/${lang}`} className="px-3 py-1.5 font-semibold tracking-tight">
          JY
        </Link>
        {links.map((l) => (
          <motion.div key={l.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={l.href}
              className="block rounded-full px-3 py-1.5 text-muted transition-colors hover:bg-white/60 hover:text-foreground"
            >
              {l.label}
            </Link>
          </motion.div>
        ))}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href={switchHref}
            className="block rounded-full bg-foreground px-3 py-1.5 text-xs font-medium uppercase text-background"
          >
            {otherLang}
          </Link>
        </motion.div>
      </nav>
    </motion.header>
  );
}
