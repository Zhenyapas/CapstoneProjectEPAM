import { StateManager } from '../../services/StateManager';
import { ListingType, PropertyType, City, PropertyItem } from '../../models/types';
import { getFilteredProperties } from '../../models/propertyData';

export class SearchComponent {
  private container: HTMLElement | null = null;
  private input: HTMLInputElement | null = null;
  private button: HTMLButtonElement | null = null;
  private dropdown: HTMLElement | null = null;
  private searchTimeout: number | null = null;
  private selectedAddress: string | null = null;
  private selectedStreet: string | null = null;
  private isSearchingStreet: boolean = true;
  private addressStateManager: StateManager<string | null>;

  constructor(
    containerSelector: string,
    private listingTypeState: StateManager<ListingType>,
    private propertyTypeState: StateManager<PropertyType>,
    private cityState: StateManager<City>
  ) {
    this.container = document.querySelector(containerSelector);
    this.addressStateManager = new StateManager<string | null>(null);
    
    if (!this.container) {
      console.error(`Search container with selector "${containerSelector}" not found`);
      return;
    }
    
    this.initElements();
    this.initEvents();
    
    this.listingTypeState.subscribe(this.resetSearch.bind(this));
    this.propertyTypeState.subscribe(this.resetSearch.bind(this));
    this.cityState.subscribe(this.resetSearch.bind(this));
  }
  
  private initElements(): void {
    if (!this.container) return;
    
    this.input = this.container.querySelector('.search-placeholder');
    this.button = this.container.querySelector('.search-button');
    
    if (!this.dropdown) {
      this.dropdown = document.createElement('div');
      this.dropdown.className = 'search-dropdown';
      this.dropdown.style.display = 'none';
      this.container.appendChild(this.dropdown);
    }
    
    if (this.button) {
      this.button.disabled = true;
    }
  }
  
