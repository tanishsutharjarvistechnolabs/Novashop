import type {
  CartPageData,
  CheckoutPageData,
  HomePageData,
  ProductDetailsPageData,
  ProductPageData,
  ProfilePageData,
  SupportSectionData,
} from "@/interfaces";
import { DELIVERY_MODE, PAYMENT_MODE } from "./enum";

export const supportSectionData: SupportSectionData = {
  eyebrow: "Our Expertise",
  title: "Built for Hospitality. Backed by Expertise.",
  description:
    " Novashop has been supporting hotels and restaurants across East Africa with reliable technology solutions, bringing the right hardware to the right teams.",
  items: [
    {
      id: "support",
      number: "01",
      iconClassName: "icon-messages",
      titleLines: ["Dedicated Customer", "Support"],
      description:
        "Our team understands the pressures of hotel and restaurant operations. We provide prompt, knowledgeable support — from product selection through to installation and after-sales — so your POS never becomes a problem.",
    },
    {
      id: "tailored",
      number: "02",
      iconClassName: "icon-card-pos",
      titleLines: ["Tailored to", "Your Operation"],
      description:
        "Whether you run a boutique restaurant or a multi-outlet hotel, we help you configure the right hardware setup for your specific workflow, volume, and budget. No unnecessary upsells, just the right fit.",
    },
    {
      id: "seamless",
      number: "03",
      iconClassName: "icon-user",
      titleLines: ["Seamless POS", "Integration"],
      description:
        "Every product stocked on Novashop is tested for compatibility with Oracle MICROS and leading cloud-based POS platforms — ensuring your hardware, software, and team all work in sync from day one.",
    },
  ],
};
export const supportSectionDataForProduct: SupportSectionData = {
  eyebrow: "Our Expertise",
  title: "Every Order Backed",
  description:
    "When you buy from Novashop, you get more than just hardware — you get the expertise of a team that lives and breathes hospitality technology.",
  items: [
    {
      id: "support",
      number: "01",
      iconClassName: "icon-messages",
      titleLines: ["Dedicated Customer", "Support"],
      description:
        "Questions about Oracle MICROS card compatibility or setup? Our support team responds within one business day and can assist with back-office configuration for your property.",
    },
    {
      id: "bulk-orders",
      number: "02",
      iconClassName: "icon-card-pos",
      titleLines: ["Bulk & Custom", "Orders Welcome"],
      description:
        "Equipping a new hotel opening or refreshing staff cards across multiple outlets? Contact us for volume pricing and custom encoding options tailored to your team structure.",
    },
    {
      id: "integration",
      number: "03",
      iconClassName: "icon-user",
      titleLines: ["Integrated Hospitality", "Expertise"],
      description:
        "Novashop has helped outfit hotels and restaurants across Kenya with Oracle MICROS systems and accessories. We don't just sell you the product — we understand how it fits into your daily operation.",
    },
  ],
};

