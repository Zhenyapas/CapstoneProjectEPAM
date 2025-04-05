// models/propertyData.ts
import { ListingType, PropertyType, City, PropertyItem } from './types';

// Змінні для кешування даних
let propertiesData: Record<string, any> | null = null;
let flattenedProperties: PropertyItem[] | null = null;

// Функція для завантаження даних з JSON файлу
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

// Функція для отримання "вирівняного" масиву всіх об'єктів нерухомості
export async function getFlattenedProperties(): Promise<PropertyItem[]> {
  if (flattenedProperties !== null) {
    return flattenedProperties;
  }
  
  const data = await loadPropertiesData();
  const properties: PropertyItem[] = [];
  
  // Для кожного типу оголошень (rent/sale)
  for (const listingType of Object.keys(data)) {
    // Для кожного типу нерухомості (apartment/house)
    for (const propertyType of Object.keys(data[listingType])) {
      // Для кожного міста
      for (const city of Object.keys(data[listingType][propertyType])) {
        // Додаємо всі об'єкти нерухомості з цього міста
        properties.push(...data[listingType][propertyType][city]);
      }
    }
  }
  
  flattenedProperties = properties;
  return properties;
}

// Інтерфейс для опцій фільтрації
export interface FilterOptions {
  page?: number;
  itemsPerPage?: number;
  address?: string | null;
}

// Функція для отримання відфільтрованих об'єктів нерухомості
export async function getFilteredProperties(
  listingType: ListingType,
  propertyType: PropertyType,
  city: City,
  options: FilterOptions = {}
): Promise<{ items: PropertyItem[]; totalItems: number }> {
  // Завантажуємо дані
  const data = await loadPropertiesData();
  let items: PropertyItem[] = [];
  
  try {
    // Отримуємо об'єкти з прямого шляху в JSON
    if (data[listingType]?.[propertyType]?.[city]) {
      items = data[listingType][propertyType][city];
    }
  
    // Фільтрація за адресою
    if (options.address) {
      items = items.filter(item => {
        // Перевіряємо, чи адреса містить пошуковий запит
        if (item.address && item.address.toLowerCase().includes(options.address!.toLowerCase())) {
          return true;
        }
        // Або якщо вулиця точно збігається з пошуковим запитом
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
  
  // Загальна кількість відфільтрованих елементів
  const totalItems = items.length;
  
  // Пагінація
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