import './styles/main.scss';
import { StateManager } from './services/StateManager';
import { HeaderToggleComponent } from './components/toggle/HeaderToggleComponent';
import { FilterToggleComponent } from './components/toggle/FilterToggleComponent';
import { CitySelector } from './components/city/CitySelector';
import { MapComponent } from './components/map/MapComponent';
import { ListingType, PropertyType, City } from './models/types';

// Створюємо state managers для різних частин стану
const listingTypeState = new StateManager<ListingType>('rent');
const propertyTypeState = new StateManager<PropertyType>('house');
const cityState = new StateManager<City>('kyiv');

// Підписуємося на всі зміни стану для логування
listingTypeState.subscribe(value => {
  console.log('Listing type changed to:', value);
});

propertyTypeState.subscribe(value => {
  console.log('Property type changed to:', value);
});

cityState.subscribe(value => {
  console.log('City changed to:', value);
});

// Ініціалізуємо все після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
  // Створюємо компоненти з передачею state managers
  new HeaderToggleComponent('.header__toggle', listingTypeState);
  new FilterToggleComponent('.filter-placeholder', propertyTypeState);
  new CitySelector('.city-selector', cityState);
  
  // Ініціалізуємо карту та підписуємо на зміни міста
  new MapComponent('.map-placeholder', cityState);
});