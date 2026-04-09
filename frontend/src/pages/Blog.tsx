import { useState } from "react";
import { Calendar, Clock, ArrowRight, Search, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const posts = [
  {
    id: 1,
    title: "5 Self-Care Rituals for a Balanced Life",
    excerpt: "Discover simple daily practices that nurture your mind, body, and spirit for lasting well-being.",
    image: "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=600",
    date: "Mar 28, 2026",
    readTime: "5 min",
    category: "Wellness",
  },
  {
    id: 2,
    title: "The Science Behind Hot Stone Massage",
    excerpt: "How heated basalt stones work with your body's meridians to release deep-seated tension.",
    image: "https://images.pexels.com/photos/3764568/pexels-photo-3764568.jpeg?auto=compress&cs=tinysrgb&w=600",
    date: "Mar 20, 2026",
    readTime: "7 min",
    category: "Treatments",
  },
  {
    id: 3,
    title: "2026 Hair Color Trends: What's Hot",
    excerpt: "From subtle balayage to bold transformations — the styles dominating this season.",
    image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600",
    date: "Mar 12, 2026",
    readTime: "4 min",
    category: "Hair",
  },
  {
    id: 4,
    title: "Building Your Perfect Skincare Routine",
    excerpt: "A step-by-step guide to choosing products that work for your unique skin type.",
    image: "https://images.pexels.com/photos/3762466/pexels-photo-3762466.jpeg?auto=compress&cs=tinysrgb&w=600",
    date: "Mar 5, 2026",
    readTime: "6 min",
    category: "Skincare",
  },
  {
    id: 5,
    title: "Why Aromatherapy Works: An Expert's Guide",
    excerpt: "The power of essential oils and how they affect your nervous system and mood.",
    image: "https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg?auto=compress&cs=tinysrgb&w=600",
    date: "Feb 25, 2026",
    readTime: "8 min",
    category: "Wellness",
  },
  {
    id: 6,
    title: "Nail Art Trends You Need to Try",
    excerpt: "From minimalist French tips to elaborate 3D designs — inspiration for your next appointment.",
    image: "https://images.pexels.com/photos/3997375/pexels-photo-3997375.jpeg?auto=compress&cs=tinysrgb&w=600",
    date: "Feb 18, 2026",
    readTime: "3 min",
    category: "Nails",
  },
];

const categories = ["All", "Wellness", "Treatments", "Hair", "Skincare", "Nails"];

const Blog = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = posts.filter(
    (p) => (filter === "All" || p.category === filter) && p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-background overflow-x-hidden">
      <Navbar />
      <section className="pt-32 pb-12 md:pt-40">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <span className="font-body text-xs tracking-[0.3em] uppercase text-primary/60 block mb-4">Beauty Journal</span>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-foreground mb-6">
            Our <span className="italic font-normal text-gradient-gold">Blog</span>
          </h1>
          <p className="font-body text-muted-foreground">Tips, trends, and wisdom from our beauty experts.</p>
        </div>
      </section>

      <section className="pb-20 md:pb-32">
        <div className="container mx-auto px-6">
          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12">
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-card/80 border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-4 py-2 rounded-full font-body text-xs tracking-wider uppercase transition-all duration-300 ${
                    filter === c ? "bg-gradient-gold text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-primary/10"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post) => (
              <article key={post.id} className="group cursor-pointer">
                <div className="bg-card/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-border/50 transition-all duration-500 hover:shadow-luxury hover:-translate-y-2">
                  <div className="relative h-56 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-background/80 backdrop-blur-sm text-xs font-body tracking-wider uppercase text-foreground rounded-full flex items-center gap-1">
                      <Tag size={10} /> {post.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-4 font-body text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="font-body text-sm text-muted-foreground">{post.excerpt}</p>
                    <span className="inline-flex items-center gap-2 font-body text-sm text-primary group-hover:gap-3 transition-all">
                      Read More <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <FooterSection />
    </div>
  );
};

export default Blog;
