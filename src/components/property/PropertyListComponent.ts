import { StateManager } from '../../services/StateManager';
import { ListingType, PropertyType, City, PropertyItem } from '../../models/types';
import { getFilteredProperties } from '../../models/propertyData';
import { MapComponent } from '../map/MapComponent';
import { Paginator } from '../paginator/Paginator';

export class PropertyListComponent {
  private container: HTMLElement | null = null;
  private items: PropertyItem[] = [];
  private currentImageIndices: Map<string, number> = new Map();
  private isScrolling: boolean = false;
  private scrollTimeout: number | null = null;
  private hoverTimeout: number | null = null;
  private scrollDelay: number = 200; 
  private lastHoveredElement: HTMLElement | null = null;
  private paginator: Paginator | null = null;
  private currentPage: number = 1;
  private itemsPerPage: number = 10;
  private totalItems: number = 0;
  
  constructor(
    containerSelector: string,
    paginatorSelector: string,
    private listingTypeState: StateManager<ListingType>,
    private propertyTypeState: StateManager<PropertyType>,
    private cityState: StateManager<City>,
    private addressState: StateManager<string | null>,
    private mapComponent: MapComponent | null = null
  ) {
    this.container = document.querySelector(containerSelector);
    
    if (!this.container) {
      console.error(`Property list container with selector "${containerSelector}" not found`);
      return;
    }


    const propertyColumn = document.querySelector('.property-column');
    if (propertyColumn) {

      propertyColumn.addEventListener('scroll', this.handleScroll.bind(this));
      propertyColumn.addEventListener('mousemove', ((e: Event) => {
        this.handleMouseMove(e as MouseEvent);
      }) as EventListener);

    }
    
    this.listingTypeState.subscribe(this.resetAndUpdatePropertyList.bind(this));
    this.propertyTypeState.subscribe(this.resetAndUpdatePropertyList.bind(this));
    this.cityState.subscribe(this.resetAndUpdatePropertyList.bind(this));
    this.addressState.subscribe(this.resetAndUpdatePropertyList.bind(this));
    
    this.paginator = new Paginator(paginatorSelector, {
      totalItems: 0,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage,
      onPageChange: this.handlePageChange.bind(this)
    });
    
    if (this.container) {
      this.container.innerHTML = `
        <div class="property-list__loading">
          <p>Loading properties...</p>
        </div>
      `;
    }
    
    this.updatePropertyList();
  }

