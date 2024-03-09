'use client'

import { Image, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { usePathname } from "next/navigation";

export default function TopNavBar() {
    const pathname = usePathname();
    const currentPage = (() => {
      if (pathname === '/') return '/';
      if (pathname === '/sponsors') return '/sponsors';
      else if (pathname === '/beneficiaries') return '/beneficiaries';
      else if (pathname.startsWith('/curations')) return '/curations';
      else 'others';
    })();
  
    const navLinkClassName = (link: string) => {
      if (link == currentPage) return 'text-sky-500 dark:text-sky-400';
      return "hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
    }

    return (
    <Navbar>
        <NavbarBrand><Image width={50} src="/matters.town.svg" alt="Company Icon"/><p className="font-black text-inherit ml-2">Matters Town</p></NavbarBrand>
        <NavbarContent className="gap-4" justify="center">
        {
            [
              ['/', 'Home'],
              ['/sponsors', 'Top Sponsors'],
              ['/beneficiaries', 'Top Beneficiaries'],
              ['/curations', 'Recent Curations']
            ].map((link) => {
            return <NavbarItem key={link[0]}>
            <Link href={link[0]} className={ navLinkClassName(link[0]) }>{link[1]}</Link>
            </NavbarItem>
            })
        }
        </NavbarContent>
    </Navbar>
    )
}
