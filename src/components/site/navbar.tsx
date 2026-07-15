import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const privateNavItems = [
  { to: "/search", label: "Cari Villa" },
  { to: "/my-bookings", label: "Booking Saya" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const navItems = isLoggedIn ? privateNavItems : [];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate({ to: isLoggedIn ? "/search" : "/" })}
          className="flex items-center gap-2"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-bold">
            B
          </span>
          <span className="text-lg font-bold tracking-tight">Balivio</span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <Link
              to="/search"
              className="hidden h-10 items-center gap-2 rounded-full border border-border bg-muted/40 px-4 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
            >
              <Search className="h-4 w-4" />
              <span>Cari villa cepat...</span>
            </Link>
          )}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:bg-muted"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {isLoggedIn ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-sm font-medium text-foreground">Hi, {user?.name.split(" ")[0]}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden md:block">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/login" className="hidden md:block">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-border md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
                    <Button className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}