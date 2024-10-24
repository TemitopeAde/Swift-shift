"use client";

import Link from "next/link";
// import React, { useState } from "react";
import { navItems, SiteTitle } from "@/data/site";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ToogleTheme";

const Header = () => {
  const pathname = usePathname();
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="bg-card text-white max-h-28 py-4 px-2">
      <nav className="flex items-center justify-between">
        <div>
          <Link href="/" className="font-bold text-2xl text-foreground">
            {SiteTitle.title}
          </Link>
        </div>

        <ul className="justify-center gap-6 items-center hidden md:flex">
          {navItems.map(item => {
            return (
              <li key={item.id}>
                <Link
                  href={`${item.link}`}
                  className={`${pathname === item.link
                    ? "font-bold text-foreground"
                    : "font-normal text-foreground"}`}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex gap-4">
          <div>
            <ModeToggle />
          </div>
          <button className="">
            <svg
            className="text-foreground"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              // className={`transition-transform duration-300 ${isSidebarOpen
              //   ? "-rotate-45"
              //   : ""}`}
            >
              <line x1="3" y1="6" x2="23" y2="6" strokeWidth="3" />
              <line x1="3" y1="12" x2="23" y2="12" strokeWidth="3" />
              <line x1="3" y1="18" x2="23" y2="18" strokeWidth="3" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
