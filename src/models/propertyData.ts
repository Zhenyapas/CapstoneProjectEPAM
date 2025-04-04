// models/propertyData.ts
import { ListingType, PropertyType, City, PropertyItem } from './types';

// Інтерфейс для визначення структури даних
interface PropertyDatabase {
  [listingType: string]: {
    [propertyType: string]: {
      [city: string]: PropertyItem[];
    };
  };
}

// Функція, яка витягує назву вулиці з адреси
function extractStreetName(address: string): string {
  const commaIndex = address.indexOf(',');
  if (commaIndex > 0) {
    const beforeComma = address.substring(0, commaIndex).trim();
    
    // Видаляємо номер будинку, якщо він на початку
    const match = beforeComma.match(/^(\d+)\s+(.+)$/);
    if (match) {
      return match[2]; // Повертаємо частину після номеру
    }
    
    // Видаляємо номер будинку, якщо він в кінці
    const matchEnd = beforeComma.match(/^(.+)\s+(\d+)$/);
    if (matchEnd) {
      return matchEnd[1]; // Повертаємо частину до номеру
    }
    
    return beforeComma;
  }
  
  return address.split(' ').filter(part => isNaN(Number(part))).join(' ').trim();
}


// Дані з нерухомістю
export const propertyData: PropertyDatabase = {
  rent: {
    house: {
      kyiv: [
        {
          id: 'rent-house-kyiv-1',
          title: 'Modern House in Kyiv',
          address: '123 Main St, Kyiv',
          street: 'Main St',
          price: 2500,
          area: 200,
          bedrooms: 4,
          bathrooms: 2,
          description: 'Beautiful modern house with garden in Kyiv center.',
          images: ['house1.jpg', 'house1-interior.jpg'],
          features: ['Garden', 'Parking', 'Terrace'],
          coordinates: { lat: 50.4582, lng: 30.5233 }
        },
        {
          id: 'rent-house-kyiv-2',
          title: 'Family House in Obolon',
          address: '45 Obolonskyi Ave, Kyiv',
          street: 'Obolonskyi Ave',
          price: 1800,
          area: 180,
          bedrooms: 3,
          bathrooms: 2,
          description: 'Spacious family house in Obolon district with river view.',
          images: ['house2.jpg', 'house2-interior.jpg'],
          features: ['River View', 'Garden', 'Parking'],
          coordinates: { lat: 50.4862, lng: 30.4973 }
        },
        {
          id: 'rent-house-kyiv-3',
          title: 'Cozy House in Pechersk',
          address: '78 Lesya Ukrainka Blvd, Kyiv',
          street: 'Lesya Ukrainka Blvd',
          price: 3000,
          area: 220,
          bedrooms: 4,
          bathrooms: 3,
          description: 'Cozy house with modern amenities in the prestigious Pechersk district.',
          images: ['house3.jpg', 'house3-interior.jpg'],
          features: ['Smart Home', 'Garden', 'Terrace', 'Security'],
          coordinates: { lat: 50.4265, lng: 30.5361 }
        }
      ],
      odessa: [
        {
          id: 'rent-house-odessa-1',
          title: 'Seaside Villa in Odessa',
          address: '12 Primorskaya St, Odessa',
          street: 'Primorskaya St',
          price: 3200,
          area: 250,
          bedrooms: 5,
          bathrooms: 3,
          description: 'Beautiful villa with sea view and private beach access.',
          images: ['odessa-house1.jpg', 'odessa-house1-interior.jpg'],
          features: ['Sea View', 'Beach Access', 'Pool', 'Garden'],
          coordinates: { lat: 46.4846, lng: 30.7326 }
        },
        {
          id: 'rent-house-odessa-2',
          title: 'Modern House in Arcadia',
          address: '34 Genuezskaya St, Odessa',
          street: 'Genuezskaya St',
          price: 2800,
          area: 210,
          bedrooms: 4,
          bathrooms: 2,
          description: 'Modern house close to Arcadia beach and entertainment.',
          images: ['odessa-house2.jpg', 'odessa-house2-interior.jpg'],
          features: ['Near Beach', 'Garden', 'Parking', 'Terrace'],
          coordinates: { lat: 46.4321, lng: 30.7648 }
        }
      ],
      lviv: [
        {
          id: 'rent-house-lviv-1',
          title: 'Historic Villa in Lviv',
          address: '23 Lychakivska St, Lviv',
          street: 'Lychakivska St',
          price: 1600,
          area: 190,
          bedrooms: 3,
          bathrooms: 2,
          description: 'Charming historic villa in the cultural heart of Lviv.',
          images: ['lviv-house1.jpg', 'lviv-house1-interior.jpg'],
          features: ['Historic Building', 'Garden', 'Fireplace'],
          coordinates: { lat: 49.8397, lng: 24.0523 }
        },
        {
          id: 'rent-house-lviv-2',
          title: 'Mountain View House',
          address: '56 Zelena St, Lviv',
          street: 'Zelena St',
          price: 1450,
          area: 170,
          bedrooms: 3,
          bathrooms: 2,
          description: 'Cozy house with beautiful mountain views on the outskirts of Lviv.',
          images: ['lviv-house2.jpg', 'lviv-house2-interior.jpg'],
          features: ['Mountain View', 'Garden', 'Parking'],
          coordinates: { lat: 49.8154, lng: 24.0321 }
        }
      ],
      kharkiv: [
        {
          id: 'rent-house-kharkiv-1',
          title: 'Modern House in Kharkiv',
          address: '45 Sumska St, Kharkiv',
          street: 'Sumska St',
          price: 1200,
          area: 180,
          bedrooms: 3,
          bathrooms: 2,
          description: 'Modern house in the central district of Kharkiv.',
          images: ['kharkiv-house1.jpg', 'kharkiv-house1-interior.jpg'],
          features: ['Garden', 'Parking', 'Smart Home'],
          coordinates: { lat: 49.9949, lng: 36.2311 }
        },
        {
          id: 'rent-house-kharkiv-2',
          title: 'Family House with Garden',
          address: '123 Pushkinska St, Kharkiv',
          street: 'Pushkinska St',
          price: 1350,
          area: 210,
          bedrooms: 4,
          bathrooms: 2,
          description: 'Spacious family house with a large garden in a quiet area.',
          images: ['kharkiv-house2.jpg', 'kharkiv-house2-interior.jpg'],
          features: ['Large Garden', 'Garage', 'Playground'],
          coordinates: { lat: 49.9825, lng: 36.2567 }
        }
      ]
    },
    apartment: {
      kyiv: [
        {
          id: 'rent-apartment-kyiv-1',
          title: 'Modern Apartment in Center',
          address: '56 Khreshchatyk St, Kyiv',
          street: 'Khreshchatyk St',
          price: 1100,
          area: 85,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Stylish modern apartment in the heart of Kyiv.',
          images: ['apt-kyiv1.jpg', 'apt-kyiv1-interior.jpg'],
          features: ['City View', 'Balcony', 'Elevator'],
          coordinates: { lat: 50.4492, lng: 30.5244 }
        },
        {
          id: 'rent-apartment-kyiv-2',
          title: 'Luxury Penthouse',
          address: '78 Saksaganskogo St, Kyiv',
          street: 'Saksaganskogo St',
          price: 2500,
          area: 120,
          bedrooms: 3,
          bathrooms: 2,
          description: 'Luxury penthouse with panoramic city views.',
          images: ['apt-kyiv2.jpg', 'apt-kyiv2-interior.jpg'],
          features: ['Panoramic View', 'Terrace', 'Smart Home', 'Parking'],
          coordinates: { lat: 50.4382, lng: 30.5103 }
        },
        {
          id: 'rent-apartment-kyiv-3',
          title: 'Cozy Studio in Podil',
          address: '34 Konstantinovskaya St, Kyiv',
          street: 'Konstantinovskaya St',
          price: 700,
          area: 45,
          bedrooms: 1,
          bathrooms: 1,
          description: 'Cozy studio apartment in historic Podil district.',
          images: ['apt-kyiv3.jpg', 'apt-kyiv3-interior.jpg'],
          features: ['Historic Building', 'Renovated', 'Near Metro'],
          coordinates: { lat: 50.4662, lng: 30.5153 }
        },
        {
          id: 'rent-apartment-kyiv-4',
          title: 'Cozy Studio in Podil',
          address: '30 Konstantinovskaya St, Kyiv',
          street: 'Konstantinovskaya St',
          price: 600,
          area: 45,
          bedrooms: 1,
          bathrooms: 1,
          description: 'Cozy studio apartment in historic Podil district.',
          images: ['apt-kyiv3.jpg', 'apt-kyiv3-interior.jpg'],
          features: ['Historic Building', 'Renovated', 'Near Metro'],
          coordinates: { lat: 50.4661, lng: 30.5152 }
        }
      ],
      odessa: [
        {
          id: 'rent-apartment-odessa-1',
          title: 'Seaside Apartment',
          address: '23 Deribasovskaya St, Odessa',
          street: 'Deribasovskaya St',
          price: 900,
          area: 70,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Beautiful apartment with sea view in the center of Odessa.',
          images: ['apt-odessa1.jpg', 'apt-odessa1-interior.jpg'],
          features: ['Sea View', 'Balcony', 'Air Conditioning'],
          coordinates: { lat: 46.4836, lng: 30.7343 }
        },
        {
          id: 'rent-apartment-odessa-2',
          title: 'Modern Studio in Arcadia',
          address: '45 Genuezskaya St, Odessa',
          street: 'Genuezskaya St',
          price: 750,
          area: 50,
          bedrooms: 1,
          bathrooms: 1,
          description: 'Modern studio apartment close to Arcadia beach.',
          images: ['apt-odessa2.jpg', 'apt-odessa2-interior.jpg'],
          features: ['Near Beach', 'Pool Access', 'Modern Design'],
          coordinates: { lat: 46.4305, lng: 30.7632 }
        }
      ],
      lviv: [
        {
          id: 'rent-apartment-lviv-1',
          title: 'Historic Center Apartment',
          address: '12 Rynok Square, Lviv',
          street: 'Rynok Square',
          price: 800,
          area: 65,
          bedrooms: 1,
          bathrooms: 1,
          description: 'Charming apartment in a historic building on Rynok Square.',
          images: ['apt-lviv1.jpg', 'apt-lviv1-interior.jpg'],
          features: ['Historic Building', 'City View', 'Central Location'],
          coordinates: { lat: 49.8418, lng: 24.0316 }
        },
        {
          id: 'rent-apartment-lviv-2',
          title: 'Modern Apartment near Opera',
          address: '34 Svobody Ave, Lviv',
          street: 'Svobody Ave',
          price: 950,
          area: 80,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Modern apartment near Lviv Opera House with city views.',
          images: ['apt-lviv2.jpg', 'apt-lviv2-interior.jpg'],
          features: ['City View', 'Balcony', 'Near Opera'],
          coordinates: { lat: 49.8442, lng: 24.0253 }
        }
      ],
      kharkiv: [
        {
          id: 'rent-apartment-kharkiv-1',
          title: 'Central Apartment',
          address: '56 Sumska St, Kharkiv',
          street: 'Sumska St',
          price: 650,
          area: 60,
          bedrooms: 1,
          bathrooms: 1,
          description: 'Comfortable apartment in the center of Kharkiv.',
          images: ['apt-kharkiv1.jpg', 'apt-kharkiv1-interior.jpg'],
          features: ['City Center', 'Renovated', 'Near Park'],
          coordinates: { lat: 49.9937, lng: 36.2323 }
        },
        {
          id: 'rent-apartment-kharkiv-2',
          title: 'Modern Two-Bedroom',
          address: '78 Pushkinska St, Kharkiv',
          street: 'Pushkinska St',
          price: 800,
          area: 85,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Modern two-bedroom apartment with all amenities.',
          images: ['apt-kharkiv2.jpg', 'apt-kharkiv2-interior.jpg'],
          features: ['Modern Design', 'Balcony', 'Parking'],
          coordinates: { lat: 49.9852, lng: 36.2465 }
        }
      ]
    }
  },
  sale: {
    house: {
      kyiv: [
        {
          id: 'sale-house-kyiv-1',
          title: 'Luxury House for Sale',
          address: '456 Park Ave, Kyiv',
          street: 'Park Ave',
          price: 450000,
          area: 250,
          bedrooms: 5,
          bathrooms: 3,
          description: 'Luxurious house for sale with swimming pool.',
          images: ['sale-house1.jpg', 'sale-house1-interior.jpg'],
          features: ['Pool', 'Garden', 'Garage', 'Security'],
          coordinates: { lat: 50.4612, lng: 30.5320 }
        },
        {
          id: 'sale-house-kyiv-2',
          title: 'Modern Villa in Koncha-Zaspa',
          address: '789 Koncha-Zaspa, Kyiv',
          street: 'Koncha-Zaspa',
          price: 650000,
          area: 350,
          bedrooms: 6,
          bathrooms: 4,
          description: 'Exclusive modern villa in Koncha-Zaspa with private access to Dnipro river.',
          images: ['sale-house2.jpg', 'sale-house2-interior.jpg'],
          features: ['River Access', 'Pool', 'Tennis Court', 'Smart Home'],
          coordinates: { lat: 50.3265, lng: 30.5715 }
        },
        {
          id: 'sale-house-kyiv-3',
          title: 'Family House in Osokorky',
          address: '123 Osokorky, Kyiv',
          street: 'Osokorky',
          price: 320000,
          area: 220,
          bedrooms: 4,
          bathrooms: 3,
          description: 'Perfect family house in quiet Osokorky district with good infrastructure.',
          images: ['sale-house3.jpg', 'sale-house3-interior.jpg'],
          features: ['Garden', 'Garage', 'Near Metro', 'School Nearby'],
          coordinates: { lat: 50.3965, lng: 30.6115 }
        }
      ],
      odessa: [
        {
          id: 'sale-house-odessa-1',
          title: 'Luxury Seaside Villa',
          address: '67 Fontanska Rd, Odessa',
          street: 'Fontanska Rd',
          price: 580000,
          area: 320,
          bedrooms: 5,
          bathrooms: 4,
          description: 'Luxury villa with private beach access and sea view.',
          images: ['sale-odessa-house1.jpg', 'sale-odessa-house1-interior.jpg'],
          features: ['Private Beach', 'Pool', 'Garden', 'Security'],
          coordinates: { lat: 46.4553, lng: 30.7658 }
        },
        {
          id: 'sale-house-odessa-2',
          title: 'Modern House in Arcadia',
          address: '89 Arcadia, Odessa',
          street: 'Arcadia',
          price: 420000,
          area: 280,
          bedrooms: 4,
          bathrooms: 3,
          description: 'Modern house in prestigious Arcadia district, close to entertainment.',
          images: ['sale-odessa-house2.jpg', 'sale-odessa-house2-interior.jpg'],
          features: ['Near Beach', 'Pool', 'Smart Home', 'Garage'],
          coordinates: { lat: 46.4298, lng: 30.7618 }
        }
      ],
      lviv: [
        {
          id: 'sale-house-lviv-1',
          title: 'Historic Villa in Lviv',
          address: '45 Lychakivska St, Lviv',
          street: 'Lychakivska St',
          price: 380000,
          area: 240,
          bedrooms: 4,
          bathrooms: 3,
          description: 'Beautifully restored historic villa in Lychakiv district.',
          images: ['sale-lviv-house1.jpg', 'sale-lviv-house1-interior.jpg'],
          features: ['Historic Building', 'Garden', 'Fireplace', 'Garage'],
          coordinates: { lat: 49.8365, lng: 24.0547 }
        },
        {
          id: 'sale-house-lviv-2',
          title: 'Modern House in Briukhovychi',
          address: '23 Briukhovychi, Lviv',
          street: 'Briukhovychi',
          price: 320000,
          area: 210,
          bedrooms: 4,
          bathrooms: 2,
          description: 'Modern family house in green Briukhovychi area with forest nearby.',
          images: ['sale-lviv-house2.jpg', 'sale-lviv-house2-interior.jpg'],
          features: ['Forest Nearby', 'Garden', 'Terrace', 'Parking'],
          coordinates: { lat: 49.8921, lng: 23.9567 }
        }
      ],
      kharkiv: [
        {
          id: 'sale-house-kharkiv-1',
          title: 'Luxury House in Kharkiv',
          address: '123 Nauky Ave, Kharkiv',
          street: 'Nauky Ave',
          price: 290000,
          area: 220,
          bedrooms: 4,
          bathrooms: 3,
          description: 'Luxury house in prestigious district of Kharkiv.',
          images: ['sale-kharkiv-house1.jpg', 'sale-kharkiv-house1-interior.jpg'],
          features: ['Pool', 'Garden', 'Smart Home', 'Security'],
          coordinates: { lat: 49.9965, lng: 36.2605 }
        },
        {
          id: 'sale-house-kharkiv-2',
          title: 'Family House with Large Garden',
          address: '45 Shevchenko St, Kharkiv',
          street: 'Shevchenko St',
          price: 240000,
          area: 190,
          bedrooms: 3,
          bathrooms: 2,
          description: 'Comfortable family house with large garden in quiet area.',
          images: ['sale-kharkiv-house2.jpg', 'sale-kharkiv-house2-interior.jpg'],
          features: ['Large Garden', 'Garage', 'Fireplace', 'Terrace'],
          coordinates: { lat: 49.9823, lng: 36.2176 }
        }
      ]
    },
    apartment: {
      kyiv: [
        {
          id: 'sale-apartment-kyiv-1',
          title: 'Luxury Apartment on Khreshchatyk',
          address: '100 Khreshchatyk St, Kyiv',
          street: 'Khreshchatyk St',
          price: 350000,
          area: 120,
          bedrooms: 3,
          bathrooms: 2,
          description: 'Prestigious apartment on main street of Kyiv with amazing city views.',
          images: ['sale-apt-kyiv1.png', 'sale-apt-kyiv1-bath.png','sale-apt-kyiv1-bedroom.png'],
          features: ['City View', 'Balcony', 'Security', 'Parking'],
          coordinates: { lat: 50.4476, lng: 30.5256 }
        },
        {
          id: 'sale-apartment-kyiv-2',
          title: 'Modern Penthouse in Pechersk',
          address: '78 Lesya Ukrainka Blvd, Kyiv',
          street: 'Lesya Ukrainka Blvd',
          price: 420000,
          area: 150,
          bedrooms: 3,
          bathrooms: 2,
          description: 'Stunning penthouse in Pechersk district with panoramic views and terrace.',
          images: ['sale-apt-kyiv2.png', 'sale-apt-kyiv2-bath.png','sale-apt-kyiv2-bedroom.png'],
          features: ['Panoramic View', 'Terrace', 'Smart Home', 'Parking'],
          coordinates: { lat: 50.4265, lng: 30.5365 }
        },
        {
          id: 'sale-apartment-kyiv-3',
          title: 'Spacious Apartment in Podil',
          address: '45 Sagaidachnogo St, Kyiv',
          street: 'Sagaidachnogo St',
          price: 260000,
          area: 95,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Charming spacious apartment in historic Podil district.',
          images: ['sale-apt-kyiv3.jpg', 'sale-apt-kyiv3-interior.jpg'],
          features: ['Historic Building', 'High Ceilings', 'Renovated'],
          coordinates: { lat: 50.4627, lng: 30.5165 }
        },
        {
          id: 'sale-apartment-kyiv-4',
          title: 'Spacious Apartment in Podil',
          address: '40 Sagaidachnogo St, Kyiv',
          street: 'Sagaidachnogo St',
          price: 260000,
          area: 95,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Charming spacious apartment in historic Podil district.',
          images: ['sale-apt-kyiv3.jpg', 'sale-apt-kyiv3-interior.jpg'],
          features: ['Historic Building', 'High Ceilings', 'Renovated'],
          coordinates: { lat: 50.4625, lng: 30.5165 }
        },
        {
          id: 'sale-apartment-kyiv-5',
          title: 'Spacious Apartment in Podil',
          address: '47 Sagaidachnogo St, Kyiv',
          street: 'Sagaidachnogo St',
          price: 260000,
          area: 95,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Charming spacious apartment in historic Podil district.',
          images: ['sale-apt-kyiv3.jpg', 'sale-apt-kyiv3-interior.jpg'],
          features: ['Historic Building', 'High Ceilings', 'Renovated'],
          coordinates: { lat: 50.4625, lng: 30.5165 }
        },
        {
          id: 'sale-apartment-kyiv-6',
          title: 'Spacious Apartment in Podil',
          address: '4 Sagaidachnogo St, Kyiv',
          street: 'Sagaidachnogo St',
          price: 260000,
          area: 95,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Charming spacious apartment in historic Podil district.',
          images: ['sale-apt-kyiv3.jpg', 'sale-apt-kyiv3-interior.jpg'],
          features: ['Historic Building', 'High Ceilings', 'Renovated'],
          coordinates: { lat: 50.4625, lng: 30.5165 }
        },
        {
          id: 'sale-apartment-kyiv-7',
          title: 'Spacious Apartment in Podil',
          address: '15 Sagaidachnogo St, Kyiv',
          street: 'Sagaidachnogo St',
          price: 260000,
          area: 95,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Charming spacious apartment in historic Podil district.',
          images: ['sale-apt-kyiv3.jpg', 'sale-apt-kyiv3-interior.jpg'],
          features: ['Historic Building', 'High Ceilings', 'Renovated'],
          coordinates: { lat: 50.4625, lng: 30.5165 }
        },
        {
          id: 'sale-apartment-kyiv-7',
          title: 'Spacious Apartment in Podil',
          address: '11 Sagaidachnogo St, Kyiv',
          street: 'Sagaidachnogo St',
          price: 260000,
          area: 95,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Charming spacious apartment in historic Podil district.',
          images: ['sale-apt-kyiv3.jpg', 'sale-apt-kyiv3-interior.jpg'],
          features: ['Historic Building', 'High Ceilings', 'Renovated'],
          coordinates: { lat: 50.4625, lng: 30.5165 }
        },
        {
          id: 'sale-apartment-kyiv-7',
          title: 'Spacious Apartment in Podil',
          address: '25 Sagaidachnogo St, Kyiv',
          street: 'Sagaidachnogo St',
          price: 260000,
          area: 95,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Charming spacious apartment in historic Podil district.',
          images: ['sale-apt-kyiv3.jpg', 'sale-apt-kyiv3-interior.jpg'],
          features: ['Historic Building', 'High Ceilings', 'Renovated'],
          coordinates: { lat: 50.4625, lng: 30.5165 }
        },
        {
          id: 'sale-apartment-kyiv-7',
          title: 'Spacious Apartment in Podil',
          address: '19 Sagaidachnogo St, Kyiv',
          street: 'Sagaidachnogo St',
          price: 260000,
          area: 95,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Charming spacious apartment in historic Podil district.',
          images: ['sale-apt-kyiv3.jpg', 'sale-apt-kyiv3-interior.jpg'],
          features: ['Historic Building', 'High Ceilings', 'Renovated'],
          coordinates: { lat: 50.4625, lng: 30.5165 }
        },
        {
          id: 'sale-apartment-kyiv-7',
          title: 'Spacious Apartment in Podil',
          address: '13 Sagaidachnogo St, Kyiv',
          street: 'Sagaidachnogo St',
          price: 260000,
          area: 95,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Charming spacious apartment in historic Podil district.',
          images: ['sale-apt-kyiv3.jpg', 'sale-apt-kyiv3-interior.jpg'],
          features: ['Historic Building', 'High Ceilings', 'Renovated'],
          coordinates: { lat: 50.4625, lng: 30.5165 }
        },
      ],
      odessa: [
        {
          id: 'sale-apartment-odessa-1',
          title: 'Sea View Apartment',
          address: '34 Primorsky Blvd, Odessa',
          street: 'Primorsky Blvd',
          price: 280000,
          area: 105,
          bedrooms: 2,
          bathrooms: 2,
          description: 'Luxurious apartment with sea view in historic building.',
          images: ['sale-apt-odessa1.jpg', 'sale-apt-odessa1-interior.jpg'],
          features: ['Sea View', 'Historic Building', 'Balcony', 'Renovated'],
          coordinates: { lat: 46.4872, lng: 30.7415 }
        },
        {
          id: 'sale-apartment-odessa-2',
          title: 'Modern Apartment in Arcadia',
          address: '67 Genuezskaya St, Odessa',
          street: 'Genuezskaya St',
          price: 220000,
          area: 85,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Modern apartment in new building near Arcadia beach.',
          images: ['sale-apt-odessa2.jpg', 'sale-apt-odessa2-interior.jpg'],
          features: ['Near Beach', 'Pool Access', 'Gym', 'Parking'],
          coordinates: { lat: 46.4315, lng: 30.7645 }
        }
      ],
      lviv: [
        {
          id: 'sale-apartment-lviv-1',
          title: 'Historic Center Apartment',
          address: '23 Rynok Square, Lviv',
          street: 'Rynok Square',
          price: 190000,
          area: 80,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Unique apartment in historic building on Rynok Square.',
          images: ['sale-apt-lviv1.jpg', 'sale-apt-lviv1-interior.jpg'],
          features: ['Historic Building', 'City View', 'High Ceilings'],
          coordinates: { lat: 49.8419, lng: 24.0318 }
        },
        {
          id: 'sale-apartment-lviv-2',
          title: 'Modern Apartment near Center',
          address: '56 Franko St, Lviv',
          street: 'Franko St',
          price: 150000,
          area: 75,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Modern apartment in new building close to city center.',
          images: ['sale-apt-lviv2.jpg', 'sale-apt-lviv2-interior.jpg'],
          features: ['New Building', 'Balcony', 'Parking', 'Elevator'],
          coordinates: { lat: 49.8385, lng: 24.0168 }
        }
      ],
      kharkiv: [
        {
          id: 'sale-apartment-kharkiv-1',
          title: 'Central Apartment in Kharkiv',
          address: '89 Sumska St, Kharkiv',
          street: 'Sumska St',
          price: 130000,
          area: 70,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Spacious apartment in the center of Kharkiv with good transport connections.',
          images: ['sale-apt-kharkiv1.jpg', 'sale-apt-kharkiv1-interior.jpg'],
          features: ['City Center', 'Renovated', 'Balcony'],
          coordinates: { lat: 49.9947, lng: 36.2312 }
        },
        {
          id: 'sale-apartment-kharkiv-2',
          title: 'Modern Apartment in New Building',
          address: '123 Nauky Ave, Kharkiv',
          street: 'Nauky Ave',
          price: 110000,
          area: 85,
          bedrooms: 2,
          bathrooms: 1,
          description: 'Modern apartment in new residential complex with all amenities.',
          images: ['sale-apt-kharkiv2.jpg', 'sale-apt-kharkiv2-interior.jpg'],
          features: ['New Building', 'Parking', 'Playground', 'Security'],
          coordinates: { lat: 49.9895, lng: 36.2508 }
        }
      ]
    }
  }
};

// Функція для отримання відфільтрованих елементів
export function getFilteredProperties(
  listingType: ListingType,
  propertyType: PropertyType,
  city: City,
  limit?: number
): PropertyItem[] {
  try {
    const filteredItems = propertyData[listingType][propertyType][city] || [];
    return limit ? filteredItems.slice(0, limit) : filteredItems;
  } catch (error) {
    console.error('Error filtering properties:', error);
    return [];
  }
}