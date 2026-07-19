"use client";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Menu, XIcon } from "lucide-react";

import React from "react";

import Container from "@/components/container";
import UserMenu from "@/components/sections/shared/user-menu";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "@tanstack/react-router";

const pages = [
  {
    name: "Home",
    href: "/"
  },
  {
    name: "About",
    href: "/about"
  },
  {
    name: "Feature",
    href: "/feature"
  },
  {
    name: "Pricing",
    href: "/pricing"
  },
  {
    name: "Blogs",
    href: "/blog"
  },
  {
    name: "Contact",
    href: "/contact"
  },
  {
    name: "Integration",
    href: "/integration"
  }
]

const innerPages = [
  {
    name: "Pricing Single",
    href: "/pricing/starter"
  },
  {
    name: "Blog Single",
    href: "/blog/travel-ticketing"
  },
  {
    name: "Integration Single",
    href: "/integration/ledgerlink"
  },
  {
    name: "Early Access",
    href: "/early-access"
  },
  {
    name: "Cookie Policy",
    href: "/legal/cookie-policy"
  },
  {
    name: "404",
    href: "/404"
  }
]

const Navbar = () => {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="w-full md:top-10 top-6 mx-auto absolute z-40">
      <Container className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 xl:w-[35%] md:w-[30%] w-fit">
          <img src="/images/common/logo.png" alt="DolaPay" className="h-8 w-auto" />
          <span className="text-xl font-semibold tracking-tight text-white">DolaPay</span>
        </Link>

        {/* <!-- Mobile --> */}
        <div className="flex items-center gap-2 lg:hidden">
          {!loading && (
            user ? (
              <UserMenu />
            ) : (
              <Button asChild size="sm">
                <Link to="/auth/sign-up">Créer un compte</Link>
              </Button>
            )
          )}
          <Sheet
            open={isOpen}
            onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer lg:hidden text-white h-11 w-11 flex items-center justify-center">
                <Menu
                  className="w-6 h-6"
                  aria-hidden="true"
                />
              </button>
            </SheetTrigger>

            <SheetContent
              className="flex flex-col justify-between bg-black border-border"
            >
              <div className="h-full flex flex-col">
                <SheetHeader className="flex flex-row justify-between border-b border-foreground">
                  <SheetTitle className="flex items-center">
                    <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                      <img src="/images/common/logo.png" alt="DolaPay" className="h-6 w-auto" />
                      <span className="font-semibold text-white">DolaPay</span>
                    </Link>
                  </SheetTitle>
                  <div className="flex items-center gap-2">
                    <SheetPrimitive.Close
                      className="h-11 w-11 flex items-center justify-center data-[state=open]:bg-white right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none">
                      <XIcon className="size-5 text-white" />
                      <span className="sr-only">Close</span>
                    </SheetPrimitive.Close>
                  </div>
                </SheetHeader>
                <div className="px-2 py-6 flex flex-col h-full justify-between flex-1 overflow-y-auto">
                  <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <p className="text-white uppercase mb-3">Pages</p>
                      {pages.map((page) => (
                        <Link to={page.href} onClick={() => setIsOpen(false)} className="block py-1 text-muted-foreground hover:text-primary transition-colors">
                          {page.name}
                        </Link>
                      ))}
                    </div>

                    <div className="space-y-2 pt-4">
                      <p className="text-white uppercase mb-3">Inner Pages</p>
                      {innerPages.map((page) => (
                        <Link to={page.href} onClick={() => setIsOpen(false)} className="block py-1 text-muted-foreground hover:text-primary transition-colors">
                          {page.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* <!-- Desktop --> */}
        <NavigationMenu className="hidden lg:block mx-auto">
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white bg-transparent hover:bg-transparent data-[state=open]:bg-transparent hover:text-primary">
                Pages
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[380px] p-6 bg-background">
                  <div className="grid grid-cols-2 gap-8">
                    {/* Column 1 - Pages */}
                    <div className="space-y-3">
                      {pages.map((page) => (
                        <Link to={page.href} className="block text-muted-foreground hover:text-white transition-colors">
                          {page.name}
                        </Link>
                      ))}
                    </div>

                    {/* Column 2 - Inner Pages */}
                    <div className="space-y-3">
                      {innerPages.map((page) => (
                        <Link to={page.href} className="block text-muted-foreground hover:text-white transition-colors">
                          {page.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/feature" className="px-4 py-2 text-white hover:text-primary transition-colors">
                  Feature
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/about" className="px-4 py-2 text-white hover:text-primary transition-colors">
                  About
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/pricing" className="px-4 py-2 text-white hover:text-primary transition-colors">
                  Pricing
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/blog" className="px-4 py-2 text-white hover:text-primary transition-colors">
                  Blogs
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden lg:flex gap-2 items-center xl:w-[35%] md:w-[30%] w-fit justify-end">
          {!loading && (
            user ? (
              <UserMenu />
            ) : (
              <Button asChild>
                <Link to="/auth/sign-up">Créer un compte</Link>
              </Button>
            )
          )}
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
