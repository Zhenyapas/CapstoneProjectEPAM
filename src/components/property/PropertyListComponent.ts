// components/property/PropertyListComponent.ts
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
  private scrollDelay: number = 200; // Затримка в мс після закінчення скролу
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

    // Додаємо відстеження скролу для контейнера властивостей
    const propertyColumn = document.querySelector('.property-column');
    if (propertyColumn) {
      propertyColumn.addEventListener('scroll', this.handleScroll.bind(this));
      
      // Додаємо обробник руху миші для всього контейнера з явним приведенням типу
      propertyColumn.addEventListener('mousemove', ((e: Event) => {
        this.handleMouseMove(e as MouseEvent);
      }) as EventListener);
    }
    
    // Підписуємося на зміни станів
    this.listingTypeState.subscribe(this.resetAndUpdatePropertyList.bind(this));
    this.propertyTypeState.subscribe(this.resetAndUpdatePropertyList.bind(this));
    this.cityState.subscribe(this.resetAndUpdatePropertyList.bind(this));
    this.addressState.subscribe(this.resetAndUpdatePropertyList.bind(this));
    
    // Ініціалізуємо пагінатор
    this.paginator = new Paginator(paginatorSelector, {
      totalItems: 0,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage,
      onPageChange: this.handlePageChange.bind(this)
    });
    
    // Ініціалізуємо список з початковими фільтрами
    this.updatePropertyList();
  }

  private handleMouseMove(e: MouseEvent): void {
    // Якщо відбувається скролінг, ігноруємо рух миші
    if (this.isScrolling) {
      return;
    }
    
    // Знаходимо карточку під курсором
    const target = e.target as HTMLElement;
    const card = target.closest('.property-card') as HTMLElement | null;
    
    if (card && this.lastHoveredElement !== card) {
      this.lastHoveredElement = card;
      
      // Отримуємо ID елемента
      const itemId = card.getAttribute('data-id');
      if (itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item && this.mapComponent && item.coordinates) {
          // Показуємо маркер без затримки при русі миші
          this.mapComponent.showPropertyMarker(item.coordinates, item.title);
        }
      }
    }
  }

  private handleScroll(): void {
    // Встановлюємо прапорець, що скролінг відбувається
    this.isScrolling = true;
    
    // Очищаємо попередній таймер, якщо він існує
    if (this.scrollTimeout !== null) {
      window.clearTimeout(this.scrollTimeout);
    }
    
    // Встановлюємо новий таймер для визначення, коли скролінг закінчився
    this.scrollTimeout = window.setTimeout(() => {
      this.isScrolling = false;
      
      // Після закінчення скролу, перевіряємо, чи є елемент під курсором
      // через обробник руху миші він автоматично спрацює
    }, this.scrollDelay);
  }
  
  private handlePageChange(page: number): void {
    // Змінюємо поточну сторінку і оновлюємо список
    this.currentPage = page;
    this.updatePropertyList();
    
    // Прокручуємо до початку списку
    const propertyColumn = document.querySelector('.property-column');
    if (propertyColumn) {
      propertyColumn.scrollTop = 0;
    }
  }

  private resetAndUpdatePropertyList(): void {
    // Скидаємо сторінку на першу при зміні фільтрів
    this.currentPage = 1;
    this.updatePropertyList();
  }
  
  private updatePropertyList(): void {
    // Отримуємо поточні значення фільтрів
    const listingType = this.listingTypeState.getValue();
    const propertyType = this.propertyTypeState.getValue();
    const city = this.cityState.getValue();
    const addressFilter = this.addressState.getValue();
    
    // Отримуємо відфільтровані елементи з пагінацією
    const result = getFilteredProperties(listingType, propertyType, city, {
      page: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      address: addressFilter
    });
    
    this.items = result.items;
    this.totalItems = result.totalItems;
    
    // Скидаємо індекси зображень при зміні фільтрів
    this.currentImageIndices.clear();
    
    // Очищаємо маркери на карті при зміні фільтрів
    if (this.mapComponent) {
      this.mapComponent.clearAllMarkers();
    }
    
    // Скидаємо останній наведений елемент
    this.lastHoveredElement = null;
    
    // Оновлюємо пагінатор
    if (this.paginator) {
      this.paginator.updateOptions({
        totalItems: this.totalItems,
        currentPage: this.currentPage
      });
    }
    
    // Відображаємо елементи
    this.renderPropertyItems();
  }
  
  private renderPropertyItems(): void {
    if (!this.container) return;
    
    // Очищаємо контейнер
    this.container.innerHTML = '';
    
    if (this.items.length === 0) {
      this.container.innerHTML = `
        <div class="property-list__empty">
          <p>No properties found for the selected filters.</p>
        </div>
      `;
      return;
    }
    
    // Відображаємо кожен елемент для поточної сторінки
    this.items.forEach(item => {
      const propertyCard = this.createPropertyCard(item);
      this.container?.appendChild(propertyCard);
    });
  }
  
  private createPropertyCard(item: PropertyItem): HTMLElement {
    // Створюємо елемент картки
    const card = document.createElement('div');
    card.className = 'property-card';
    card.setAttribute('data-id', item.id);
    
    // Якщо це перший рендеринг цього елемента, встановлюємо індекс зображення в 0
    if (!this.currentImageIndices.has(item.id)) {
      this.currentImageIndices.set(item.id, 0);
    }
    
    // Отримуємо поточний індекс зображення
    const currentImageIndex = this.currentImageIndices.get(item.id) || 0;
    
    // Створюємо контейнер для зображення
    const imageContainer = document.createElement('div');
    imageContainer.className = 'property-card__image';
    
    // Додаємо зображення або заглушку
    if (item.images && item.images.length > 0) {
      const img = document.createElement('img');
      img.src = `img/properties/${item.images[currentImageIndex]}`;
      img.alt = item.title;
      imageContainer.appendChild(img);
      
      // Додаємо кнопку для розширення зображення
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
      
      // Додаємо навігацію слайдера для зображень, якщо їх більше одного
      if (item.images.length > 1) {
        // Кнопка "назад"
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
        
        // Кнопка "вперед"
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
        
        // Індикатор слайдів
        const slideIndicator = document.createElement('div');
        slideIndicator.className = 'property-card__slide-indicator';
        slideIndicator.textContent = `${currentImageIndex + 1}/${item.images.length}`;
        imageContainer.appendChild(slideIndicator);
      }
    } else {
      // Додаємо зображення-заглушку, якщо масив пустий або undefined
      const img = document.createElement('img');
      img.src = 'img/properties/placeholder.png'; // Шлях до зображення-заглушки
      img.alt = 'No image available';
      img.className = 'property-card__placeholder';
      imageContainer.appendChild(img);
      
      // Додаємо текстову мітку на заглушці
      const placeholderText = document.createElement('div');
      placeholderText.className = 'property-card__placeholder-text';
      placeholderText.textContent = 'No images available';
      imageContainer.appendChild(placeholderText);
    }
    
    card.appendChild(imageContainer);
    
    // Додаємо інформацію про нерухомість
    const infoContainer = document.createElement('div');
    infoContainer.className = 'property-card__info';
    
    // Заголовок
    const title = document.createElement('h2');
    title.className = 'property-card__title';
    title.textContent = item.title;
    infoContainer.appendChild(title);
    
    // Адреса
    const address = document.createElement('p');
    address.className = 'property-card__address';
    address.textContent = item.address;
    infoContainer.appendChild(address);
  
    // Опис
    const description = document.createElement('p');
    description.className = 'property-card__description';
    description.textContent = item.description;
    infoContainer.appendChild(description);
    
    // Ціна
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
    
    // Оновлюємо зображення
    const imgElement = itemElement.querySelector('.property-card__image img') as HTMLImageElement;
    if (imgElement) {
      imgElement.src = `img/properties/${item.images[newIndex]}`;
    }
    
    // Оновлюємо індикатор слайдів
    const slideIndicator = itemElement.querySelector('.property-card__slide-indicator');
    if (slideIndicator) {
      slideIndicator.textContent = `${newIndex + 1}/${totalImages}`;
    }
  }
  
 
  public destroy(): void {
    // Очищаємо таймери
    if (this.scrollTimeout !== null) {
      window.clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }
    
    if (this.hoverTimeout !== null) {
      window.clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    
    // Відписуємося від подій
    this.listingTypeState.unsubscribe(this.resetAndUpdatePropertyList.bind(this));
    this.propertyTypeState.unsubscribe(this.resetAndUpdatePropertyList.bind(this));
    this.cityState.unsubscribe(this.resetAndUpdatePropertyList.bind(this));
    this.addressState.unsubscribe(this.resetAndUpdatePropertyList.bind(this));
    
    // Знімаємо обробники подій скролу
    const propertyColumn = document.querySelector('.property-column');
    if (propertyColumn) {
      propertyColumn.removeEventListener('scroll', this.handleScroll.bind(this));
      
      // Також з явним приведенням типу
      propertyColumn.removeEventListener('mousemove', ((e: Event) => {
        this.handleMouseMove(e as MouseEvent);
      }) as EventListener);
    }
  }
}