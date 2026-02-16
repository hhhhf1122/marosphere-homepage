export interface UserPreferences {
  destination: string;
  duration: number;
  interests: string[];
  travelStyle: 'luxury' | 'adventure' | 'relaxation' | 'cultural' | 'foodie';
}

export interface Activity {
  time: string;
  description: string;
  type: 'Dining' | 'Tour' | 'Activity' | 'Accommodation' | 'Free Time';
}

export interface DayPlan {
  day: number;
  title: string;
  summary: string;
  activities: Activity[];
}

export interface Itinerary {
  title:string;
  description: string;
  days: DayPlan[];
}

export interface Artisan {
    id: number;
    name: string;
    craft: string;
    location: string;
    imageUrl: string;
    bio: string;
    isVerified: boolean;
}

export interface Guide {
    id: number;
    name: string;
    specialty: string;
    location: string;
    imageUrl: string;
    bio: string;
    isVerified: boolean;
}

export interface Accommodation {
    id: number;
    name: string;
    type: 'Riad' | 'Hotel' | 'Kasbah' | 'Desert Camp';
    location: string;
    imageUrl: string;
    description: string;
    isVerified: boolean;
}

export interface CircuitTour {
    id: number;
    name: string;
    duration: string;
    regions: string[];
    imageUrl: string;
    description: string;
    pricePerPerson: number;
    isVerified: boolean;
}

export interface Product {
    id: number;
    name: string;
    artisanName: string;
    price: number;
    imageUrl: string;
    description: string;
}

// --- AR Types for Berber Eye ---
export interface InfoCardData {
  title: string;
  content: string;
}

export interface HotspotData {
  top: string;
  left: string;
  content: string;
}

export interface Landmark {
  id: number;
  name: string;
  coords: {
    lat: number;
    lng: number;
  };
  infoCards: InfoCardData[];
  hotspots: HotspotData[];
}

// --- Provider Types ---
export interface Reservation {
    id: string;
    clientName: string;
    service: string;
    date: string;
    time: string;
    status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
    revenue: number;
}

// --- App-wide Types ---
export type AppView = 'home' | 'concierge' | 'berberEye' | 'marketplace' | 'chat' | 'profile';
export type AppMode = 'tourist' | 'provider';
export type ProviderView = 'dashboard' | 'reservations' | 'certification';