export const homePageData: HomePageData = {
  heroSlides: {
    id: "workstation-main",
    eyebrow: "Power Your Restaurant. Elevate Your Hotel.",
    title: "POS Hardware, Accessories & Consumables for Hospitality",
    description:
      "Shop workstations, POS printers, cash drawers, paper rolls, ribbons, and employee access cards for hotels, restaurants, cafés, and retail operations.",
    imageSrc: "/assets/images/banner-img1.jpg",
    imageAlt: "Workstation hero banner",
    ctaLabel: "Shop Now",
    ctaHref: "#products",
  },
  featuredIntro: {
    eyebrow: "Novashop",
    title: "The Hardware Behind Kenya's Best Hospitality Operations",
    description:
      "From bustling hotel lobbies to high-volume restaurant kitchens, Novashop supplies the POS hardware your team depends on every shift. We stock Oracle MICROS workstations, cash drawers, thermal printers, paper rolls, ribbons, and employee access cards — all available for fast delivery across Kenya.",
  },
  featuredProducts: [
    {
      id: "maintenance-1",
      title: "Regular Maintenance",
      description:
        "Keep in mind that you may need to change your oil more frequently if the driving you do is considered severe.",
      imageSrc: "/assets/images/product-img1.jpg",
      imageAlt: "Regular maintenance package",
      href: "/product-details",
    },
    {
      id: "maintenance-2",
      title: "Regular Maintenance",
      description:
        "Keep in mind that you may need to change your oil more frequently if the driving you do is considered severe.",
      imageSrc: "/assets/images/product-img1.jpg",
      imageAlt: "Regular maintenance offering",
      href: "/product-details",
    },
    {
      id: "maintenance-3",
      title: "Regular Maintenance",
      description:
        "Keep in mind that you may need to change your oil more frequently if the driving you do is considered severe.",
      imageSrc: "/assets/images/product-img1.jpg",
      imageAlt: "Regular maintenance product",
      href: "/product-details",
    },
  ],
  servicesIntro: {
    eyebrow: "our products",
    title: "Our Products",
    description:
      "Everything your front-of-house and back-of-house teams need, in one place. Shop by category or browse the full range of Novashop-stocked POS hardware below.",
    imageSrc: "/assets/images/product-full.png",
    imageAlt: "Product showcase",
  },
  services: [
    {
      id: "service-01",
      number: "H600016",
      title: "Zclipse 2-Part NCRPaper Roll 76x60 — Pack of 5",
      description:
        "Two-ply NCR carbonless paper rolls for dot-matrix kitchen and bar printers.Produces a crisp customer copy and a clean kitchen duplicate — essential for high-volume food and beverage operations.",
      imageSrc: "/assets/images/service-img1.jpg",
      imageAlt: "Drop off your vehicle",
      href: "/product-details",
    },
    {
      id: "service-02",
      number: "02",
      title: "Drop off your vehicle",
      description:
        "Zclipse printer ribbon designed for use with TM-U200 series printers. Provides clear, consistent printing for receipts and impact printing applications, with a dual-colour output for standard and highlight text.",
      imageSrc: "/assets/images/service-img2.jpg",
      imageAlt: "Vehicle service two",
      href: "/product-details",
    },
    {
      id: "service-03",
      number: "03",
      title: "Drop off your vehicle",
      description:
        "Zclipse printer ribbon designed for use with TM-U200 series printers. Provides clear, consistent printing for receipts and impact printing applications, with a dual-colour output for standard and highlight text.",
      imageSrc: "/assets/images/service-img3.jpg",
      imageAlt: "Vehicle service three",
      href: "/product-details",
    },
    {
      id: "service-04",
      number: "04",
      title: "Drop off your vehicle",
      description:
        "Zclipse printer ribbon designed for use with TM-U200 series printers. Provides clear, consistent printing for receipts and impact printing applications, with a dual-colour output for standard and highlight text.",
      imageSrc: "/assets/images/service-img4.jpg",
      imageAlt: "Vehicle service four",
      href: "/product-details",
    },
    {
      id: "service-05",
      number: "05",
      title: "Drop off your vehicle",
      description:
        "Zclipse printer ribbon designed for use with TM-U200 series printers. Provides clear, consistent printing for receipts and impact printing applications, with a dual-colour output for standard and highlight text.",
      imageSrc: "/assets/images/service-img5.jpg",
      imageAlt: "Vehicle service five",
      href: "/product-details",
    },
    {
      id: "service-06",
      number: "06",
      title: "Drop off your vehicle",
      description:
        "Zclipse printer ribbon designed for use with TM-U200 series printers. Provides clear, consistent printing for receipts and impact printing applications, with a dual-colour output for standard and highlight text.",
      imageSrc: "/assets/images/service-img6.jpg",
      imageAlt: "Vehicle service six",
      href: "/product-details",
    },
  ],
};

export const productPageData: ProductPageData = {
  banner: {
    title: "Workstation",
    imageSrc: "/assets/images/inner-banner-img1.jpg",
    imageAlt: "Workstation category banner",
  },
  categories: [
    { id: "ribbons", name: "Ribbons", count: 5, href: "/product" },
    { id: "paper-roll", name: "Paper Roll", count: 2, href: "/product" },
    { id: "cards", name: "Cards", count: 4, href: "/product" },
    { id: "kitchen-display", name: "Kitchen Display", count: 3, href: "/product" },
    { id: "workstation", name: "Workstation", count: 2, href: "/product" },
    { id: "scanner", name: "Scanner", count: 2, href: "/product" },
  ],
  promo: {
    title: "POS Hardware & Accessories for Hotels and Restaurants",
    description:
      "Shop the full Novashop range — from Oracle MICROS workstations and cash drawers to thermal rolls, ribbons, and employee access cards.",
    imageSrc: "/assets/images/inner-banner-img1.jpg",
    imageAlt: "Featured category highlight",
  },
  products: [
    {
      id: "workstation-6-series-1",
      title: "Workstation 6 Series",
      price: 144.38,
      imageSrc: "/assets/images/inner-pro-img1.jpg",
      imageAlt: "Workstation 6 Series terminal",
      detailsHref: "/product-details",
      actionLabel: "GO TO Cart",
      actionHref: "/cart",
    },
    {
      id: "workstation-6-series-2",
      title: "Workstation 6 Series",
      price: 144.38,
      imageSrc: "/assets/images/inner-pro-img2.jpg",
      imageAlt: "Workstation 6 Series device",
      detailsHref: "/product-details",
      actionLabel: "GO TO Cart",
      actionHref: "/cart",
    },
    {
      id: "workstation-6-series-3",
      title: "Workstation 6 Series",
      price: 144.38,
      imageSrc: "/assets/images/inner-pro-img3.jpg",
      imageAlt: "Workstation 6 Series accessory",
      detailsHref: "/product-details",
      actionLabel: "GO TO Cart",
      actionHref: "/cart",
    },
    {
      id: "workstation-6-series-4",
      title: "Workstation 6 Series",
      price: 144.38,
      imageSrc: "/assets/images/inner-pro-img4.jpg",
      imageAlt: "Workstation 6 Series setup",
      detailsHref: "/product-details",
      actionLabel: "GO TO Cart",
      actionHref: "/cart",
    },
    {
      id: "workstation-6-series-5",
      title: "Workstation 6 Series",
      price: 144.38,
      imageSrc: "/assets/images/inner-pro-img5.jpg",
      imageAlt: "Workstation 6 Series display",
      detailsHref: "/product-details",
      actionLabel: "GO TO Cart",
      actionHref: "/cart",
    },
  ],
};

