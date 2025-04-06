import { StateManager } from '../../services/StateManager';
import { ListingType } from '../../models/types';

export class HeaderToggleComponent {
  private rentButton: HTMLButtonElement | null = null;
  private saleButton: HTMLButtonElement | null = null;
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
      this.saleButton = this.container.querySelector('button:last-child');
      this.init();
    } else {
      console.error(`Header toggle container "${containerSelector}" not found`);
    }
  }

  private init(): void {
    if (!this.container || !this.rentButton || !this.saleButton) {
      console.error('Header toggle components not found');
      return;
    }

    const buttonBaseClass = 'header__toggle__btn';
    
    if (this.saleButton.classList.contains(`${buttonBaseClass}${this.activeClass}`)) {
      this.container.classList.add('sale-active');
      this.stateManager.setValue('sale');
    } else {
      this.container.classList.add('rent-active');
      this.stateManager.setValue('rent');
    }

    this.rentButton.addEventListener('click', () => this.activateRent(buttonBaseClass));
    this.saleButton.addEventListener('click', () => this.activateSale(buttonBaseClass));
    
    this.stateManager.subscribe(this.handleStateChange.bind(this));
  }

  private handleStateChange(listingType: ListingType): void {
    const buttonBaseClass = 'header__toggle__btn';
    
    if (listingType === 'rent') {
      this.activateRent(buttonBaseClass, false);
    } else {
      this.activateSale(buttonBaseClass, false);
    }
  }

  private activateRent(buttonBaseClass: string, updateState: boolean = true): void {
    if (!this.rentButton || !this.saleButton || !this.container) return;

    this.rentButton.classList.remove(`${buttonBaseClass}${this.inactiveClass}`);
    this.rentButton.classList.add(`${buttonBaseClass}${this.activeClass}`);
    
    this.saleButton.classList.remove(`${buttonBaseClass}${this.activeClass}`);
    this.saleButton.classList.add(`${buttonBaseClass}${this.inactiveClass}`);
    
    this.container.classList.add('rent-active');
    this.container.classList.remove('sale-active');

    if (updateState) {
      this.stateManager.setValue('rent');
    }
  }

  private activateSale(buttonBaseClass: string, updateState: boolean = true): void {
    if (!this.rentButton || !this.saleButton || !this.container) return;

    this.saleButton.classList.remove(`${buttonBaseClass}${this.inactiveClass}`);
    this.saleButton.classList.add(`${buttonBaseClass}${this.activeClass}`);
    
    this.rentButton.classList.remove(`${buttonBaseClass}${this.activeClass}`);
    this.rentButton.classList.add(`${buttonBaseClass}${this.inactiveClass}`);
    
    this.container.classList.add('sale-active');
    this.container.classList.remove('rent-active');

    if (updateState) {
      this.stateManager.setValue('sale');
    }
  }
}