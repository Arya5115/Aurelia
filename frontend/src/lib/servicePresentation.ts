import facialImg from "@/assets/service-facial.jpg";
import hairImg from "@/assets/service-hair.jpg";
import massageImg from "@/assets/service-massage.jpg";
import nailsImg from "@/assets/service-nails.jpg";
import type { Service } from "@/lib/api";

export const defaultServices: Service[] = [
  {
    id: 1,
    title: "Signature Massage",
    category: "Body",
    duration: "90 min",
    price: "180.00",
    description: "A restorative massage designed to release tension and restore balance.",
    image_url: "",
  },
  {
    id: 2,
    title: "Radiance Facial",
    category: "Skin",
    duration: "75 min",
    price: "150.00",
    description: "A botanical facial treatment focused on glow, hydration, and skin renewal.",
    image_url: "",
  },
  {
    id: 3,
    title: "Luxury Hair Styling",
    category: "Hair",
    duration: "120 min",
    price: "220.00",
    description: "Premium styling and finishing tailored to events and special occasions.",
    image_url: "",
  },
  {
    id: 4,
    title: "Artisan Nail Design",
    category: "Nails",
    duration: "60 min",
    price: "95.00",
    description: "Detailed nail artistry paired with a luxury hand-care experience.",
    image_url: "",
  },
];

const categoryImages: Record<string, string> = {
  body: massageImg,
  massage: massageImg,
  skin: facialImg,
  facial: facialImg,
  hair: hairImg,
  nails: nailsImg,
};

export function getServiceImage(service: Pick<Service, "category" | "title" | "image_url">) {
  if (service.image_url) {
    return service.image_url;
  }

  const normalizedCategory = service.category.trim().toLowerCase();
  if (categoryImages[normalizedCategory]) {
    return categoryImages[normalizedCategory];
  }

  const normalizedTitle = service.title.toLowerCase();
  if (normalizedTitle.includes("massage")) return massageImg;
  if (normalizedTitle.includes("facial")) return facialImg;
  if (normalizedTitle.includes("hair")) return hairImg;
  if (normalizedTitle.includes("nail")) return nailsImg;

  return massageImg;
}
