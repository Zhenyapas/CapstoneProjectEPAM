import { StateManager } from '../../services/StateManager';
import { PropertyType } from '../../models/types';

export class FilterToggleComponent {
  private houseButton: HTMLButtonElement | null = null;
  private apartmentButton: HTMLButtonElement | null = null;
  private container: HTMLDivElement | null = null;
  private activeClass: string;
  private inactiveClass: string;

  constructor(
    containerSelector: string,
    private stateManager: StateManager<PropertyType>,
    activeClass: string = '--active',
    inactiveClass: string = '--disabled'
  ) {
    this.activeClass = activeClass;
    this.inactiveClass = inactiveClass;
    
    this.container = document.querySelector(containerSelector);
    
    if (this.container) {
      this.houseButton = this.container.querySelector('button:first-child');
      this.apartmentButton = this.container.querySelector('button:last-child');
      this.init();
    } else {
      console.error(`Filter toggle container "${containerSelector}" not found`);
    }
  }

  private init(): void {
    if (!this.container || !this.houseButton || !this.apartmentButton) {
      console.error('Filter toggle components not found');
      return;
    }

    const buttonBaseClass = 'filter-placeholder__button';
    
    // Встановлюємо початковий стан залежно від активної кнопки
    if (this.apartmentButton.classList.contains(`${buttonBaseClass}${this.activeClass}`)) {
      this.container.classList.add('apartment-active');
      this.stateManager.setValue('apartment');
    } else {
      this.container.classList.add('house-active');
      this.stateManager.setValue('house');
    }

    // Додаємо обробники подій
    this.houseButton.addEventListener('click', () => this.activateHouse(buttonBaseClass));
    this.apartmentButton.addEventListener('click', () => this.activateApartment(buttonBaseClass));
    
    // Підписуємося на зміни стану
    this.stateManager.subscribe(this.handleStateChange.bind(this));
  }

  private handleStateChange(propertyType: PropertyType): void {
    const buttonBaseClass = 'filter-placeholder__button';
    
    if (propertyType === 'house') {
      this.activateHouse(buttonBaseClass, false);
    } else {
      this.activateApartment(buttonBaseClass, false);
    }
  }

  private activateHouse(buttonBaseClass: string, updateState: boolean = true): void {
    if (!this.houseButton || !this.apartmentButton || !this.container) return;

    this.houseButton.classList.remove(`${buttonBaseClass}${this.inactiveClass}`);
    this.houseButton.classList.add(`${buttonBaseClass}${this.activeClass}`);
    
    this.apartmentButton.classList.remove(`${buttonBaseClass}${this.activeClass}`);
    this.apartmentButton.classList.add(`${buttonBaseClass}${this.inactiveClass}`);
    
    this.container.classList.add('house-active');
    this.container.classList.remove('apartment-active');

    // Оновлюємо стан, якщо потрібно
    if (updateState) {
      this.stateManager.setValue('house');
    }
  }

  private activateApartment(buttonBaseClass: string, updateState: boolean = true): void {
    if (!this.houseButton || !this.apartmentButton || !this.container) return;

    this.apartmentButton.classList.remove(`${buttonBaseClass}${this.inactiveClass}`);
    this.apartmentButton.classList.add(`${buttonBaseClass}${this.activeClass}`);
    
    this.houseButton.classList.remove(`${buttonBaseClass}${this.activeClass}`);
    this.houseButton.classList.add(`${buttonBaseClass}${this.inactiveClass}`);
    
    this.container.classList.add('apartment-active');
    this.container.classList.remove('house-active');

    // Оновлюємо стан, якщо потрібно
    if (updateState) {
      this.stateManager.setValue('apartment');
    }
  }
}