export const productDetailsPageData: ProductDetailsPageData = {
  banner: {
    title: "Oracle Workstation",
    imageSrc: "/assets/images/inner-banner-img1.jpg",
    imageAlt: "Oracle Workstation banner",
  },
  gallery: [
    "/assets/images/inner-pro-img1.jpg",
    "/assets/images/inner-pro-img1.jpg",
    "/assets/images/inner-pro-img1.jpg",
    "/assets/images/inner-pro-img1.jpg",
    "/assets/images/inner-pro-img1.jpg",
  ],
  title: "Workstation 6 POS Terminals",
  sku: "IVS-2240",
  inventory: "In Stock",
  price: 38.26,
  description: [
    "Our POS terminals help restaurants skip the expensive, up-front investment in POS hardware. Talk to an Oracle product expert about taking advantage of our US$1 POS hardware offer and switching to Simphony, our cloud-based restaurant management platform.",
    "The Workstation 6 Series combines stylish modern design with the industry's most durable components. Not only do Workstation 6 terminals look good - they are built to run on the latest restaurant technology. Check out the latest specs for the full suite of Workstation 6 hardware below.",
  ],
  policies: [
    { id: "warranty", iconClassName: "icon-box", label: "2 years warranty" },
    { id: "delivery", iconClassName: "icon-truck-fast", label: "Delivery time: 1-2 business days" },
  ],
  paymentImageSrc: "/assets/images/payment-2.png",
  paymentImageAlt: "Available payment methods",
  tabs: [
    {
      id: "description",
      title: "Description",
      paragraphs: [
        "Nulla soluta corporis molestiae. Quo tempore beatae quas quae omnis. Recusandae voluptatem voluptas accusantium doloribus dolor.",
        "Velit et aut necessitatibus aspernatur nihil. Qui quidem cum expedita officiis. Corporis in et ut. Consequatur aut ab sit non sed quia.",
        "Aliquam unde aliquam laboriosam. Vitae quibusdam ducimus sit labore alias ea. Cum facilis sequi unde. Qui voluptatum voluptas voluptatem amet. Natus assumenda et consectetur nesciunt maxime architecto.",
        "Sint consequatur voluptas quaerat similique sunt. Quasi perspiciatis animi qui. Velit dolorum sint odit suscipit nostrum cumque sunt.",
        "Dolore ipsam repellat iste ad. Similique sapiente id molestiae illo. Vel quisquam eos id voluptatem. Magni ut labore aliquam corrupti repellat optio ea.",
      ],
    },
    {
      id: "additional-information",
      title: "Additional information",
      paragraphs: [
        "Nulla soluta corporis molestiae. Quo tempore beatae quas quae omnis. Recusandae voluptatem voluptas accusantium doloribus dolor.",
        "Velit et aut necessitatibus aspernatur nihil. Qui quidem cum expedita officiis. Corporis in et ut. Consequatur aut ab sit non sed quia.",
        "Aliquam unde aliquam laboriosam. Vitae quibusdam ducimus sit labore alias ea. Cum facilis sequi unde. Qui voluptatum voluptas voluptatem amet. Natus assumenda et consectetur nesciunt maxime architecto.",
        "Sint consequatur voluptas quaerat similique sunt. Quasi perspiciatis animi qui. Velit dolorum sint odit suscipit nostrum cumque sunt.",
        "Dolore ipsam repellat iste ad. Similique sapiente id molestiae illo. Vel quisquam eos id voluptatem. Magni ut labore aliquam corrupti repellat optio ea.",
      ],
    },
  ],
  trustItems: [
    { id: "trust-warranty", iconClassName: "icon-medal-star", label: "Warranty" },
    { id: "trust-payment", iconClassName: "icon-card-pos", label: "Secure Payment" },
  ],
};

