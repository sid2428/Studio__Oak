import logo from "./logo.svg";
import upload_area from "./upload_area.png";
import main_banner from "./main_banner.png";
import living_room from "./living_room.png";
import kitchen from "./kitchen.png";
import bedroom from "./bedroom.png";
import dining_room from "./dining_room.png";
import office from "./office.png";
import outdoor from "./outdoor.png";
import kid_room from "./kid_room.png";
import decore from "./decore.png";

import design_icon from "./design_icon.svg";
import craftsmanship_icon from "./craftsmanship_icon.svg";
import sustainable_icon from "./sustainable_icon.svg";
import assembly_icon from "./assembly_icon.svg";
import subtle_pattern from "./subtle_pattern.svg";
import box_icon from "./box_icon.svg";
import moodboard_bg from "./moodboard_bg.png"; 


export const assets = {
  logo,
  living_room,
  dining_room,
  kitchen,
  bedroom,
  office,
  decore,
  outdoor,
  kid_room,
  main_banner,
  upload_area,
  box_icon,
  design_icon,
  craftsmanship_icon,
  sustainable_icon,
  assembly_icon,
  subtle_pattern,
  moodboard_bg,
};

export const categories = [
  {
    text: "Living Room",
    path: "living room",
    image: living_room,
  },
  {
    text: "Bedroom",
    path: "bedroom",
    image: bedroom,
  },
  {
    text: "Dining Room",
    path: "dining room",
    image: dining_room,
  },
  {
    text: "Kitchen",
    path: "kitchen",
    image: kitchen,
  },
  {
    text: "Office",
    path: "office",
    image: office,
  },
  {
    text: "Outdoor",
    path: "outdoor",
    image: outdoor,
  },
  {
    text: "Kid's Room",
    path: "kid's room",
    image: kid_room,
  },
  {
    text: "Decor & Accent",
    path: "decor accent furniture",
    image: decore,
  },
];

// Find and replace the entire footerLinks array with this:
export const footerLinks = [
  {
    title: "Shop",
    links: [
      { text: "All Products", url: "/products" },
      { text: "Living Room", url: "/products/living room" }, // Corrected path
      { text: "Bedroom", url: "/products/bedroom" },       // Corrected path
      { text: "Dining", url: "/products/dining room" },     // Corrected path
    ],
  },
  {
    title: "Support",
    links: [
      { text: "Contact Us", url: "#" }, // This can be a link to a contact page later
      { text: "Shipping & Returns", url: "/FAQ" }, // Pointing to FAQ
      { text: "FAQ", url: "/FAQ" },
    ],
  },
];

export const features = [
  {
    icon: design_icon,
    title: "Timeless Design",
    description: "Curated pieces that blend modern style with classic comfort.",
  },
  {
    icon: craftsmanship_icon,
    title: "Quality Craftsmanship",
    description: "Built to last with premium materials and attention to detail.",
  },
  {
    icon: sustainable_icon,
    title: "Sustainable Materials",
    description: "Responsibly sourced wood and eco-friendly fabrics for your peace of mind.",
  },
  {
    icon: assembly_icon,
    title: "Hassle-Free Assembly",
    description: "Clear instructions and thoughtful design make setup a breeze.",
  },
];

export const dummyProducts = [
  // Living Room
  {
    _id: "lr001",
    name: "Modern Sofa",
    category: "living-room",
    price: 899,
    offerPrice: 799,
    image: [living_room],
    description: [
      "Comfortable and stylish",
      "High-density foam cushions",
      "Perfect for any modern living space",
    ],
    inStock: true,
  },
  // Kids Room
  {
    _id: "kr001",
    name: "Bunk Bed",
    category: "kids-room",
    price: 599,
    offerPrice: 499,
    image: [kid_room],
    description: [
      "Space-saving design",
      "Sturdy wooden frame",
      "Includes built-in ladder",
    ],
    inStock: true,
  },
  // Decor & Accent
  {
    _id: "da001",
    name: "Accent Chair",
    category: "decor-accent-furniture",
    price: 249,
    offerPrice: 199,
    image: [decore],
    description: [
      "Elegant and comfortable",
      "Adds a pop of color to any room",
      "Perfect for reading nooks",
    ],
    inStock: true,
  },
    // Bedroom
    {
        _id: "br001",
        name: "Queen Size Bed",
        category: "bedroom",
        price: 699,
        offerPrice: 599,
        image: [bedroom],
        description: [
            "Elegant wooden frame",
            "Includes headboard",
            "Easy to assemble",
        ],
        inStock: true,
    },
    // Dining Room
    {
        _id: "dr001",
        name: "Dining Table Set",
        category: "dining-room",
        price: 799,
        offerPrice: 699,
        image: [dining_room],
        description: [
            "Seats up to 6 people",
            "Solid wood construction",
            "Includes 4 chairs",
        ],
        inStock: true,
    },
];

export const dummyAddress = [
  {
    _id: "67b5b9e54ea97f71bbc196a0",
    userId: "67b5880e4d09769c5ca61644",
    firstName: "Great",
    lastName: "Stack",
    email: "user.greatstack@gmail.com",
    street: "Street 123",
    city: "Main City",
    state: "New State",
    zipcode: 123456,
    country: "IN",
    phone: "1234567890",
  },
];

export const dummyOrders = [
  {
    _id: "67e2589a8f87e63366786400",
    userId: "67b5880e4d09769c5ca61644",
    items: [
      {
        product: dummyProducts[3],
        quantity: 2,
        _id: "67e2589a8f87e63366786401",
      },
    ],
    amount: 89,
    address: dummyAddress[0],
    status: "Order Placed",
    paymentType: "Online",
    isPaid: true,
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
  },
  {
    _id: "67e258798f87e633667863f2",
    userId: "67b5880e4d09769c5ca61644",
    items: [
      {
        product: dummyProducts[0],
        quantity: 1,
        _id: "67e258798f87e633667863f3",
      },
      {
        product: dummyProducts[1],
        quantity: 1,
        _id: "67e258798f87e633667863f4",
      },
    ],
    amount: 43,
    address: dummyAddress[0],
    status: "Order Placed",
    paymentType: "COD",
    isPaid: false,
    createdAt: "2025-03-25T07:17:13.068Z",
    updatedAt: "2025-03-25T07:17:13.068Z",
  },
];