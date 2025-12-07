// src/app/page.tsx
import dynamic from "next/dynamic"
import Header from '@/components/Header';
import Hero from "@/components/Hero"
import Footer from '@/components/Footer';

// Dynamic imports for below-fold components
const Features = dynamic(() => import('@/components/Features'), { ssr: true });
const Services = dynamic(() => import('@/components/Services'), { ssr: true });
const TrackOrder = dynamic(() => import('@/components/TrackOrder'), { ssr: true });
const Pricing = dynamic(() => import('@/components/Pricing'), { ssr: true });

export const metadata = {
  title: 'Para Laundry - Solusi Laundry Terpercaya',
  description: 'Layanan laundry terpercaya di Indralaya. Cuci setrika, cuci kilat, sepatu, tas, dan lebih. Harga terjangkau, kualitas terbaik.',
  keywords: 'laundry, cuci setrika, laundry indralaya, laundry murah, laundry terpercaya',
};

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
  )
}