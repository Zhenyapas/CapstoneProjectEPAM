import { ListingType, PropertyType, City, PropertyItem } from './types';

let propertiesData: Record<string, any> | null = null;
let flattenedProperties: PropertyItem[] | null = null;


export async function loadPropertiesData(): Promise<Record<string, any>> {
  if (propertiesData !== null) {
    return propertiesData;
  }
  
  try {
    const response = await fetch('data/properties.json');
    if (!response.ok) {
      throw new Error(`Failed to load properties data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    propertiesData = data;
    return data;
  } catch (error) {
    console.error('Error loading properties data:', error);
    return {};
  }
}

export async function getFlattenedProperties(): Promise<PropertyItem[]> {
  if (flattenedProperties !== null) {
    return flattenedProperties;
  }
  
  const data = await loadPropertiesData();
  const properties: PropertyItem[] = [];
  
  for (const listingType of Object.keys(data)) {

    for (const propertyType of Object.keys(data[listingType])) {

      for (const city of Object.keys(data[listingType][propertyType])) {

        properties.push(...data[listingType][propertyType][city]);
      }
    }
  }
  
  flattenedProperties = properties;
  return properties;
}


export interface FilterOptions {
  page?: number;
  itemsPerPage?: number;
  address?: string | null;
}


export async function getFilteredProperties(
  listingType: ListingType,
  propertyType: PropertyType,
  city: City,
  options: FilterOptions = {}
): Promise<{ items: PropertyItem[]; totalItems: number }> {

  const data = await loadPropertiesData();
  let items: PropertyItem[] = [];
  
  try {

    if (data[listingType]?.[propertyType]?.[city]) {
      items = data[listingType][propertyType][city];
    }
  
    if (options.address) {
      items = items.filter(item => {
        if (item.address && item.address.toLowerCase().includes(options.address!.toLowerCase())) {
          return true;
        }
        if (item.street && item.street.toLowerCase() === options.address!.toLowerCase()) {
          return true;
        }
        return false;
      });
    }
  } catch (error) {
    console.error('Error filtering properties:', error);
    items = [];
  }
  
  const totalItems = items.length;

  if (options.page && options.itemsPerPage) {
    const startIndex = (options.page - 1) * options.itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + options.itemsPerPage);
    
    return {
      items: paginatedItems,
      totalItems
    };
  }
  
  return {
    items,
    totalItems
  };
}