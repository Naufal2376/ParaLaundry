// src/app/page.tsx
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Services from '@/components/Services';
import TrackOrder from '@/components/TrackOrder';
import Pricing from '@/components/Pricing';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features /> 
        <Services />
        <TrackOrder />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}