import { HeroSection } from '@/components/landing/heroSection';
import { DestinasiPopuler } from '@/components/landing/destinasiPopuler';
import { VillaRekomendasi } from '@/components/landing/villaRekomendasi';
import { WhyBalivio } from '@/components/landing/whyBalivio';
import { TestimonialSection } from '@/components/landing/testimonialSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DestinasiPopuler />
      <VillaRekomendasi />
      <WhyBalivio />
      <TestimonialSection />
    </>
  );
}
