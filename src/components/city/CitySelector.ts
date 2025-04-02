import { StateManager } from '../../services/StateManager';
import { City } from '../../models/types';

export class CitySelector {
  private selector: HTMLElement | null = null;
  private selectedElement: HTMLElement | null = null;
  private dropdown: HTMLElement | null = null;
  private currentCityElement: HTMLElement | null = null;
  private items: NodeListOf<HTMLElement> | null = null;
  private arrow: HTMLElement | null = null;
  private isOpen: boolean = false;

  constructor(
    selectorId: string,
    private stateManager: StateManager<City>
  ) {
    this.selector = document.querySelector(selectorId);
    
    if (this.selector) {
      this.selectedElement = this.selector.querySelector('.city-selector__selected');
      this.dropdown = this.selector.querySelector('.city-selector__dropdown');
      this.currentCityElement = this.selector.querySelector('.city-selector__current');
      this.items = this.selector.querySelectorAll('.city-selector__item');
      this.arrow = this.selector.querySelector('.city-selector__arrow');
      
      this.initEvents();
      this.initState();
    } else {
      console.error(`City selector with ID ${selectorId} not found`);
    }
  }

  private initState(): void {
    if (!this.currentCityElement || !this.items) return;
    
    // Знаходимо активний елемент
    const activeItem = Array.from(this.items).find(item => 
      item.classList.contains('city-selector__item--active')
    );
    
    if (activeItem) {
      const cityValue = activeItem.getAttribute('data-value') || '';
      this.stateManager.setValue(cityValue);
    }
    
    // Підписуємося на зміни стану
    this.stateManager.subscribe(this.handleStateChange.bind(this));
  }

  private handleStateChange(city: City): void {
    if (!this.items) return;
    
    const item = Array.from(this.items).find(el => 
      el.getAttribute('data-value') === city
    );
    
    if (item) {
      this.selectCity(item, false);
    }
  }

  private initEvents(): void {
    if (this.selectedElement) {
      this.selectedElement.addEventListener('click', this.toggleDropdown.bind(this));
    }
    
    if (this.items) {
      this.items.forEach(item => {
        item.addEventListener('click', () => this.selectCity(item));
      });
    }
    
    // Закриття при кліку поза селектором
    document.addEventListener('click', (e) => {
      if (this.selector && !this.selector.contains(e.target as Node) && this.isOpen) {
        this.closeDropdown();
      }
    });
  }

  private toggleDropdown(): void {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  private openDropdown(): void {
    if (this.selector) {
      this.selector.classList.add('open');
      this.isOpen = true;
    }
  }

  private closeDropdown(): void {
    if (this.selector) {
      this.selector.classList.remove('open');
      this.isOpen = false;
    }
  }

  private selectCity(item: HTMLElement, updateState: boolean = true): void {
    if (!this.currentCityElement || !this.items) return;
    
    // Отримання значення та тексту
    const cityValue = item.getAttribute('data-value') || '';
    const cityText = item.textContent;
    
    // Плавний перехід для тексту
    this.animateTextChange(this.currentCityElement, cityText || '');
    
    // Оновлення активного класу з плавним переходом
    this.items.forEach(i => {
      if (i.classList.contains('city-selector__item--active')) {
        i.classList.add('city-selector__item--fade-out');
        
        // Видаляємо класи після завершення анімації
        setTimeout(() => {
          i.classList.remove('city-selector__item--active');
          i.classList.remove('city-selector__item--fade-out');
        }, 300);
      }
    });
    
    // Додаємо клас активності з плавним з'явленням
    item.classList.add('city-selector__item--fade-in');
    item.classList.add('city-selector__item--active');
    
    setTimeout(() => {
      item.classList.remove('city-selector__item--fade-in');
    }, 300);
    
    // Закриття випадаючого списку з затримкою
    setTimeout(() => {
      this.closeDropdown();
    }, 200);
    
    // Оновлюємо стан, якщо потрібно
    if (updateState) {
      this.stateManager.setValue(cityValue);
    }
  }
  
  private animateTextChange(element: HTMLElement, newText: string): void {
    // Створюємо плавне зникнення
    element.style.opacity = '0';
    element.style.transform = 'translateY(-5px)';
    
    // Змінюємо текст після зникнення
    setTimeout(() => {
      element.textContent = newText;
      
      // Плавно показуємо з новим текстом
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 10);
    }, 150);
  }
}