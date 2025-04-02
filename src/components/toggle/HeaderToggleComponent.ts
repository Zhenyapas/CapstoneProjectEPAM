import { StateManager } from '../../services/StateManager';
import { ListingType } from '../../models/types';

export class HeaderToggleComponent {
  private rentButton: HTMLButtonElement | null = null;
  private sellButton: HTMLButtonElement | null = null;
  private container: HTMLDivElement | null = null;
  private activeClass: string;
  private inactiveClass: string;

  constructor(
    containerSelector: string,
    private stateManager: StateManager<ListingType>,
    activeClass: string = '--active',
    inactiveClass: string = '--disabled'
  ) {
    this.activeClass = activeClass;
    this.inactiveClass = inactiveClass;
    
    this.container = document.querySelector(containerSelector);
    
    if (this.container) {
      this.rentButton = this.container.querySelector('button:first-child');
      this.sellButton = this.container.querySelector('button:last-child');
      this.init();
    } else {
      console.error(`Header toggle container "${containerSelector}" not found`);
    }
  }

  private init(): void {
    if (!this.container || !this.rentButton || !this.sellButton) {
      console.error('Header toggle components not found');
      return;
    }

    const buttonBaseClass = 'header__toggle__btn';
    
    // Встановлюємо початковий стан залежно від активної кнопки
    if (this.sellButton.classList.contains(`${buttonBaseClass}${this.activeClass}`)) {
      this.container.classList.add('sell-active');
      this.stateManager.setValue('sell');
    } else {
      this.container.classList.add('rent-active');
      this.stateManager.setValue('rent');
    }

    // Додаємо обробники подій
    this.rentButton.addEventListener('click', () => this.activateRent(buttonBaseClass));
    this.sellButton.addEventListener('click', () => this.activateSell(buttonBaseClass));
    
    // Підписуємося на зміни стану
    this.stateManager.subscribe(this.handleStateChange.bind(this));
  }

  private handleStateChange(listingType: ListingType): void {
    const buttonBaseClass = 'header__toggle__btn';
    
    if (listingType === 'rent') {
      this.activateRent(buttonBaseClass, false); // false для запобігання циклічних викликів
    } else {
      this.activateSell(buttonBaseClass, false);
    }
  }

  private activateRent(buttonBaseClass: string, updateState: boolean = true): void {
    if (!this.rentButton || !this.sellButton || !this.container) return;

    this.rentButton.classList.remove(`${buttonBaseClass}${this.inactiveClass}`);
    this.rentButton.classList.add(`${buttonBaseClass}${this.activeClass}`);
    
    this.sellButton.classList.remove(`${buttonBaseClass}${this.activeClass}`);
    this.sellButton.classList.add(`${buttonBaseClass}${this.inactiveClass}`);
    
    this.container.classList.add('rent-active');
    this.container.classList.remove('sell-active');

    // Оновлюємо стан, якщо потрібно
    if (updateState) {
      this.stateManager.setValue('rent');
    }
  }

  private activateSell(buttonBaseClass: string, updateState: boolean = true): void {
    if (!this.rentButton || !this.sellButton || !this.container) return;

    this.sellButton.classList.remove(`${buttonBaseClass}${this.inactiveClass}`);
    this.sellButton.classList.add(`${buttonBaseClass}${this.activeClass}`);
    
    this.rentButton.classList.remove(`${buttonBaseClass}${this.activeClass}`);
    this.rentButton.classList.add(`${buttonBaseClass}${this.inactiveClass}`);
    
    this.container.classList.add('sell-active');
    this.container.classList.remove('rent-active');

    // Оновлюємо стан, якщо потрібно
    if (updateState) {
      this.stateManager.setValue('sell');
    }
  }
}