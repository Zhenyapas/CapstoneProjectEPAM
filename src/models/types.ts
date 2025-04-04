export type ListingType = 'rent' | 'sale';
export type PropertyType = 'house' | 'apartment';
export type City = string;
export type Adress = string | null ;

export interface PropertyItem {
  id: string;
  title: string;
  address: string;
  street: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  images: string[];
  features: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface AppState {
  listingType: ListingType;
  propertyType: PropertyType;
  city: City;
}