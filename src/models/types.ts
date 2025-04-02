export type ListingType = 'rent' | 'sell';
export type PropertyType = 'house' | 'apartment';
export type City = string;

export interface AppState {
  listingType: ListingType;
  propertyType: PropertyType;
  city: City;
}