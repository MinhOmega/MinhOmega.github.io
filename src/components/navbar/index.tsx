"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { navbarConfig } from "@/config/navbar.config";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <div className="sticky top-0 inline-flex items-center text-sm rounded-lg nav-container z-50">
      {navbarConfig.map((item, index) => (
        <NavItem
          key={index}
          url={item.url}
          className={cn(index == 0 && "rounded-l-lg border-l-[0.5px]", index == navbarConfig.length - 1 && "rounded-r-lg border-r-[0.5px]")}
        >
          {item.title}
        </NavItem>
      ))}
    </div>
  );
}

type NavItemProps = {
  children: React.ReactNode;
  url: string;
  className?: string;
};

const NavItem = ({ children, url, className }: NavItemProps) => {
  const pathname = usePathname();
  const active = pathname === url || (pathname.includes(url) && url !== "/");

  return (
    <Link href={url}>
      <motion.div
        className={cn(
          "p-2 min-w-16 lg:min-w-24 text-center hover:bg-secondary cursor-pointer border-t-[0.5px] bg-background",
          active ? "current hover:bg-background" : "nav-item",
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ 
          type: "spring",
          stiffness: 400,
          damping: 17
        }}
      >
        {children}
      </motion.div>
    </Link>
  );
};