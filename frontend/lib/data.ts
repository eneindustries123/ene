export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  specifications: Record<string, string>;
  imageUrl: string;
  features: string[];
  isPublished: boolean;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  imageUrl: string;
  division: 'solar' | 'trading' | 'fabrication';
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  client: string;
  location: string;
  capacity: string;
  category: string;
  completionYear: number;
  summary: string;
  fullStory: string;
  mainImage: string;
  gallery: string[];
  isFeatured: boolean;
  status?: 'published' | 'draft' | 'archived';
}

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  company: string;
  avatarUrl: string;
  rating: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishDate: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  category: string;
  featuredImage: string;
  readTime: string;
  content: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SolarPackage {
  capacity: string;
  suitableFor: string;
  systemCategory: string;
  onGrid: boolean;
  hybrid: boolean;
  estimatedGeneration: string;
  typicalUsage: string;
  components: string[];
}

export interface CommitteeMember {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  linkedinUrl?: string;
}

export const INITIAL_METRICS = {
  yearsExperience: '10',
  yearsSub: 'Years of Experience',
  annualProduction: '50MW',
  productionSub: 'Annual Production',
  efficiency: '100%',
  efficiencySub: 'Efficiency',
};

export const RESIDENTIAL_PACKAGES: SolarPackage[] = [
  {
    capacity: '3KW',
    suitableFor: 'Small Homes & Apartments',
    systemCategory: 'Residential Solar Array',
    onGrid: true,
    hybrid: true,
    estimatedGeneration: '350 - 400 Units / Month',
    typicalUsage: '1 AC (1 Ton), Fans, Lights, Refrigerator, LED TV',
    components: ['Tier-1 Monocrystalline Solar Panels', '3KW Smart Inverter', 'Aluminum Mounting Structures', 'DC/AC Protection Box'],
  },
  {
    capacity: '5KW',
    suitableFor: 'Medium Residences & Small Offices',
    systemCategory: 'Residential / Commercial Hybrid',
    onGrid: true,
    hybrid: true,
    estimatedGeneration: '600 - 700 Units / Month',
    typicalUsage: '2 ACs (1.5 Ton), Inverter Refrigerator, Water Pump, Fans, Lights',
    components: ['High-Efficiency Solar Modules', '5KW Hybrid Dual-MPPT Inverter', 'Custom Structural Mounting', 'Complete Wiring & Protection'],
  },
  {
    capacity: '10KW',
    suitableFor: 'Large Homes, Villas & Commercial Shops',
    systemCategory: 'High-Capacity Residential / Commercial',
    onGrid: true,
    hybrid: true,
    estimatedGeneration: '1,200 - 1,400 Units / Month',
    typicalUsage: '3-4 ACs, Heavy Water Pump, Deep Freezers, Full Household Load',
    components: ['Bifacial High-Efficiency Panels', '10KW Three-Phase Hybrid Inverter', 'Heavy-Duty Galvanized Structures', 'Net Metering Compatible Box'],
  },
  {
    capacity: '20KW',
    suitableFor: 'Commercial Buildings & Industrial Outlets',
    systemCategory: 'Commercial & Industrial Grid',
    onGrid: true,
    hybrid: true,
    estimatedGeneration: '2,400 - 2,800 Units / Month',
    typicalUsage: 'Commercial HVAC, Multiple Computers, Manufacturing Machinery, Large Facilities',
    components: ['Tier-1 Solar Arrays', '20KW Commercial String Inverter', 'Elevated Structural Mounting', 'Surge & Ground Protection Systems'],
  },
  {
    capacity: '30KW',
    suitableFor: 'Factories, Agricultural Facilities & Schools',
    systemCategory: 'Industrial & Agricultural Infrastructure',
    onGrid: true,
    hybrid: true,
    estimatedGeneration: '3,600 - 4,200 Units / Month',
    typicalUsage: 'Heavy Machinery, Water Pumping Tubewells, Industrial Load Balancing',
    components: ['Utility Grade Solar Panels', '30KW Industrial Grid Inverter', 'Custom Steel Shed Fabrication', 'Automated SCADA Telemetry'],
  },
];

