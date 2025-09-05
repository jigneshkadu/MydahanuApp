// Database schema and utilities
export interface DatabaseSchema {
  categories: Category[];
  services: Service[];
  banners: Banner[];
  version: string;
  lastUpdated: string;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface Subcategory {
  id: string;
  name: string;
  details: string;
  image: string;
  providerCount: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  gradient: string[];
  subcategories: Subcategory[];
}

export interface Service {
  id: string;
  name: string;
  category: string;
  subcategoryId: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  price: string;
  location: string;
  timing: string;
  phone?: string;
  features?: string[];
}

// Database utilities
export const DatabaseUtils = {
  validateSchema: (data: any): data is DatabaseSchema => {
    return (
      data &&
      Array.isArray(data.categories) &&
      Array.isArray(data.services) &&
      Array.isArray(data.banners) &&
      typeof data.version === 'string'
    );
  },
  
  exportData: (categories: Category[], services: Service[], banners: Banner[]): DatabaseSchema => {
    return {
      categories,
      services,
      banners,
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
    };
  },
  
  generateSampleData: (): DatabaseSchema => {
    return {
      categories: servicesData.categories,
      services: servicesData.services,
      banners: servicesData.banners,
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
    };
  },
};

export const servicesData = {
  categories: [
    {
      id: "cat_events",
      name: "Events",
      icon: "🎉",
      gradient: ["#EC4899", "#F472B6"],
      subcategories: [
        {
          id: "sub_events_1",
          name: "Event Planning & Services",
          details: "Comprehensive planning and execution for all types of events, from corporate gatherings to private celebrations. Includes decorators, DJ, orchestra, and event management.",
          image: "https://picsum.photos/400/300?random=1",
          providerCount: 45,
        },
        {
          id: "sub_events_2",
          name: "Catering & Food",
          details: "High-quality catering services with diverse food options, including bakery and confectionery. Tailored menus for any event size and preference.",
          image: "https://picsum.photos/400/300?random=2",
          providerCount: 32,
        },
        {
          id: "sub_events_3",
          name: "Lighting",
          details: "Professional lighting solutions to enhance the ambiance and ensure clear visibility for your event.",
          image: "https://picsum.photos/400/300?random=3",
          providerCount: 18,
        },
      ],
    },
    {
      id: "cat_medical",
      name: "Medical & Health",
      icon: "🏥",
      gradient: ["#3B82F6", "#60A5FA"],
      subcategories: [
        {
          id: "sub_medical_1",
          name: "Hospitals & Clinics",
          details: "Access to hospitals, clinics, dentists, and skin specialists for comprehensive medical care.",
          image: "https://picsum.photos/400/300?random=4",
          providerCount: 67,
        },
        {
          id: "sub_medical_2",
          name: "Diagnostics & Imaging",
          details: "Sonography centers, MRI services, and other diagnostic imaging facilities.",
          image: "https://picsum.photos/400/300?random=5",
          providerCount: 23,
        },
        {
          id: "sub_medical_3",
          name: "Medical Stores & Pharmacies",
          details: "Wide range of medicines and pharmaceutical services.",
          image: "https://picsum.photos/400/300?random=6",
          providerCount: 89,
        },
        {
          id: "sub_medical_4",
          name: "Veterinary Services",
          details: "Dedicated medical care for pets and animals.",
          image: "https://picsum.photos/400/300?random=7",
          providerCount: 12,
        },
        {
          id: "sub_medical_5",
          name: "Nursing & Home Care",
          details: "Professional nursing care and assistance at home.",
          image: "https://picsum.photos/400/300?random=8",
          providerCount: 34,
        },
        {
          id: "sub_medical_6",
          name: "Ambulance",
          details: "24/7 emergency ambulance services.",
          image: "https://picsum.photos/400/300?random=9",
          providerCount: 8,
        },
        {
          id: "sub_medical_7",
          name: "Blood Banks",
          details: "Blood donation and transfusion services.",
          image: "https://picsum.photos/400/300?random=10",
          providerCount: 5,
        },
      ],
    },
    {
      id: "cat_transport",
      name: "Transport",
      icon: "🚗",
      gradient: ["#10B981", "#34D399"],
      subcategories: [
        {
          id: "sub_transport_1",
          name: "Passenger Transport",
          details: "Private cars, buses, travel agents, and school transport services.",
          image: "https://picsum.photos/400/300?random=11",
          providerCount: 56,
        },
        {
          id: "sub_transport_2",
          name: "Goods Delivery",
          details: "Heavy duty vehicles, small tempos, and pickup services.",
          image: "https://picsum.photos/400/300?random=12",
          providerCount: 43,
        },
        {
          id: "sub_transport_3",
          name: "Ticketing & Booking",
          details: "Travel ticket booking and reservation services.",
          image: "https://picsum.photos/400/300?random=13",
          providerCount: 21,
        },
        {
          id: "sub_transport_4",
          name: "Automobile Services",
          details: "Car and bike service centers, washing, tyre repair, and more.",
          image: "https://picsum.photos/400/300?random=14",
          providerCount: 78,
        },
      ],
    },
    {
      id: "cat_wellness",
      name: "Beauty & Wellness",
      icon: "💆",
      gradient: ["#A855F7", "#C084FC"],
      subcategories: [
        {
          id: "sub_wellness_1",
          name: "Fitness & Gyms",
          details: "Gym, Zumba, Yoga, and meditation classes.",
          image: "https://picsum.photos/400/300?random=15",
          providerCount: 29,
        },
        {
          id: "sub_wellness_2",
          name: "Salons & Spas",
          details: "Beauty parlours, spa, massage services, and hair transformation.",
          image: "https://picsum.photos/400/300?random=16",
          providerCount: 64,
        },
      ],
    },
    {
      id: "cat_home",
      name: "Home & Maintenance",
      icon: "🏠",
      gradient: ["#F59E0B", "#FCD34D"],
      subcategories: [
        {
          id: "sub_home_1",
          name: "Handyman Services",
          details: "Plumber, electrician, carpenter, and painter services.",
          image: "https://picsum.photos/400/300?random=17",
          providerCount: 92,
        },
        {
          id: "sub_home_2",
          name: "Interior Design & Renovation",
          details: "Interior decoration, civil architecture, and contracting.",
          image: "https://picsum.photos/400/300?random=18",
          providerCount: 37,
        },
        {
          id: "sub_home_3",
          name: "Appliance Repair",
          details: "Repair services for home appliances and electronics.",
          image: "https://picsum.photos/400/300?random=19",
          providerCount: 51,
        },
        {
          id: "sub_home_4",
          name: "Electronic Repair",
          details: "Laptop, computer, IT services, and phone repair.",
          image: "https://picsum.photos/400/300?random=20",
          providerCount: 28,
        },
      ],
    },
    {
      id: "cat_housekeeping",
      name: "Housekeeping",
      icon: "🧹",
      gradient: ["#14B8A6", "#5EEAD4"],
      subcategories: [
        {
          id: "sub_housekeeping_1",
          name: "Domestic Help",
          details: "House servants, maids, and cooks.",
          image: "https://picsum.photos/400/300?random=21",
          providerCount: 73,
        },
        {
          id: "sub_housekeeping_2",
          name: "Other Services",
          details: "Milk supply, water supply, and watchman services.",
          image: "https://picsum.photos/400/300?random=22",
          providerCount: 19,
        },
      ],
    },
    {
      id: "cat_food",
      name: "Food & Beverages",
      icon: "🍽️",
      gradient: ["#EAB308", "#FDE047"],
      subcategories: [
        {
          id: "sub_food_1",
          name: "Restaurants",
          details: "Veg, non-veg, street food, and chain restaurants.",
          image: "https://picsum.photos/400/300?random=23",
          providerCount: 156,
        },
        {
          id: "sub_food_2",
          name: "Beverages",
          details: "Tea & coffee shops, ice cream parlours.",
          image: "https://picsum.photos/400/300?random=24",
          providerCount: 47,
        },
      ],
    },
    {
      id: "cat_accommodation",
      name: "Accommodation",
      icon: "🏨",
      gradient: ["#6366F1", "#818CF8"],
      subcategories: [
        {
          id: "sub_accommodation_1",
          name: "Hotels & Lodging",
          details: "Hotels, guest houses, and private bungalows.",
          image: "https://picsum.photos/400/300?random=25",
          providerCount: 38,
        },
        {
          id: "sub_accommodation_2",
          name: "Experiences",
          details: "Agro-tourism and unique accommodation options.",
          image: "https://picsum.photos/400/300?random=26",
          providerCount: 14,
        },
      ],
    },
  ],
  banners: [
    {
      id: "1",
      title: "Special Event Packages",
      description: "Get 20% off on event planning services",
      image: "https://picsum.photos/400/200?random=101",
    },
    {
      id: "2",
      title: "Health Checkup Camp",
      description: "Free health screening this weekend",
      image: "https://picsum.photos/400/200?random=102",
    },
    {
      id: "3",
      title: "Transport Deals",
      description: "Book your ride with exclusive discounts",
      image: "https://picsum.photos/400/200?random=103",
    },
    {
      id: "4",
      title: "Wellness Weekend",
      description: "Spa and salon services at special prices",
      image: "https://picsum.photos/400/200?random=104",
    },
  ],
  services: [
    // Events Services
    {
      id: "srv_1",
      name: "Royal Event Planners",
      category: "Events",
      subcategoryId: "sub_events_1",
      description: "Premium event planning services for weddings, corporate events, and private parties. We handle everything from decoration to catering coordination.",
      image: "https://picsum.photos/400/300?random=201",
      rating: 4.8,
      reviews: 234,
      price: "25,000",
      location: "Dahanu West",
      timing: "9:00 AM - 8:00 PM",
      features: ["Complete Event Management", "Decoration Services", "Vendor Coordination", "24/7 Support"],
    },
    {
      id: "srv_2",
      name: "Delicious Catering Services",
      category: "Events",
      subcategoryId: "sub_events_2",
      description: "Multi-cuisine catering for all occasions. Vegetarian and non-vegetarian options available with customizable menus.",
      image: "https://picsum.photos/400/300?random=202",
      rating: 4.6,
      reviews: 189,
      price: "500/plate",
      location: "Dahanu Road",
      timing: "24/7 Service",
      features: ["Multi-Cuisine Menu", "Live Cooking Stations", "Professional Staff", "Customizable Packages"],
    },
    // Medical Services
    {
      id: "srv_3",
      name: "City Hospital",
      category: "Medical & Health",
      subcategoryId: "sub_medical_1",
      description: "Multi-specialty hospital with 24/7 emergency services, modern equipment, and experienced doctors.",
      image: "https://picsum.photos/400/300?random=203",
      rating: 4.7,
      reviews: 567,
      price: "500",
      location: "Dahanu Central",
      timing: "24/7 Emergency",
      features: ["Emergency Services", "ICU Facility", "Multi-Specialty", "Insurance Accepted"],
    },
    {
      id: "srv_4",
      name: "Quick Diagnostics",
      category: "Medical & Health",
      subcategoryId: "sub_medical_2",
      description: "Advanced diagnostic center with MRI, CT scan, X-ray, and pathology services. Quick and accurate reports.",
      image: "https://picsum.photos/400/300?random=204",
      rating: 4.5,
      reviews: 312,
      price: "1,500",
      location: "Dahanu East",
      timing: "7:00 AM - 9:00 PM",
      features: ["MRI & CT Scan", "Digital X-Ray", "Home Sample Collection", "Online Reports"],
    },
    // Transport Services
    {
      id: "srv_5",
      name: "Swift Cabs",
      category: "Transport",
      subcategoryId: "sub_transport_1",
      description: "Reliable taxi service with AC and non-AC options. Airport transfers and outstation trips available.",
      image: "https://picsum.photos/400/300?random=205",
      rating: 4.4,
      reviews: 423,
      price: "15/km",
      location: "All Dahanu",
      timing: "24/7 Available",
      features: ["GPS Tracking", "AC/Non-AC Options", "Airport Transfers", "Outstation Trips"],
    },
    {
      id: "srv_6",
      name: "Express Delivery",
      category: "Transport",
      subcategoryId: "sub_transport_2",
      description: "Fast and reliable goods delivery service. Small parcels to heavy cargo, we handle it all.",
      image: "https://picsum.photos/400/300?random=206",
      rating: 4.3,
      reviews: 278,
      price: "200",
      location: "Dahanu",
      timing: "8:00 AM - 8:00 PM",
      features: ["Same Day Delivery", "Package Tracking", "Insurance Available", "Bulk Discounts"],
    },
    // Beauty & Wellness
    {
      id: "srv_7",
      name: "FitZone Gym",
      category: "Beauty & Wellness",
      subcategoryId: "sub_wellness_1",
      description: "Modern gym with latest equipment, personal trainers, and group fitness classes including Zumba and Yoga.",
      image: "https://picsum.photos/400/300?random=207",
      rating: 4.6,
      reviews: 156,
      price: "1,500/month",
      location: "Dahanu West",
      timing: "5:00 AM - 10:00 PM",
      features: ["Personal Training", "Group Classes", "Modern Equipment", "Nutrition Guidance"],
    },
    {
      id: "srv_8",
      name: "Glamour Salon & Spa",
      category: "Beauty & Wellness",
      subcategoryId: "sub_wellness_2",
      description: "Premium salon and spa services for men and women. Hair, skin, and body treatments available.",
      image: "https://picsum.photos/400/300?random=208",
      rating: 4.7,
      reviews: 289,
      price: "500",
      location: "Dahanu Market",
      timing: "10:00 AM - 8:00 PM",
      features: ["Hair Treatments", "Skin Care", "Body Spa", "Bridal Packages"],
    },
    // Home Services
    {
      id: "srv_9",
      name: "QuickFix Handyman",
      category: "Home & Maintenance",
      subcategoryId: "sub_home_1",
      description: "Professional plumbing, electrical, carpentry, and painting services. Quick response and quality work guaranteed.",
      image: "https://picsum.photos/400/300?random=209",
      rating: 4.5,
      reviews: 412,
      price: "300/hour",
      location: "All Dahanu",
      timing: "8:00 AM - 7:00 PM",
      features: ["Emergency Service", "Experienced Staff", "Quality Materials", "Warranty on Work"],
    },
    {
      id: "srv_10",
      name: "Dream Interiors",
      category: "Home & Maintenance",
      subcategoryId: "sub_home_2",
      description: "Complete interior design and renovation services. From concept to execution, we transform your space.",
      image: "https://picsum.photos/400/300?random=210",
      rating: 4.8,
      reviews: 98,
      price: "50,000",
      location: "Dahanu",
      timing: "10:00 AM - 6:00 PM",
      features: ["3D Design", "Turnkey Projects", "Custom Furniture", "Post-Project Support"],
    },
    // Food Services
    {
      id: "srv_11",
      name: "Spice Garden Restaurant",
      category: "Food & Beverages",
      subcategoryId: "sub_food_1",
      description: "Multi-cuisine restaurant serving Indian, Chinese, and Continental dishes. Dine-in and home delivery available.",
      image: "https://picsum.photos/400/300?random=211",
      rating: 4.4,
      reviews: 567,
      price: "300",
      location: "Dahanu Beach Road",
      timing: "11:00 AM - 11:00 PM",
      features: ["Multi-Cuisine", "Home Delivery", "Party Orders", "Outdoor Seating"],
    },
    {
      id: "srv_12",
      name: "Cool Sips Cafe",
      category: "Food & Beverages",
      subcategoryId: "sub_food_2",
      description: "Cozy cafe serving premium coffee, tea, shakes, and snacks. Perfect place to work or hang out.",
      image: "https://picsum.photos/400/300?random=212",
      rating: 4.6,
      reviews: 234,
      price: "150",
      location: "Dahanu Station Road",
      timing: "8:00 AM - 10:00 PM",
      features: ["Free WiFi", "AC Seating", "Fresh Beverages", "Light Snacks"],
    },
  ],
};