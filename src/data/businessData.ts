export interface BusinessDetails {
  name: string;
  kannadaName: string;
  category: string;
  address: {
    plot: string;
    area: string;
    road: string;
    city: string;
    state: string;
    pincode: string;
    full: string;
  };
  phone: string;
  phoneRaw: string;
  whatsappUrl: string;
  googleMapsRating: number;
  reviewsCount: number;
  googleMapsDirectionsUrl: string;
  embedMapUrl: string;
}

export const BUSINESS_DETAILS: BusinessDetails = {
  name: "SHRIYA RICE MILLS",
  kannadaName: "ಶ್ರಿಯಾ ಅಕ್ಕಿ ಗಿರಣಿಗಳು",
  category: "Manufacturer",
  address: {
    plot: "Plot No. 116 & 117",
    area: "Industrial Growth Center",
    road: "Raichur-Hyderabad Road",
    city: "Raichur",
    state: "Karnataka",
    pincode: "584134",
    full: "Plot No. 116 & 117, Industrial Growth Center, Raichur-Hyderabad Road, Raichur, Karnataka 584134."
  },
  phone: "+91 99455 96061",
  phoneRaw: "919945596061",
  whatsappUrl: "https://wa.me/919945596061",
  googleMapsRating: 3.0,
  reviewsCount: 10,
  googleMapsDirectionsUrl: "https://www.google.com/maps/search/?api=1&query=Plot+No.+116+%26+117,+Industrial+Growth+Center,+Raichur-Hyderabad+Road,+Raichur,+Karnataka+584134",
  // Google Maps embed URL for Industrial Growth Center Raichur
  embedMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15328.790587289565!2d77.3824599!3d16.2087522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc9d023c0b05b3d%3A0x647ad2b2203708df!2sRaichur%20Industrial%20Growth%20Center!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
};

export interface ProductItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  specStatus: string;
  proposedItems: string[];
  inquiryPlaceholder: string;
}

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: "rice",
    title: "Rice",
    subtitle: "Milled & Cleaned Grains",
    description: "Proposed product showcase for finished and polished rice grains processed directly at the mill in Raichur.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80",
    specStatus: "Variety names, grades & packaging sizes awaiting confirmation from business owner",
    proposedItems: [
      "Custom Packaging & Bag Sizes (Subject to Confirmation)",
      "Quality Sorting & Grain Sizing",
      "Bulk Wholesale & Commercial Orders",
      "Awaiting Mill Owner's Specific Variety List"
    ],
    inquiryPlaceholder: "Enquire about Rice availability & specifications"
  },
  {
    id: "paddy",
    title: "Paddy",
    subtitle: "Locally Sourced Raw Harvest",
    description: "High quality paddy sourced from the fertile agricultural belt of the Tungabhadra and Krishna river basin in Raichur.",
    image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1000&q=80",
    specStatus: "Moisture parameters & lot sizes awaiting confirmation from business owner",
    proposedItems: [
      "Raw Harvest Paddy Inflow",
      "Direct Procurement & Processing",
      "Moisture & Moisture Content Checks",
      "Awaiting Mill Owner's Lot Specifications"
    ],
    inquiryPlaceholder: "Enquire about Paddy sourcing & milling"
  },
  {
    id: "processed-products",
    title: "Processed Rice Products",
    subtitle: "By-Products & Secondary Milling Outputs",
    description: "Proposed listing for secondary milling products produced during the rice husk and polishing cycles.",
    image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1000&q=80",
    specStatus: "Product categories & availability awaiting confirmation from business owner",
    proposedItems: [
      "Rice Broken / Grits (Proposed)",
      "Rice Bran for Oil / Feed Processing (Proposed)",
      "Rice Husk & Hull Material (Proposed)",
      "Awaiting Mill Owner's Specific Output Confirmation"
    ],
    inquiryPlaceholder: "Enquire about Processed Rice by-products"
  }
];

export interface FacilityItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  points: string[];
  disclaimer: string;
}

export const FACILITIES_DATA: FacilityItem[] = [
  {
    id: "milling-machinery",
    title: "Rice Milling Machinery",
    tagline: "Proposed Category: Milling & De-husking Units",
    description: "Modern rice milling machinery setups typically include pre-cleaners, rubber roll de-huskers, paddy separators, emery and polisher cones, and color sorters to ensure clean grain output.",
    image: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=1000&q=80",
    points: [
      "Proposed Grain Cleaning & Destoning Area",
      "Proposed Hulling & Polishing System",
      "Proposed Grading & Length Separation Setup",
      "Clean Process Flow Architecture"
    ],
    disclaimer: "Proposed website category until verified with Shriya Rice Mills."
  },
  {
    id: "paddy-processing",
    title: "Paddy Processing",
    tagline: "Proposed Category: Drying & Preparation",
    description: "Structured processing flow for incoming raw paddy harvest, ensuring optimal moisture balance and pre-cleaning before entry into the milling sequence.",
    image: "https://images.unsplash.com/photo-1592997571659-0b21ff64313b?auto=format&fit=crop&w=1000&q=80",
    points: [
      "Proposed Moisture Monitoring Workflow",
      "Proposed Aerated Drying Operations",
      "Proposed Pre-cleaner Dust Removal",
      "Raw Paddy Batch Management"
    ],
    disclaimer: "Proposed website category until verified with Shriya Rice Mills."
  },
  {
    id: "storage-handling",
    title: "Storage and Handling",
    tagline: "Proposed Category: Warehousing & Bagging",
    description: "Dedicated industrial storage and logistics area situated within the Raichur Industrial Growth Center for bulk paddy bags and finished rice storage.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
    points: [
      "Proposed Ventilated Warehousing Space",
      "Proposed Bagging & Stacking Logistics",
      "Easy Truck Access via Raichur-Hyderabad Highway",
      "Safe Handling & Material Protection"
    ],
    disclaimer: "Proposed website category until verified with Shriya Rice Mills."
  }
];

export interface GalleryItem {
  id: number;
  title: string;
  category: "all" | "paddy" | "rice" | "milling" | "storage";
  categoryLabel: string;
  image: string;
  caption: string;
}

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: 1,
    title: "Golden Paddy Fields",
    category: "paddy",
    categoryLabel: "Paddy Harvest",
    image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1200&q=80",
    caption: "Lush golden paddy ready for harvest in the fertile agricultural belts of Karnataka."
  },
  {
    id: 2,
    title: "Raw & Polished Rice Grains",
    category: "rice",
    categoryLabel: "Rice Grains",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80",
    caption: "Carefully sorted clean grains ready for packaging and customer supply."
  },
  {
    id: 3,
    title: "Industrial Milling Facility",
    category: "milling",
    categoryLabel: "Milling Machinery",
    image: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=1200&q=80",
    caption: "Modern industrial machinery infrastructure representation for grain milling."
  },
  {
    id: 4,
    title: "Rice Processing Operations",
    category: "milling",
    categoryLabel: "Processing",
    image: "https://images.unsplash.com/photo-1592997571659-0b21ff64313b?auto=format&fit=crop&w=1200&q=80",
    caption: "Quality monitoring during systematic grain de-husking and polishing."
  },
  {
    id: 5,
    title: "Storage & Bagged Handling",
    category: "storage",
    categoryLabel: "Storage & Handling",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    caption: "Spacious industrial storage and handling setup within the Industrial Growth Center."
  },
  {
    id: 6,
    title: "Paddy Grain Texture & Quality",
    category: "rice",
    categoryLabel: "Rice Grains",
    image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=1200&q=80",
    caption: "Wholesome natural grains reflecting quality grain selection and processing standards."
  }
];
