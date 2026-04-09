import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const BookingCancel = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-6 py-32">
      <div className="mx-auto max-w-2xl rounded-3xl border border-border/50 bg-card/80 p-10 text-center shadow-luxury backdrop-blur-xl">
        <h1 className="font-display text-3xl text-foreground">Checkout Cancelled</h1>
        <p className="mt-4 font-body text-sm text-muted-foreground">
          Your booking was not created because the payment flow was cancelled. You can try again whenever you are ready.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/#book" className="rounded-full bg-gradient-gold px-6 py-3 font-body text-xs uppercase tracking-[0.15em] text-primary-foreground">
            Try Again
          </Link>
          <Link to="/contact" className="rounded-full border border-border/50 px-6 py-3 font-body text-xs uppercase tracking-[0.15em] text-foreground">
            Need Help
          </Link>
        </div>
      </div>
    </div>
    <FooterSection />
  </div>
);

export default BookingCancel;
