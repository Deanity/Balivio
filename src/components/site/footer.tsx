import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface-alt">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-bold">
              B
            </span>
            <span className="text-lg font-bold">Balivio</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Platform booking villa terverifikasi di Bali. Temukan villa impianmu dengan harga terbaik.
          </p>
          <div className="mt-4 flex gap-3">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Social"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Tentang</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">Tentang Balivio</a></li>
            <li><a href="#" className="hover:text-foreground">Karir</a></li>
            <li><a href="#" className="hover:text-foreground">Press Kit</a></li>
            <li><a href="#" className="hover:text-foreground">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Bantuan</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">Pusat Bantuan</a></li>
            <li><a href="#" className="hover:text-foreground">Kebijakan Privasi</a></li>
            <li><a href="#" className="hover:text-foreground">Syarat & Ketentuan</a></li>
            <li><a href="#" className="hover:text-foreground">Kontak Kami</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Kontak</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>support@balivio.id</li>
            <li>+62 361 123 4567</li>
            <li>Kuta, Bali, Indonesia</li>
          </ul>
          <div className="mt-4">
            <p className="text-xs font-medium text-muted-foreground">Metode pembayaran</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["VISA", "MC", "BCA", "OVO", "GoPay", "DANA"].map((p) => (
                <span
                  key={p}
                  className="rounded-md border border-border bg-background px-2 py-1 text-[10px] font-semibold text-muted-foreground"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Balivio. All rights reserved.</p>
          <p>
            Dibuat dengan cinta di Bali.
          </p>
        </div>
      </div>
    </footer>
  );
}