  private initEvents(): void {
    if (!this.input || !this.button) return;
    
    this.input.addEventListener('input', this.handleInputChange.bind(this));
    
    this.button.addEventListener('click', this.handleSearch.bind(this));
    
    document.addEventListener('click', (e) => {
      if (this.container && !this.container.contains(e.target as Node)) {
        this.hideDropdown();
      }
    });
    
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.button && !this.button.disabled) {
        this.handleSearch();
      }
    });
  }
  
  private handleInputChange(): void {
    if (!this.input || !this.dropdown) return;
    
    const searchValue = this.input.value.trim();
    
    if (this.selectedStreet && searchValue.includes(this.selectedStreet)) {
      this.updateBuildingSearch(searchValue);
      return;
    }
  
    if (this.selectedStreet && !searchValue.includes(this.selectedStreet)) {
      this.resetStreetSelection();
      return;
    }
    
    this.selectedAddress = null;
    if (this.button && !this.selectedStreet) {
      this.button.disabled = true;
    }
    
    if (!searchValue) {
      this.hideDropdown();
      this.addressStateManager.setValue(null);
      return;
    }
    
    this.showDropdown();
    this.dropdown.innerHTML = '<div class="search-dropdown__searching">Searching...</div>';
    
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    this.searchTimeout = window.setTimeout(() => {
      this.performSearch(searchValue).catch(error => {
        console.error('Error in search:', error);
      });
    }, 500); 
  }
  
  private updateBuildingSearch(query: string): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  
    this.showDropdown();
    if (this.dropdown) {
      this.dropdown.innerHTML = '<div class="search-dropdown__searching">Searching...</div>';
    }
    
    this.searchTimeout = window.setTimeout(() => {
      if (this.selectedStreet) {
        this.performSearch(query).catch(error => {
          console.error('Error in building search:', error);
        });
      }
    }, 500);
  }
  
  private async performSearch(searchValue: string): Promise<void> {
    if (!this.dropdown) return;
  
    try {
      const listingType = this.listingTypeState.getValue();
      const propertyType = this.propertyTypeState.getValue();
      const city = this.cityState.getValue();
      
      const filteredResult = await getFilteredProperties(listingType, propertyType, city);
      const filteredItems = filteredResult.items;
      
      if (!this.selectedStreet && this.isSearchingStreet) {
        this.searchStreets(filteredItems, searchValue);
      } else {
        this.searchAddressesOnStreet(filteredItems, searchValue);
      }
    } catch (error) {
      console.error('Error performing search:', error);
      if (this.dropdown) {
        this.dropdown.innerHTML = '<div class="search-dropdown__error">Error loading search results</div>';
      }
    }
  }
  
  private searchStreets(items: PropertyItem[], searchValue: string): void {
    if (!this.dropdown) return;
    
    const streets = new Set<string>();
    
    items.forEach(item => {
      if (item.street.toLowerCase().includes(searchValue.toLowerCase())) {
        streets.add(item.street);
      }
    });
    
    const sortedStreets = Array.from(streets).sort();
    
    if (sortedStreets.length > 0) {
      this.dropdown.innerHTML = sortedStreets
        .map(street => `<div class="search-dropdown__item search-dropdown__item--street">${street}</div>`)
        .join('');
      
      const streetItems = this.dropdown.querySelectorAll('.search-dropdown__item--street');
      streetItems.forEach(item => {
        item.addEventListener('click', () => {
          this.selectStreet(item.textContent || '');
        });
      });
    } else {
      this.dropdown.innerHTML = '<div class="search-dropdown__empty">No streets found</div>';
    }
  }
  
  private searchAddressesOnStreet(items: PropertyItem[], searchValue: string): void {
    if (!this.dropdown || !this.selectedStreet) return;
    
    const streetPrefix = this.selectedStreet + ' ';
    let buildingNumber = '';
    
    if (searchValue.startsWith(streetPrefix)) {
      buildingNumber = searchValue.substring(streetPrefix.length).trim();
    }
    
    const matchingAddresses = items.filter(item => {
      const hasStreet = item.street === this.selectedStreet;
      
      if (!buildingNumber) {
        return hasStreet;
      }
      
      const addressParts = item.address.split(',');
      let foundNumber = false;
      
      for (const part of addressParts) {
        const trimmedPart = part.trim();
        
        const numberAtStart = trimmedPart.match(/^(\d+)/);
        if (numberAtStart && numberAtStart[1].includes(buildingNumber)) {
          foundNumber = true;
          break;
        }
        
        const numberAtEnd = trimmedPart.match(/(\d+)$/);
        if (numberAtEnd && numberAtEnd[1].includes(buildingNumber)) {
          foundNumber = true;
          break;
        }
        
        if (trimmedPart.includes(buildingNumber)) {
          foundNumber = true;
          break;
        }
      }
      
      return hasStreet && foundNumber;
    }).map(item => item.address);
    

    if (matchingAddresses.length > 0) {
      this.dropdown.innerHTML = matchingAddresses
        .map(address => `<div class="search-dropdown__item">${address}</div>`)
        .join('');
      
      this.dropdown.innerHTML = `
        <div class="search-dropdown__back">← Back to street search</div>
        ${this.dropdown.innerHTML}
      `;
      
      const backButton = this.dropdown.querySelector('.search-dropdown__back');
      if (backButton) {
        backButton.addEventListener('click', () => {
          this.resetStreetSelection();
        });
      }
      
      const items = this.dropdown.querySelectorAll('.search-dropdown__item');
      items.forEach(item => {
        item.addEventListener('click', () => {
          this.selectAddress(item.textContent || '');
        });
      });
    } else {
      this.dropdown.innerHTML = `
        <div class="search-dropdown__back">← Back to street search</div>
        <div class="search-dropdown__empty">No addresses found on this street</div>
      `;
      

      const backButton = this.dropdown.querySelector('.search-dropdown__back');
      if (backButton) {
        backButton.addEventListener('click', () => {
          this.resetStreetSelection();
        });
      }
    }
  }
  
  private selectStreet(street: string): void {
    if (!this.input) return;
    
    this.selectedStreet = street;
    this.isSearchingStreet = false;
    this.input.value = street + ' '; 
    
    if (this.button) {
      this.button.disabled = false;
    }
    
    this.input.focus();
    this.input.selectionStart = this.input.value.length;
    this.input.selectionEnd = this.input.value.length;
    
    this.performSearch(this.input.value).catch(error => {
      console.error('Error in street selection search:', error);
    });
  }
  
  private selectAddress(address: string): void {
    if (!this.input || !this.button) return;
    
    this.selectedAddress = address;
    this.input.value = address;
    
    this.button.disabled = false;
    
    this.hideDropdown();
  }
  
  private resetStreetSelection(): void {
    if (!this.input) return;
    
    this.selectedStreet = null;
    this.isSearchingStreet = true;
    
    this.input.value = '';

    if (this.button) {
      this.button.disabled = true;
    }
    
    this.hideDropdown();
    this.handleInputChange();
  }
  
  private handleSearch(): void {
    if (this.selectedAddress) {
      this.addressStateManager.setValue(this.selectedAddress);
      console.log(`Searching for address: ${this.selectedAddress}`);
    } 
    else if (this.selectedStreet) {
      this.addressStateManager.setValue(this.selectedStreet);
      console.log(`Searching for street: ${this.selectedStreet}`);
    }
  }
  
  private showDropdown(): void {
    if (this.dropdown) {
      this.dropdown.style.display = 'block';
    }
  }
  
  private hideDropdown(): void {
    if (this.dropdown) {
      this.dropdown.style.display = 'none';
    }
  }
  
  private resetSearch(): void {
    if (!this.input) return;
    
    this.input.value = '';
    this.selectedAddress = null;
    this.selectedStreet = null;
    this.isSearchingStreet = true;
    
    if (this.button) {
      this.button.disabled = true;
    }
    
    this.hideDropdown();
    
    this.addressStateManager.setValue(null);
  }
  
  private clearSearch(): void {
    if (!this.input) return;
    
    this.input.value = '';
    this.selectedAddress = null;
    this.selectedStreet = null;
    this.isSearchingStreet = true;
    
    if (this.button) {
      this.button.disabled = true;
    }
    
    this.addressStateManager.setValue(null);
    this.hideDropdown();
  }
  

  public getAddressState(): StateManager<string | null> {
    return this.addressStateManager;
  }
}