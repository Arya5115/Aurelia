export const businessInfo = {
  name: "Aurelia Beauty & Spa",
  email: "shiyaaiservices@gmail.com",
  phoneDisplay: "+91 7004349469",
  phoneHref: "tel:+917004349469",
  whatsappDisplay: "+917004349469",
  whatsappDigits: "917004349469",
  locationShort: "Patna, Bihar",
  locationFull: "Patna, Bihar, India",
  mapEmbedUrl: "https://maps.google.com/maps?q=Patna%2C%20Bihar&t=&z=13&ie=UTF8&iwloc=&output=embed",
  hours: [
    "Monday - Friday: 9AM - 8PM",
    "Saturday: 10AM - 6PM",
    "Sunday: 10AM - 4PM",
  ],
};

export const whatsappBookingUrl = `https://wa.me/${businessInfo.whatsappDigits}?text=${encodeURIComponent(
  "Hello Aurelia! I'd like to book an appointment."
)}`;