  private handleMouseMove(e: MouseEvent): void {

    if (this.isScrolling) {
      return;
    }

    const target = e.target as HTMLElement;
    const card = target.closest('.property-card') as HTMLElement | null;
    
    if (card && this.lastHoveredElement !== card) {
      this.lastHoveredElement = card;
      
      const itemId = card.getAttribute('data-id');
      if (itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item && this.mapComponent && item.coordinates) {
          this.mapComponent.showPropertyMarker(item.coordinates, item.title);
        }
      }
    }
  }

  private handleScroll(): void {

    this.isScrolling = true;

    if (this.scrollTimeout !== null) {
      window.clearTimeout(this.scrollTimeout);
    }
    
    this.scrollTimeout = window.setTimeout(() => {
      this.isScrolling = false;
    }, this.scrollDelay);

  }
  
  private handlePageChange(page: number): void {

    this.currentPage = page;
    this.updatePropertyList();
    
    const propertyColumn = document.querySelector('.property-column');
    if (propertyColumn) {
      propertyColumn.scrollTop = 0;
    }
  }

  private resetAndUpdatePropertyList(): void {
    this.currentPage = 1;
    this.updatePropertyList();
  }
  
  private async updatePropertyList(): Promise<void> {
    try {
      if (this.container) {
        this.container.innerHTML = `
          <div class="property-list__loading">
            <p>Loading properties...</p>
          </div>
        `;
      }
      
      const listingType = this.listingTypeState.getValue();
      const propertyType = this.propertyTypeState.getValue();
      const city = this.cityState.getValue();
      const addressFilter = this.addressState.getValue();
      
      const result = await getFilteredProperties(listingType, propertyType, city, {
        page: this.currentPage,
        itemsPerPage: this.itemsPerPage,
        address: addressFilter
      });
      
      this.items = result.items;
      this.totalItems = result.totalItems;
      
      this.currentImageIndices.clear();
      
      if (this.mapComponent) {
        this.mapComponent.clearAllMarkers();
      }
      
      this.lastHoveredElement = null;
      
      if (this.paginator) {
        this.paginator.updateOptions({
          totalItems: this.totalItems,
          currentPage: this.currentPage
        });
      }
      
      this.renderPropertyItems();
    } catch (error) {
      console.error('Error updating property list:', error);
      
      if (this.container) {
        this.container.innerHTML = `
          <div class="property-list__error">
            <p>Error loading properties. Please try again later.</p>
          </div>
        `;
      }
    }
  }
  
  private renderPropertyItems(): void {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    
    if (this.items.length === 0) {
      this.container.innerHTML = `
        <div class="property-list__empty">
          <p>No properties found for the selected filters.</p>
        </div>
      `;
      return;
    }
    
    this.items.forEach(item => {
      const propertyCard = this.createPropertyCard(item);
      this.container?.appendChild(propertyCard);
    });
  }
  
  private createPropertyCard(item: PropertyItem): HTMLElement {

    const card = document.createElement('div');
    card.className = 'property-card';
    card.setAttribute('data-id', item.id);
    
    if (!this.currentImageIndices.has(item.id)) {
      this.currentImageIndices.set(item.id, 0);
    }
    
    const currentImageIndex = this.currentImageIndices.get(item.id) || 0;
    
    const imageContainer = document.createElement('div');
    imageContainer.className = 'property-card__image';
    
    if (item.images && item.images.length > 0) {
      const img = document.createElement('img');
      img.src = `img/properties/${item.images[currentImageIndex]}`;
      img.alt = item.title;
      imageContainer.appendChild(img);
      
      const expandButton = document.createElement('button');
      expandButton.className = 'property-card__expand';
      expandButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 3 21 3 21 9"></polyline>
          <polyline points="9 21 3 21 3 15"></polyline>
          <line x1="21" y1="3" x2="14" y2="10"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
      `;
      imageContainer.appendChild(expandButton);
      
      if (item.images.length > 1) {
        const prevButton = document.createElement('button');
        prevButton.className = 'property-card__nav-btn property-card__nav-btn--prev';
        prevButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        `;
        prevButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.showPrevImage(item.id);
        });
        imageContainer.appendChild(prevButton);
        
        const nextButton = document.createElement('button');
        nextButton.className = 'property-card__nav-btn property-card__nav-btn--next';
        nextButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        `;
        nextButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.showNextImage(item.id);
        });
        imageContainer.appendChild(nextButton);
        
        const slideIndicator = document.createElement('div');
        slideIndicator.className = 'property-card__slide-indicator';
        slideIndicator.textContent = `${currentImageIndex + 1}/${item.images.length}`;
        imageContainer.appendChild(slideIndicator);
      }
    } else {
      const img = document.createElement('img');
      img.src = 'img/properties/placeholder.png'; 
      img.alt = 'No image available';
      img.className = 'property-card__placeholder';
      imageContainer.appendChild(img);
      
      const placeholderText = document.createElement('div');
      placeholderText.className = 'property-card__placeholder-text';
      placeholderText.textContent = 'No images available';
      imageContainer.appendChild(placeholderText);
    }
    
    card.appendChild(imageContainer);
    
    const infoContainer = document.createElement('div');
    infoContainer.className = 'property-card__info';
    
    const title = document.createElement('h2');
    title.className = 'property-card__title';
    title.textContent = item.title;
    infoContainer.appendChild(title);
    
    const address = document.createElement('p');
    address.className = 'property-card__address';
    address.textContent = item.address;
    infoContainer.appendChild(address);
  
    const description = document.createElement('p');
    description.className = 'property-card__description';
    description.textContent = item.description;
    infoContainer.appendChild(description);
    
    const price = document.createElement('div');
    price.className = 'property-card__price';
    
    if (this.listingTypeState.getValue() === 'rent') {
      price.textContent = `$${item.price.toLocaleString()}/mo`;
    } else {
      price.textContent = `$${item.price.toLocaleString()}`;
    }
    
    infoContainer.appendChild(price);
    
    card.appendChild(infoContainer);
    
    return card;
  }
  
  private showNextImage(itemId: string): void {
    const currentIndex = this.currentImageIndices.get(itemId) || 0;
    const item = this.items.find(i => i.id === itemId);
    
    if (!item || !item.images) return;
    
    const newIndex = (currentIndex + 1) % item.images.length;
    this.currentImageIndices.set(itemId, newIndex);
    
    this.updateItemImage(itemId, newIndex, item.images.length);
  }
  
  private showPrevImage(itemId: string): void {
    const currentIndex = this.currentImageIndices.get(itemId) || 0;
    const item = this.items.find(i => i.id === itemId);
    
    if (!item || !item.images) return;
    
    const newIndex = (currentIndex - 1 + item.images.length) % item.images.length;
    this.currentImageIndices.set(itemId, newIndex);
    
    this.updateItemImage(itemId, newIndex, item.images.length);
  }
  
  private updateItemImage(itemId: string, newIndex: number, totalImages: number): void {
    const itemElement = this.container?.querySelector(`.property-card[data-id="${itemId}"]`);
    if (!itemElement) return;
    
    const item = this.items.find(i => i.id === itemId);
    if (!item || !item.images) return;
    
    const imgElement = itemElement.querySelector('.property-card__image img') as HTMLImageElement;
    if (imgElement) {
      imgElement.src = `img/properties/${item.images[newIndex]}`;
    }

    const slideIndicator = itemElement.querySelector('.property-card__slide-indicator');
    if (slideIndicator) {
      slideIndicator.textContent = `${newIndex + 1}/${totalImages}`;
    }
  }
  
 
  public destroy(): void {

    if (this.scrollTimeout !== null) {
      window.clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }
    
    if (this.hoverTimeout !== null) {
      window.clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    
    this.listingTypeState.unsubscribe(this.resetAndUpdatePropertyList.bind(this));
    this.propertyTypeState.unsubscribe(this.resetAndUpdatePropertyList.bind(this));
    this.cityState.unsubscribe(this.resetAndUpdatePropertyList.bind(this));
    this.addressState.unsubscribe(this.resetAndUpdatePropertyList.bind(this));
    
    const propertyColumn = document.querySelector('.property-column');
    if (propertyColumn) {
      propertyColumn.removeEventListener('scroll', this.handleScroll.bind(this));
      
      propertyColumn.removeEventListener('mousemove', ((e: Event) => {
        this.handleMouseMove(e as MouseEvent);
      }) as EventListener);
    }
  }
}