export const cartPageData: CartPageData = {
  banner: {
    title: "Your cart & checkout",
    imageSrc: "/assets/images/inner-banner-img6.jpg",
    imageAlt: "Cart banner",
  },
  items: [
    {
      id: "cart-item-1",
      name: "Workstation 6 POS Terminals",
      sku: "IVS-2240",
      price: 2250,
      quantity: 1,
      imageSrc: "/assets/images/inner-pro-img1.jpg",
      imageAlt: "Workstation 6 POS Terminals",
    },
    {
      id: "cart-item-2",
      name: "Workstation 6 POS Terminals",
      sku: "IVS-2240",
      price: 2500,
      quantity: 1,
      imageSrc: "/assets/images/inner-pro-img1.jpg",
      imageAlt: "Workstation 6 POS Terminals",
    },
    {
      id: "cart-item-3",
      name: "Workstation 6 POS Terminals",
      sku: "IVS-2240",
      price: 2500,
      quantity: 1,
      imageSrc: "/assets/images/inner-pro-img1.jpg",
      imageAlt: "Workstation 6 POS Terminals",
    },
  ],
  vatRate: 0.16,
  deliveryFee: 500,
};

export const checkoutPageData: CheckoutPageData = {
  banner: {
    title: "Your cart & checkout",
    imageSrc: "/assets/images/inner-banner-img1.jpg",
    imageAlt: "Checkout banner",
  },
  vatRate: 0.16,
  deliveryFee: 500,
  deliveryOptions: [
    {
      id: DELIVERY_MODE.DELIVERY,
      title: "Delivery to address",
      description: "Estimated 3-5 business days",
      badge: "+ KES 500",
      badgeClassName: "badge-cost",
    },
    {
      id: DELIVERY_MODE.COLLECTION,
      title: "Self-collection (warehouse pickup)",
      description: "Ready within 24 hrs - Industrial Area, Nairobi",
      badge: "FREE",
      badgeClassName: "badge-free",
    },
  ],
  paymentOptions: [
    {
      id: PAYMENT_MODE.ON_COLLECTION,
      title: "Pay on collection",
      description: "Cash or card at pickup",
      badge: "",
      badgeClassName: "",
    },
    {
      id: PAYMENT_MODE.ONLINE,
      title: "Pay online",
      description: "Card, M-Pesa or bank",
      badge: "",
      badgeClassName: "",
    },
  ],
  deliveryAddress: {
    label: "Delivery Address",
    name: "Daniel Mwangi",
    lines: [
      "House No. 24, Kileleshwa Estate",
      "Oloitoktok Road, P.O. Box 12345-00100",
      "Nairobi, Kenya",
    ],
    phone: "+91 1234 5678 90",
  },
  warehouseAddress: {
    label: "Warehouse Address",
    name: "Sunrise Traders Ltd.",
    lines: [
      "Unit 5, Industrial Area,",
      "Enterprise Road, P.O. Box 67890-00200",
      "Nairobi, Kenya",
    ],
    phone: "+91 1234 5678 90",
    mapLabel: "View Warehouse Location on Map",
  },
  cardFields: [
    { id: "card-number", placeholder: "Enter Card number", className: "col-12 mb-3" },
    { id: "card-expiry", placeholder: "Enter Expiry", className: "col-lg-6 col-md-6 col-sm-12 col-12 mb-3" },
    { id: "card-cvv", placeholder: "Enter CVV", className: "col-lg-6 col-md-6 col-sm-12 col-12 mb-3" },
  ],
  customerFields: [
    { id: "name", placeholder: "Name", className: "col-12 mb-3" },
    { id: "mobile", placeholder: "Mobile", className: "col-lg-6 col-md-6 col-sm-12 col-12 mb-3" },
    { id: "email", placeholder: "Email Address", className: "col-lg-6 col-md-6 col-sm-12 col-12 mb-3" },
    { id: "street", placeholder: "Street address", className: "col-12 mb-3" },
    { id: "region", placeholder: "County / region", className: "col-lg-6 col-md-6 col-sm-12 col-12 mb-3" },
  ],
  countries: ["Country", "Kenya", "Uganda", "Tanzania"],

};

export const profilePageData: ProfilePageData = {
  banner: {
    title: "Profile",
    imageSrc: "/assets/images/inner-banner-img2.jpg",
    imageAlt: "Profile banner",
  },
  user: {
    fullName: "Daniel Mwangi",
    email: "ganielmwangi@mail.com",
  },
  details: {
    fullName: "Daniel Mwangi",
    mobile: "+91 1234 5678 90",
    email: "ganielmwangi@mail.com",
    street: "House No. 24, Kileleshwa Estate, Oloitoktok Road",
    city: "Nairobi",
    postalCode: "12345-00100",
    region: "Nairobi",
    country: "Kenya",
  },
  countryOptions: ["Kenya", "Uganda", "Tanzania"],
};

export function formatKes(value: number, fractionDigits = 2) {
  return `KES ${value.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}
