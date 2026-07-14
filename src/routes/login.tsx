import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/site-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Masuk / Daftar — Balivio" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  return (
    <SiteLayout>
      <div className="mx-auto flex max-w-5xl gap-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="hidden flex-1 rounded-3xl bg-primary/5 p-10 lg:block">
          <div className="grid h-full place-items-center">
            <div>
              <span className="inline-block rounded-full bg-highlight px-3 py-1 text-xs font-bold text-highlight-foreground">Balivio Member</span>
              <h2 className="mt-4 text-3xl font-bold">Dapatkan diskon khusus hingga <span className="text-primary">20%</span></h2>
              <p className="mt-3 text-sm text-muted-foreground">Daftar gratis dan nikmati promo eksklusif setiap bulan untuk villa terbaik di Bali.</p>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
            <div className="flex rounded-2xl bg-muted p-1">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "flex-1 rounded-xl py-2 text-sm font-semibold transition-colors",
                    mode === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
                  )}
                >
                  {m === "login" ? "Masuk" : "Daftar"}
                </button>
              ))}
            </div>

            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              {mode === "register" && (
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input placeholder="Nama kamu" />
                </div>
              )}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@balivio.id" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-2xl">
                {mode === "login" ? "Masuk" : "Buat Akun"}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> atau <span className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-2">
              <Button variant="outline" className="w-full rounded-2xl">Lanjut dengan Google</Button>
              <Button variant="outline" className="w-full rounded-2xl">Lanjut dengan Apple</Button>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Dengan {mode === "login" ? "masuk" : "mendaftar"}, kamu menyetujui{" "}
              <Link to="/" className="text-primary hover:underline">Syarat & Ketentuan</Link> kami.
            </p>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}