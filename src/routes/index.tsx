import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/site-layout";
import { useAuth, getStoredUser } from "@/hooks/use-auth";
import { HeroSection } from "@/components/home/hero-section";
import { DestinationsSection } from "@/components/home/destinations-section";
import { FeaturedVillasSection } from "@/components/home/featured-villas-section";
import { PerksSection } from "@/components/home/perks-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (getStoredUser()) throw redirect({ to: "/search" });
  },
  component: Index,
});

function Index() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const goToSearch = () => navigate({ to: isLoggedIn ? "/search" : "/login" });

  return (
    <SiteLayout>
      <HeroSection />
      <DestinationsSection onViewAll={goToSearch} />
      <FeaturedVillasSection requireAuth={!isLoggedIn} onViewAll={goToSearch} />
      <PerksSection />
      <TestimonialsSection />
    </SiteLayout>
  );
}
