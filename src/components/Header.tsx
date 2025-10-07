"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { UserMenu } from "./UserMenu";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Lançamentos" },
  { href: "/livro-diario", label: "Livro Diário" },
  { href: "/livro-razao", label: "Livro Razão" },
  { href: "/balanco-patrimonial", label: "Balanço Patrimonial" },
  { href: "/gerenciar-contas", label: "Gerenciar Contas" },
];

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverStyle, setHoverStyle] = useState({});
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" });
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex];
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement;
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }
  }, [hoveredIndex]);

  useEffect(() => {
    requestAnimationFrame(() => {
      const activeIndex = navLinks.findIndex((link) => link.href === pathname);
      const activeElement = tabRefs.current[activeIndex];
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    });
  }, [pathname]);

  if (loading || !user) {
    return null;
  }

  return (
    <header className="bg-card/50 border-border/50 sticky top-0 z-20 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <nav className="relative flex items-center gap-6">
          {/* Hover Highlight */}
          <div
            className="absolute flex h-[30px] items-center rounded-[6px] bg-[#0e0f1114] transition-all duration-300 ease-out dark:bg-[#ffffff1a]"
            style={{
              ...hoverStyle,
              opacity: hoveredIndex !== null ? 1 : 0,
            }}
          />

          {/* Active Indicator */}
          <div
            className="absolute bottom-[-6px] h-[2px] bg-[#0e0f11] transition-all duration-300 ease-out dark:bg-white"
            style={activeStyle}
          />

          {/* Links */}
          <div className="relative flex items-center space-x-[6px]">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <div
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    className={`h-[30px] cursor-pointer px-3 py-2 transition-colors duration-300 ${
                      isActive
                        ? "text-[#0e0e10] dark:text-white"
                        : "text-[#0e0f1199] dark:text-[#ffffff99]"
                    }`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="flex h-full items-center justify-center text-sm leading-5 font-medium whitespace-nowrap">
                      {link.label}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <UserMenu displayName={user.user_metadata.display_name} />
        </div>
      </div>
    </header>
  );
}
