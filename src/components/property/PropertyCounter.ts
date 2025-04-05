// components/property/PropertyCounter.ts
import { StateManager } from '../../services/StateManager';
import { ListingType, PropertyType, City } from '../../models/types';
import { getFilteredProperties } from '../../models/propertyData';

export class PropertyCounter {
  private countElement: HTMLElement | null = null;
  
  constructor(
    countSelector: string,
    private listingTypeState: StateManager<ListingType>,
    private propertyTypeState: StateManager<PropertyType>,
    private cityState: StateManager<City>,
    private addressState?: StateManager<string | null>
  ) {
    this.countElement = document.querySelector(countSelector);
    
    if (!this.countElement) {
      console.error(`Property count element with selector "${countSelector}" not found`);
      return;
    }
    
    // Підписуємося на зміни станів
    this.listingTypeState.subscribe(this.updatePropertyCount.bind(this));
    this.propertyTypeState.subscribe(this.updatePropertyCount.bind(this));
    this.cityState.subscribe(this.updatePropertyCount.bind(this));
    
    // Підписуємося на зміни адреси, якщо вона надана
    if (this.addressState) {
      this.addressState.subscribe(this.updatePropertyCount.bind(this));
    }
    
    // Ініціалізуємо лічильник з початковими фільтрами
    this.updatePropertyCount();
  }
  
  // private updatePropertyCount(): void {
  //   if (!this.countElement) return;
    
  //   // Отримуємо поточні значення фільтрів
  //   const listingType = this.listingTypeState.getValue();
  //   const propertyType = this.propertyTypeState.getValue();
  //   const city = this.cityState.getValue();
    
  //   // Отримуємо відфільтровані елементи
  //   let propertyItems = getFilteredProperties(listingType, propertyType, city);
    
  //   // Додаткова фільтрація за адресою, якщо потрібно
  //   if (this.addressState) {
  //     const address = this.addressState.getValue();
  //     if (address) {
  //       propertyItems = propertyItems.filter(item => 
  //         item.address.toLowerCase() === address.toLowerCase()
  //       );
  //     }
  //   }
    
  //   // Оновлюємо текст відповідно до типу нерухомості
  //   const propertyTypeText = propertyType === 'house' ? 'houses' : 'apartments';
    
  //   // Формуємо повний текст
  //   this.countElement.innerHTML = `
  //     <p class="property-count__text">
  //       There are <span class="property-count__number">${propertyItems.length}</span> ${propertyTypeText} let's take a look!
  //     </p>
  //   `;
  // }

  // components/property/PropertyCounter.ts
// private updatePropertyCount(): void {
//   if (!this.countElement) return;
  
//   // Отримуємо поточні значення фільтрів
//   const listingType = this.listingTypeState.getValue();
//   const propertyType = this.propertyTypeState.getValue();
//   const city = this.cityState.getValue();
  
//   // Отримуємо відфільтровані елементи
//   let propertyItems = getFilteredProperties(listingType, propertyType, city);
  
//   // Додаткова фільтрація за адресою або вулицею
//   if (this.addressState) {
//     const addressFilter = this.addressState.getValue();
//     if (addressFilter) {
//       propertyItems = propertyItems.filter(item => 
//         // Перевіряємо чи це повна адреса чи вулиця
//         item.address.toLowerCase() === addressFilter.toLowerCase() || 
//         item.street.toLowerCase() === addressFilter.toLowerCase()
//       );
//     }
//   }
  
//   // Оновлюємо текст відповідно до типу нерухомості
//   const propertyTypeText = propertyType === 'house' ? 'houses' : 'apartments';
  
//   // Формуємо повний текст
//   this.countElement.innerHTML = `
//     <p class="property-count__text">
//       There are <span class="property-count__number">${propertyItems.length}</span> ${propertyTypeText} let's take a look!
//     </p>
//   `;
// }
private updatePropertyCount(): void {
  if (!this.countElement) return;
  
  // Отримуємо поточні значення фільтрів
  const listingType = this.listingTypeState.getValue();
  const propertyType = this.propertyTypeState.getValue();
  const city = this.cityState.getValue();
  
  // Отримуємо відфільтровані елементи
  let result = getFilteredProperties(listingType, propertyType, city);
  
  // Додаткова фільтрація за адресою, якщо вона є
  if (this.addressState) {
    const addressFilter = this.addressState.getValue();
    if (addressFilter) {
      // Адреса вже враховується в getFilteredProperties
      result = getFilteredProperties(listingType, propertyType, city, {
        address: addressFilter
      });
    }
  }
  
  // Оновлюємо текст відповідно до типу нерухомості
  const propertyTypeText = propertyType === 'house' ? 'houses' : 'apartments';
  
  // Формуємо повний текст
  this.countElement.innerHTML = `
    <p class="property-count__text">
      There are <span class="property-count__number">${result.totalItems}</span> ${propertyTypeText} let's take a look!
    </p>
  `;
}
}