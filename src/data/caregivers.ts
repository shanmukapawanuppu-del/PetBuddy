export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface PricingOptions {
  hourly: number;
  daily: number;
  overnight: number;
}

export interface Caregiver {
  id: string;
  name: string;
  title: string;
  experience: string;
  rating: number;
  reviewCount: number;
  location: string;
  price: number; // base hourly rate
  pricingOptions: PricingOptions;
  supportedPets: string[];
  availability: 'Available Today' | 'Available Next Week' | 'Fully Booked';
  photo: string;
  gallery: string[];
  about: string;
  environment: string;
  safetyPolicy: string;
  slots: string[];
  reviews: Review[];
}

export const CAREGIVERS: Caregiver[] = [
  {
    id: "cg-1",
    name: "Sarah Jenkins",
    title: "Certified Pet Companion & Playtime Expert",
    experience: "5 years",
    rating: 4.9,
    reviewCount: 38,
    location: "Downtown",
    price: 15,
    pricingOptions: {
      hourly: 15,
      daily: 75,
      overnight: 110
    },
    supportedPets: ["Dog", "Cat", "Rabbit"],
    availability: "Available Today",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
    gallery: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600&h=400",
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600&h=400",
      "https://images.unsplash.com/photo-1535268647977-a403b69fc756?auto=format&fit=crop&q=80&w=600&h=400"
    ],
    about: "Hi! I am a passionate pet lover with over 5 years of professional boarding experience. I grew up surrounded by animals, and I treat every furry guest as my own family member. I specialize in energetic dogs that need active play, as well as nervous cats that need patience and quiet spaces. During their stay, I will provide frequent updates and photogenic check-ins so you have absolute peace of mind!",
    environment: "I live in a warm, single-family house with a secure, 6-foot fenced backyard. No kids or other resident pets, which means your pet gets 100% of my attention. We have dedicated cozy resting corners, plenty of enrichment toys, and soft bedding.",
    safetyPolicy: "I maintain a strict pet safety protocol: double-checking gates before release, keeping fresh filtered water available in multiple areas, and keeping emergency vet contacts on my fridge. Your pet will never be left unsupervised.",
    slots: ["09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM", "02:00 PM - 04:00 PM", "04:00 PM - 06:00 PM"],
    reviews: [
      {
        id: "r1-1",
        user: "David Miller",
        rating: 5,
        comment: "Sarah was absolutely fantastic! She sent us photo updates of Cooper every few hours. Cooper came back tired, happy, and clearly well-cared for. Highly recommended!",
        date: "May 12, 2026",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100"
      },
      {
        id: "r1-2",
        user: "Jessica Taylor",
        rating: 4.8,
        comment: "Excellent boarder! My cat Luna is usually very timid around strangers, but she warmed up to Sarah within a day. Sarah has a great intuition with animals.",
        date: "May 02, 2026",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
      }
    ]
  },
  {
    id: "cg-2",
    name: "Marcus Chen",
    title: "Professional Dog Trainer & Adventure Buddy",
    experience: "3 years",
    rating: 4.8,
    reviewCount: 22,
    location: "West End",
    price: 12,
    pricingOptions: {
      hourly: 12,
      daily: 60,
      overnight: 90
    },
    supportedPets: ["Dog", "Bird", "Fish"],
    availability: "Available Today",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=300",
    gallery: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600&h=400",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600&h=400"
    ],
    about: "Pets are full family members, and they deserve the highest level of care! I am an active runner and dog behavior hobbyist. If your dog loves long walks, throwing frisbees, and agility play, they'll have a blast with me. I live right next to the massive West End Park and take dogs out 3-4 times a day.",
    environment: "A spacious, pet-proofed 2-bedroom apartment. I have an air-purified playroom and a large covered balcony with high pet-safety mesh for birds or relaxed lounging. Easy access to park trails right downstairs.",
    safetyPolicy: "Fully trained in canine CPR and first aid. I carry a pet first-aid kit on every walk. I always walk dogs on a secure double-leash and carefully manage introductions with other dogs.",
    slots: ["08:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "03:00 PM - 05:00 PM", "05:00 PM - 07:00 PM"],
    reviews: [
      {
        id: "r2-1",
        user: "Robert K.",
        rating: 5,
        comment: "Marcus is a legend! My retriever Milo has a lot of energy, and Marcus ran with him twice a day. Milo came back super relaxed and happy.",
        date: "May 15, 2026",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100"
      },
      {
        id: "r2-2",
        user: "Amy Lin",
        rating: 4.5,
        comment: "Marcus took care of our parrot Rocky while we were away for a weekend trip. He strictly followed feeding schedules and Rocky was in great spirits.",
        date: "Apr 28, 2026",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100"
      }
    ]
  },
  {
    id: "cg-3",
    name: "Elena Rostova",
    title: "Veterinary Assistant & Specialist Boarder",
    experience: "8 years",
    rating: 5.0,
    reviewCount: 54,
    location: "Sunnyvale",
    price: 20,
    pricingOptions: {
      hourly: 20,
      daily: 95,
      overnight: 140
    },
    supportedPets: ["Dog", "Cat", "Rabbit", "Hamster"],
    availability: "Available Today",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
    gallery: [
      "https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?auto=format&fit=crop&q=80&w=600&h=400",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600&h=400",
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=600&h=400"
    ],
    about: "As a registered veterinary assistant, I offer premium care designed for ultimate health and safety. I have extensive experience caring for puppies, senior pets, and pets requiring complex medical attention (insulin injections, medication regimes, post-surgery monitoring). I offer a calm, scientific, and deeply loving approach to care.",
    environment: "A quiet, therapeutic home environment. I have a large fully-fenced backyard separated into zones. Indoors, we have orthopedic pet beds, soothing pheromone diffusers (Feliway/Adaptil) to minimize stress, and zero escape routes.",
    safetyPolicy: "I maintain medical-grade sanitization of all pet bowls and living zones. In case of any anomaly, my training allows me to detect subtle health issues immediately. Emergency vet transport is on standby.",
    slots: ["09:00 AM - 11:00 AM", "12:00 PM - 02:00 PM", "03:00 PM - 05:00 PM"],
    reviews: [
      {
        id: "r3-1",
        user: "Carolyn Vance",
        rating: 5,
        comment: "Elena is a lifesaver. My senior lab Buster needs daily injections and joint support. Finding a sitter we could trust was impossible until Elena. She was perfect!",
        date: "May 18, 2026",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100"
      },
      {
        id: "r3-2",
        user: "Arthur Dent",
        rating: 5,
        comment: "Top notch experience. Elena understood my rabbit's dietary needs and GI stasis risks perfectly. Will definitely book again.",
        date: "May 09, 2026",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=100&h=100"
      }
    ]
  },
  {
    id: "cg-4",
    name: "David Kojo",
    title: "Quiet Retreat Specialist & Cat Whisperer",
    experience: "4 years",
    rating: 4.7,
    reviewCount: 16,
    location: "North Hills",
    price: 13,
    pricingOptions: {
      hourly: 13,
      daily: 65,
      overnight: 95
    },
    supportedPets: ["Cat", "Rabbit", "Bird"],
    availability: "Available Next Week",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300",
    gallery: [
      "https://images.unsplash.com/photo-1513360309081-36f5e878fc9e?auto=format&fit=crop&q=80&w=600&h=400",
      "https://images.unsplash.com/photo-1472491235688-bdc81a63246e?auto=format&fit=crop&q=80&w=600&h=400"
    ],
    about: "I offer a peaceful, dog-free sanctuary specifically tailored for cats, rabbits, and other small pets who get overwhelmed by loud noises or canine friends. I work from home as a freelance designer, which means your pet will have calm, consistent company and quiet, soothing background vibes all day.",
    environment: "A sunny, plant-friendly condo with high-altitude climbing trees, window bird-watching seats, and soft scratching posts. No toxic plants, and absolutely zero dogs are allowed in the building.",
    safetyPolicy: "Double doors at the entrance to prevent escape artists. I check on small pets every hour, ensure high-quality Timothy hay is constantly available for rabbits, and strictly monitor litter box habits.",
    slots: ["10:00 AM - 12:00 PM", "01:00 PM - 03:00 PM", "04:00 PM - 06:00 PM"],
    reviews: [
      {
        id: "r4-1",
        user: "Tina Gomez",
        rating: 4.9,
        comment: "Feline paradise! My cat Simba has never been so relaxed in someone else's house. David knows exactly when to play and when to give them space.",
        date: "May 01, 2026",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100"
      }
    ]
  },
  {
    id: "cg-5",
    name: "Priya Patel",
    title: "Nature Lover & Holistic Care Provider",
    experience: "6 years",
    rating: 4.9,
    reviewCount: 31,
    location: "Lakeside",
    price: 18,
    pricingOptions: {
      hourly: 18,
      daily: 85,
      overnight: 130
    },
    supportedPets: ["Dog", "Cat", "Bird"],
    availability: "Available Today",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300",
    gallery: [
      "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=600&h=400",
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80&w=600&h=400"
    ],
    about: "Hello! I am Priya, a full-time pet boarding hosts located by the beautiful Lakeside Park. I believe in holistic pet wellness - plenty of outdoor exercise, mentally engaging play, wholesome diet schedules, and cozy, relaxing sleep. I have taken care of puppies, senior dogs, and kittens, and have a deep bond with animal behaviors.",
    environment: "I live in a spacious lakeside cottage with a massive, securely fenced yard that leads close to the park. The house features non-slip floors, separate feeding rooms to avoid food guarding, and relaxing acoustic ambient music playing during rest time.",
    safetyPolicy: "GPS collars are placed on all boarders during outdoor park visits. Restricting access to kitchen counters or garbage. Highly responsive emergency evacuation plans in place.",
    slots: ["09:00 AM - 11:00 AM", "01:00 PM - 03:00 PM", "03:00 PM - 05:00 PM", "05:00 PM - 07:00 PM"],
    reviews: [
      {
        id: "r5-1",
        user: "Liam O'Connor",
        rating: 5,
        comment: "Priya was wonderful! She took Rocky out for swims and walks near the lake. The GPS tracker she provided gave us such immense reassurance. Outstanding care!",
        date: "May 10, 2026",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100"
      }
    ]
  }
];
