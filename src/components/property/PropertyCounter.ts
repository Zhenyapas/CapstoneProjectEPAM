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
    
    this.listingTypeState.subscribe(this.updatePropertyCount.bind(this));
    this.propertyTypeState.subscribe(this.updatePropertyCount.bind(this));
    this.cityState.subscribe(this.updatePropertyCount.bind(this));
    
    if (this.addressState) {
      this.addressState.subscribe(this.updatePropertyCount.bind(this));
    }
    
    this.updatePropertyCount();
  }
  
  

private async updatePropertyCount(): Promise<void> {
  if (!this.countElement) return;
  
  const listingType = this.listingTypeState.getValue();
  const propertyType = this.propertyTypeState.getValue();
  const city = this.cityState.getValue();
  
  try {

    let result = await getFilteredProperties(listingType, propertyType, city);
    
    if (this.addressState) {
      const addressFilter = this.addressState.getValue();
      if (addressFilter) {
        result = await getFilteredProperties(listingType, propertyType, city, {
          address: addressFilter
        });
      }
    }
    
    const propertyTypeText = propertyType === 'house' ? 'houses' : 'apartments';
    
    this.countElement.innerHTML = `
      <p class="property-count__text">
        There are <span class="property-count__number">${result.totalItems}</span> ${propertyTypeText} let's take a look!
      </p>
    `;
  } catch (error) {
    console.error('Error updating property count:', error);
    this.countElement.innerHTML = `
      <p class="property-count__text">
        Error loading properties. Please try again.
      </p>
    `;
  }
}
}