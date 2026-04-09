import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ScrollStory from "@/components/ScrollStory";
import ServicesSection from "@/components/ServicesSection";
import ServicePackages from "@/components/ServicePackages";
import StylistProfiles from "@/components/StylistProfiles";
import GallerySection from "@/components/GallerySection";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import TestimonialsSection from "@/components/TestimonialsSection";
import BookingSection from "@/components/BookingSection";
import FooterSection from "@/components/FooterSection";
import WhatsAppChat from "@/components/WhatsAppChat";

const Index = () => (
  <div className="bg-background overflow-x-hidden">
    <Navbar />
    <HeroSection />
    <ScrollStory />
    <ServicesSection />
    <ServicePackages />
    <StylistProfiles />
    <GallerySection />
    <BeforeAfterGallery />
    <TestimonialsSection />
    <BookingSection />
    <FooterSection />
    <WhatsAppChat />
  </div>
);

export default Index;