export const COMMITTEE_MEMBERS: CommitteeMember[] = [
  {
    name: 'Asjed Mehnood',
    role: 'Executive Committee Member',
    bio: 'Leads strategic engineering operations, procurement contracts, and multi-divisional project execution across E&E Industrial Corporation.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  },
  {
    name: 'Malik Waqar Ahmed',
    role: 'Executive Committee Member',
    bio: 'Oversees structural design, PEB fabrication standards, technical supply chain management, and client relationships.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Tier-1 Monocrystalline Solar Panels',
    slug: 'tier-1-monocrystalline-solar-panels',
    category: 'Solar Panels',
    description: 'High-efficiency PERC half-cut and N-Type TOPCon solar modules engineered for maximum irradiance conversion under extreme climate conditions.',
    specifications: {
      'Max Power Output': '550W - 670W',
      'Module Efficiency': '22.8%',
      'Cell Technology': 'N-Type TOPCon / Half-Cut',
      'Warranty': '25 Years Linear Power Warranty',
    },
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
    features: ['Anti-reflective tempered glass', 'PID & LID resistant', 'Low-light performance optimization', 'IEC & UL certified'],
    isPublished: true,
  },
  {
    id: 'prod-2',
    title: 'On-Grid & Hybrid Solar Inverters',
    slug: 'on-grid-hybrid-solar-inverters',
    category: 'Solar Inverters',
    description: 'Advanced string and hybrid inverters featuring dual MPPT trackers, net metering compliance, and cloud telemetry integration.',
    specifications: {
      'Power Range': '3KW to 100KW',
      'Max Efficiency': '98.6%',
      'MPPT Channels': 'Dual / Quadruple MPPT',
      'Grid Support': 'Net Metering Ready',
    },
    imageUrl: 'https://images.unsplash.com/photo-1542336391-ae2936d8eff4?q=80&w=1200&auto=format&fit=crop',
    features: ['Remote Wi-Fi & App monitoring', 'Built-in surge protection', 'Seamless battery switchover (<10ms)', 'IP65 Weatherproof enclosure'],
    isPublished: true,
  },
  {
    id: 'prod-3',
    title: 'Custom Fabricated Solar Mounting Structures',
    slug: 'custom-solar-mounting-structures',
    category: 'Mounting Structures',
    description: 'Hot-dip galvanized steel and aluminum mounting solutions for rooftops, ground arrays, elevated sheds, and carports.',
    specifications: {
      'Material': 'Hot-Dip Galvanized Steel / HDG Aluminum',
      'Wind Resistance': 'Up to 160 km/h',
      'Tilt Angle': 'Custom 10° to 35°',
      'Corrosion Resistance': '30+ Years Design Life',
    },
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1200&auto=format&fit=crop',
    features: ['Pre-engineered bolt assembly', 'No roof penetration option', 'Custom wind & load calculation', 'High tensile strength'],
    isPublished: true,
  },
  {
    id: 'prod-4',
    title: 'Solar Direct-Current (DC) & AC Cables',
    slug: 'solar-dc-ac-cables',
    category: 'Solar Cables',
    description: 'Double-insulated copper solar cables designed for UV resistance, high thermal tolerance, and minimal electrical voltage drop.',
    specifications: {
      'Conductor': 'Tinned Annealed Copper',
      'Voltage Rating': '1.5kV DC / 1.0kV AC',
      'Temperature Range': '-40°C to +120°C',
    },
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop',
    features: ['Halogen-free flame retardant', 'UV & ozone resistant', 'TÜV Rheinland certified'],
    isPublished: true,
  },
  {
    id: 'prod-5',
    title: 'Pre-Engineered Building (PEB) Structures',
    slug: 'peb-structures',
    category: 'Fabrication & Design',
    description: 'Precision structural steel frames for industrial warehouses, factory sheds, commercial centers, and agricultural buildings.',
    specifications: {
      'Steel Grade': 'High Tensile Q345B / ASTM A572',
      'Span Width': 'Up to 60m Clear Span',
      'Coating': 'Epoxy Primer / Galvanized',
    },
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    features: ['Rapid modular erection', 'Earthquake resistant design', 'Custom roof & wall cladding'],
    isPublished: true,
  },
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'serv-1',
    title: 'Solar Energy',
    slug: 'solar-energy',
    shortDescription: 'Complete solar engineering solutions covering assessment, system design, equipment procurement, installation, commissioning, net metering, and maintenance.',
    fullDescription: 'E&E Industries delivers turn-key photovoltaic systems for commercial, residential, industrial, and agricultural clients. We combine site-specific load profiling with Tier-1 hardware to maximize clean energy yield.',
    iconName: 'Sun',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
    division: 'solar',
  },
  {
    id: 'serv-2',
    title: 'Trading & Contracting',
    slug: 'trading-contracting',
    shortDescription: 'Technical procurement, material sourcing, electrical supply, industrial raw materials, contracting, and EPC project coordination.',
    fullDescription: 'We streamline project supply chains through technical sourcing of solar panels, inverters, cables, breakers, and industrial raw materials (silica, sand, iron) backed by disciplined EPC contracting.',
    iconName: 'Briefcase',
    imageUrl: 'https://images.unsplash.com/photo-1542336391-ae2936d8eff4?q=80&w=1200&auto=format&fit=crop',
    division: 'trading',
  },
  {
    id: 'serv-3',
    title: 'Fabrication & Design',
    slug: 'fabrication-design',
    shortDescription: 'Structural engineering design and precision fabrication for solar mounting structures, PEB buildings, street poles, parking shades, and cable trays.',
    fullDescription: 'Our fabrication division engineers custom structural steel assets built to withstand extreme environmental wind and live loads, ensuring structural integrity and precise manufacturing.',
    iconName: 'Wrench',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    division: 'fabrication',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'MNS University of Agriculture Multan',
    slug: 'mns-university-of-agriculture-multan',
    client: 'MNS University Administration',
    location: 'Multan, Punjab, Pakistan',
    capacity: 'High-Capacity On-Grid Array',
    category: 'Institutional Solar',
    completionYear: 2024,
    summary: 'Turnkey solar energy installation powering campus academic blocks, research laboratories, and administrative facilities.',
    fullStory: 'E&E Industries engineered and commissioned a comprehensive solar power array at MNS University of Agriculture Multan. The project involved site load analysis, elevated structural mounting over academic rooftops, Tier-1 panel installation, and full grid synchronization.',
    mainImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542336391-ae2936d8eff4?q=80&w=1200&auto=format&fit=crop',
    ],
    isFeatured: true,
  },
  {
    id: 'proj-2',
    title: 'Chakdara Swat Site',
    slug: 'chakdara-swat-25kw',
    client: 'Regional Commercial Facility',
    location: 'Chakdara, Swat, KPK, Pakistan',
    capacity: '25KW',
    category: 'Commercial Solar',
    completionYear: 2023,
    summary: 'A 25KW solar deployment providing uninterrupted commercial power in northern mountainous terrain.',
    fullStory: 'Designed to handle high wind shear and mountain ambient weather, this 25KW commercial solar project utilizes heavy-duty galvanized mounting structures and hybrid energy storage.',
    mainImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1200&auto=format&fit=crop',
    gallery: [],
    isFeatured: true,
  },
  {
    id: 'proj-3',
    title: 'Punjab Pharmacy Commercial Complex',
    slug: 'punjab-pharmacy',
    client: 'Punjab Pharmacy Logistics',
    location: 'Lahore, Punjab, Pakistan',
    capacity: 'Commercial Hybrid System',
    category: 'Commercial & Logistics',
    completionYear: 2024,
    summary: 'Solar integration providing continuous power backup for cold storage pharmaceutical inventory.',
    fullStory: 'Ensuring 100% operational uptime for temperature-sensitive medical supplies, E&E Industries installed custom solar arrays paired with instant hybrid battery transfer switches.',
    mainImage: 'https://images.unsplash.com/photo-1542336391-ae2936d8eff4?q=80&w=1200&auto=format&fit=crop',
    gallery: [],
    isFeatured: true,
  },
  {
    id: 'proj-4',
    title: 'Chitral Remote Site Deployment',
    slug: 'chitral-site-50kw',
    client: 'Chitral Infrastructure Project',
    location: 'Chitral, KPK, Pakistan',
    capacity: '50KW',
    category: 'Infrastructure & Solar',
    completionYear: 2023,
    summary: 'A 50KW off-grid/hybrid solar project powering remote infrastructure and regional operational hubs.',
    fullStory: 'Navigating rugged mountain transport routes, E&E delivered specialized procurement, steel fabrication, and on-site engineering commissioning.',
    mainImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
    gallery: [],
    isFeatured: true,
  },
  {
    id: 'proj-5',
    title: 'Punjab Group of Pharmacies Central Hub',
    slug: 'punjab-group-of-pharmacies-55kw',
    client: 'Punjab Group of Pharmacies',
    location: 'Gujranwala, Punjab, Pakistan',
    capacity: '55KW',
    category: 'Commercial Solar',
    completionYear: 2024,
    summary: '55KW commercial solar facility cutting peak grid power costs by over 70%.',
    fullStory: 'Engineered for optimal daytime load offset, this 55KW system features net metering integration and continuous IoT telemetry monitoring.',
    mainImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop',
    gallery: [],
    isFeatured: true,
  },
  {
    id: 'proj-6',
    title: 'Bareeze DHA Elevated Shed Structure',
    slug: 'bareeze-dha-40kw-elevated-shed',
    client: 'Bareeze Retail Network',
    location: 'DHA, Lahore, Pakistan',
    capacity: '40KW Elevated Shed',
    category: 'Fabrication & Solar',
    completionYear: 2024,
    summary: '40KW solar installation mounted on a custom-designed elevated structural steel roof shed.',
    fullStory: 'Combining our fabrication and solar services, E&E Industrial Corporation engineered an aesthetic elevated steel roof structure over existing retail rooftop space to accommodate 40KW of solar modules without disturbing store operations.',
    mainImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    gallery: [],
    isFeatured: true,
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    quote: 'E&E Industries executed our 55KW commercial solar facility with absolute technical precision. Their structural fabrication for our elevated roof shed allowed us to maximize solar capacity while maintaining architectural aesthetics.',
    authorName: 'Tariq Mehmood',
    authorRole: 'Director of Facility Operations',
    company: 'Punjab Group of Pharmacies',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 'test-2',
    quote: 'From technical procurement of Tier-1 solar modules to custom steel mounting fabrication, E&E proved to be an invaluable EPC partner for our institutional energy project.',
    authorName: 'Engr. Shahbaz Khan',
    authorRole: 'Project Chief Engineer',
    company: 'MNS University of Agriculture Multan',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    rating: 5,
  },
  {
    id: 'test-3',
    quote: 'The level of engineering rigor E&E brought to our Chitral remote site project was outstanding. They handled logistics, structural design, and commissioning seamlessly.',
    authorName: 'Hamza Rashid',
    authorRole: 'General Manager Infrastructure',
    company: 'Northern Engineering Alliance',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    rating: 5,
  },
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Solar System in Pakistan – Complete Guide 2026',
    slug: 'solar-system-in-pakistan-complete-guide-2026',
    excerpt: 'Explore current net metering regulations, on-grid vs. hybrid setups, peak-hour load shaving economics, and recommended solar panel selection for Pakistan.',
    publishDate: 'August 7, 2026',
    author: {
      name: 'Asjed Mehnood',
      role: 'Executive Committee Member',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    category: 'Solar Energy',
    featuredImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
    readTime: '8 min read',
    content: 'Solar energy adoption across Pakistan has accelerated due to rising grid tariffs...',
  },
  {
    id: 'post-2',
    title: 'Understanding Structural Design in Pre-Engineered Buildings (PEB)',
    slug: 'understanding-structural-design-in-peb-buildings',
    excerpt: 'How precision steel fabrication, clear-span engineering, and quality galvanization improve long-term durability for industrial warehouses.',
    publishDate: 'August 5, 2026',
    author: {
      name: 'Malik Waqar Ahmed',
      role: 'Executive Committee Member',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    category: 'Engineering',
    featuredImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    readTime: '6 min read',
    content: 'Pre-engineered buildings provide structural flexibility and rapid construction cycles...',
  },
  {
    id: 'post-3',
    title: 'Technical Procurement Checklist for Commercial Solar EPC Projects',
    slug: 'technical-procurement-checklist-for-commercial-solar-epc-projects',
    excerpt: 'Key technical criteria for evaluating solar inverters, DC cable gauges, circuit protection breakers, and net metering documentation.',
    publishDate: 'August 3, 2026',
    author: {
      name: 'Asjed Mehnood',
      role: 'Executive Committee Member',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    category: 'Trading & Contracting',
    featuredImage: 'https://images.unsplash.com/photo-1542336391-ae2936d8eff4?q=80&w=1200&auto=format&fit=crop',
    readTime: '5 min read',
    content: 'Quality procurement dictates system performance over a 25-year lifecycle...',
  },
];

export const INITIAL_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What core business services does E&E Industrial Corporation cover?',
    answer: 'E&E Industrial Corporation operates across three principal services: (1) Solar Energy (design, installation, net metering, maintenance), (2) Trading & Contracting (technical procurement, electrical components, industrial raw materials), and (3) Fabrication & Design (structural steel, mounting structures, PEB buildings, street poles, parking shades, cable trays).',
    category: 'General',
  },
  {
    id: 'faq-2',
    question: 'How does Net Metering work for solar systems in Pakistan?',
    answer: 'Net metering enables on-grid and hybrid solar owners to export surplus electricity back to the national grid during peak generation hours, earning units off their monthly electricity bill. E&E handles all technical documentation and DISCO utility coordination.',
    category: 'Solar Energy',
  },
  {
    id: 'faq-3',
    question: 'Does E&E Industrial Corporation manufacture custom mounting structures?',
    answer: 'Yes! Our Fabrication & Design service engineers hot-dip galvanized steel and aluminum mounting structures customized for rooftops, ground arrays, elevated sheds, and carports.',
    category: 'Fabrication',
  },
  {
    id: 'faq-4',
    question: 'What residential solar package sizes do you offer?',
    answer: 'We provide pre-configured and custom residential packages ranging from 3KW, 5KW, 10KW, 20KW, up to 30KW, supporting both on-grid and hybrid configurations with Tier-1 components.',
    category: 'Solar Packages',
  },
];
