export interface Contributor {
  id: string;
  name: string;
  title: string;
  email: string;
}

export const CONTRIBUTORS_LIST: Contributor[] = [
  {
    id: 'awais-rabbani',
    name: 'Dr. Muhammad Awais Rabbani',
    title: 'Clinical Lead & Medical Content Editor',
    email: 'dr.awais@growthpartnersgloballlc.com',
  },
  {
    id: 'ahmed-humayon',
    name: 'Dr. Ahmed Humayon',
    title: 'Co-Clinical Director & Medical Informatics',
    email: 'dr.ahmed@growthpartnergloballlc.com',
  },
];

// High-performance image URL for medical verification badge
export const MEDICAL_BADGE_IMAGE_SRC =
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80';
