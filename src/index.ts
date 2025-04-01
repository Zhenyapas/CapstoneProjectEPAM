import './styles/main.scss';

class ToggleComponent {
    private firstButton: HTMLButtonElement | null = null;
    private secondButton: HTMLButtonElement | null = null;
    private container: HTMLDivElement | null = null;
    private type: 'header' | 'filter';
    private activeClass: string;
    private inactiveClass: string;
    private firstActiveClass: string = '';
    private secondActiveClass: string = '';
  
    constructor(
      containerSelector: string, 
      type: 'header' | 'filter', 
      activeClass: string = '--active', 
      inactiveClass: string = '--disabled'
    ) {
      this.type = type;
      this.activeClass = activeClass;
      this.inactiveClass = inactiveClass;
      
      this.firstActiveClass = type === 'header' ? 'rent-active' : 'house-active';
      this.secondActiveClass = type === 'header' ? 'sell-active' : 'apartment-active';
      
      this.container = document.querySelector(containerSelector);
      
      if (this.container) {
        this.firstButton = this.container.querySelector('button:first-child');
        this.secondButton = this.container.querySelector('button:last-child');
        this.init();
      } else {
        console.error(`Toggle container "${containerSelector}" not found`);
      }
    }
  
    private init(): void {
      if (!this.container || !this.firstButton || !this.secondButton) {
        console.error('Toggle components not found');
        return;
      }
  
      const buttonBaseClass = this.type === 'header' ? 'header__toggle__btn' : 'filter-placeholder__button';
      
      if (this.secondButton.classList.contains(`${buttonBaseClass}${this.activeClass}`)) {
        this.container.classList.add(this.secondActiveClass);
      } else {
        this.container.classList.add(this.firstActiveClass);
      }
  
      this.firstButton.addEventListener('click', () => this.activateFirst(buttonBaseClass));
      this.secondButton.addEventListener('click', () => this.activateSecond(buttonBaseClass));
    }
  
    private activateFirst(buttonBaseClass: string): void {

      if (!this.firstButton || !this.secondButton || !this.container) return;
  
      this.firstButton.classList.remove(`${buttonBaseClass}${this.inactiveClass}`);
      this.firstButton.classList.add(`${buttonBaseClass}${this.activeClass}`);
      
      this.secondButton.classList.remove(`${buttonBaseClass}${this.activeClass}`);
      this.secondButton.classList.add(`${buttonBaseClass}${this.inactiveClass}`);
      
      this.container.classList.add(this.firstActiveClass);
      this.container.classList.remove(this.secondActiveClass);
  
      const eventType = this.type === 'header' ? 'toggle-change' : 'filter-change';
      const detail = this.type === 'header' ? { toggleType: 'rent' } : { filterType: 'house' };
      
      const event = new CustomEvent(eventType, { detail });
      this.container.dispatchEvent(event);
    }
  
    private activateSecond(buttonBaseClass: string): void {

      if (!this.firstButton || !this.secondButton || !this.container) return;
  
      this.secondButton.classList.remove(`${buttonBaseClass}${this.inactiveClass}`);
      this.secondButton.classList.add(`${buttonBaseClass}${this.activeClass}`);
      
      this.firstButton.classList.remove(`${buttonBaseClass}${this.activeClass}`);
      this.firstButton.classList.add(`${buttonBaseClass}${this.inactiveClass}`);
      
      this.container.classList.add(this.secondActiveClass);
      this.container.classList.remove(this.firstActiveClass);
  
      const eventType = this.type === 'header' ? 'toggle-change' : 'filter-change';
      const detail = this.type === 'header' ? { toggleType: 'sell' } : { filterType: 'apartment' };
      
      const event = new CustomEvent(eventType, { detail });
      this.container.dispatchEvent(event);
    }
  }


  const headerToggle = document.querySelector('.header__toggle');
  if (headerToggle) {
    headerToggle.addEventListener('toggle-change', (e) => {
      const customEvent = e as CustomEvent;
      console.log('Toggle changed to:', customEvent.detail.toggleType);
    });
  }


  class CitySelector {
    private selector: HTMLElement | null = null;
    private selectedElement: HTMLElement | null = null;
    private dropdown: HTMLElement | null = null;
    private currentCityElement: HTMLElement | null = null;
    private items: NodeListOf<HTMLElement> | null = null;
    private arrow: HTMLElement | null = null;
    private isOpen: boolean = false;
  
    constructor(selectorId: string) {
      this.selector = document.querySelector(selectorId);
      
      if (this.selector) {
        this.selectedElement = this.selector.querySelector('.city-selector__selected');
        this.dropdown = this.selector.querySelector('.city-selector__dropdown');
        this.currentCityElement = this.selector.querySelector('.city-selector__current');
        this.items = this.selector.querySelectorAll('.city-selector__item');
        this.arrow = this.selector.querySelector('.city-selector__arrow');
        
        this.initEvents();
      } else {
        console.error(`City selector with ID ${selectorId} not found`);
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
  
    // private selectCity(item: HTMLElement): void {
    //   if (!this.currentCityElement || !this.items) return;
      
    //   // Отримання значення та тексту
    //   const cityValue = item.getAttribute('data-value');
    //   const cityText = item.textContent;
      
    //   // Оновлення поточного вибраного міста
    //   this.currentCityElement.textContent = cityText;
      
    //   // Оновлення активного класу
    //   this.items.forEach(i => {
    //     i.classList.remove('city-selector__item--active');
    //   });
    //   item.classList.add('city-selector__item--active');
      
    //   // Закриття випадаючого списку
    //   this.closeDropdown();
      
    //   // Тут можна додати логіку для фільтрації або інших дій при зміні міста
    //   // Наприклад, генерація події
    //   const event = new CustomEvent('city-change', { 
    //     detail: { city: cityValue }
    //   });
    //   this.selector?.dispatchEvent(event);
    // }

    private selectCity(item: HTMLElement): void {
        if (!this.currentCityElement || !this.items) return;
        
        // Отримання значення та тексту
        const cityValue = item.getAttribute('data-value');
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
        
        // Генерація події
        const event = new CustomEvent('city-change', { 
          detail: { city: cityValue }
        });
        this.selector?.dispatchEvent(event);
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

  const citySelector = document.querySelector('.city-selector');
  if (citySelector) {
     citySelector.addEventListener('city-change', (e) => {
      const customEvent = e as CustomEvent;
      console.log('City changed to:', customEvent.detail.city);
     })
  }
  

  document.addEventListener('DOMContentLoaded', () => {
    new ToggleComponent('.header__toggle', 'header');
    new ToggleComponent('.filter-placeholder', 'filter');
    new CitySelector('.city-selector');
  });