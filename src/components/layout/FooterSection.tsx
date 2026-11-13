"use client";

import { useState } from "react";
import Link from "next/link";

type FooterSectionProps = {
  title: string;
  links: { id: number; title: string; page_key: string }[];
};

export default function FooterSection({ title, links }: FooterSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="footer-section" id="help-center">
      <div className="footer-section-header" onClick={() => setOpen(!open)}>
        <h4>{title}</h4>
        <span className={`arrow ${open ? "rotate" : ""}`}>⌄</span>
      </div>

      <ul className={`footer-links ${open ? "open" : ""}`}>
        {links.map((link) => (
          <li key={link.id}>
            <Link href={`/${link.page_key}`}>{link.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
