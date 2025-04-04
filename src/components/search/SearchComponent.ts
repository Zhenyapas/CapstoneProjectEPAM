// components/search/SearchComponent.ts
import { StateManager } from '../../services/StateManager';
import { ListingType, PropertyType, City, PropertyItem } from '../../models/types';
import { getFilteredProperties } from '../../models/propertyData';

// export class SearchComponent {
//   private container: HTMLElement | null = null;
//   private input: HTMLInputElement | null = null;
//   private button: HTMLButtonElement | null = null;
//   private dropdown: HTMLElement | null = null;
//   private searchTimeout: number | null = null;
//   private selectedAddress: string | null = null;
//   private addressStateManager: StateManager<string | null>;

//   constructor(
//     containerSelector: string,
//     private listingTypeState: StateManager<ListingType>,
//     private propertyTypeState: StateManager<PropertyType>,
//     private cityState: StateManager<City>
//   ) {
//     this.container = document.querySelector(containerSelector);
//     this.addressStateManager = new StateManager<string | null>(null);
    
//     if (!this.container) {
//       console.error(`Search container with selector "${containerSelector}" not found`);
//       return;
//     }
    
//     this.initElements();
//     this.initEvents();
//   }
  
//   private initElements(): void {
//     if (!this.container) return;
    
//     this.input = this.container.querySelector('.search-placeholder');
//     this.button = this.container.querySelector('.search-button');
    
//     // Створюємо випадаючий список, якщо його ще немає
//     if (!this.dropdown) {
//       this.dropdown = document.createElement('div');
//       this.dropdown.className = 'search-dropdown';
//       this.dropdown.style.display = 'none';
//       this.container.appendChild(this.dropdown);
//     }
    
//     // Початково кнопка пошуку неактивна
//     if (this.button) {
//       this.button.disabled = true;
//     }
//   }
  
//   private initEvents(): void {
//     if (!this.input || !this.button) return;
    
//     // Подія при введенні тексту
//     this.input.addEventListener('input', this.handleInputChange.bind(this));
    
//     // Подія натискання кнопки пошуку
//     this.button.addEventListener('click', this.handleSearch.bind(this));
    
//     // Закриваємо випадаючий список при кліку поза ним
//     document.addEventListener('click', (e) => {
//       if (this.container && !this.container.contains(e.target as Node)) {
//         this.hideDropdown();
//       }
//     });
    
//     // Обробка кліку Enter у полі вводу
//     this.input.addEventListener('keydown', (e) => {
//       if (e.key === 'Enter' && this.button && !this.button.disabled) {
//         this.handleSearch();
//       }
//     });
//   }
  
//   private handleInputChange(): void {
//     if (!this.input || !this.dropdown) return;
    
//     const searchValue = this.input.value.trim();
    
//     // Скидаємо обрану адресу та деактивуємо кнопку
//     this.selectedAddress = null;
//     if (this.button) {
//       this.button.disabled = true;
//     }
    
//     // Якщо поле пусте, ховаємо випадаючий список
//     if (!searchValue) {
//       this.hideDropdown();
//       return;
//     }
    
//     // Показуємо випадаючий список з індикатором пошуку
//     this.showDropdown();
//     this.dropdown.innerHTML = '<div class="search-dropdown__searching">Searching...</div>';
    
//     // Затримка для імітації пошуку
//     if (this.searchTimeout) {
//       clearTimeout(this.searchTimeout);
//     }
    
//     this.searchTimeout = window.setTimeout(() => {
//       this.performSearch(searchValue);
//     }, 500); // Затримка 500мс
//   }
  
//   private performSearch(searchValue: string): void {
//     if (!this.dropdown) return;
    
//     // Отримуємо поточні фільтри
//     const listingType = this.listingTypeState.getValue();
//     const propertyType = this.propertyTypeState.getValue();
//     const city = this.cityState.getValue();
    
//     // Отримуємо відфільтровані об'єкти
//     const filteredItems = getFilteredProperties(listingType, propertyType, city);
    
//     // Фільтруємо адреси за пошуковим запитом
//     const matchingAddresses = filteredItems
//       .filter(item => item.address.toLowerCase().includes(searchValue.toLowerCase()))
//       .map(item => item.address);
    
//     // Виводимо результати в випадаючий список
//     if (matchingAddresses.length > 0) {
//       this.dropdown.innerHTML = matchingAddresses
//         .map(address => `<div class="search-dropdown__item">${address}</div>`)
//         .join('');
      
//       // Додаємо обробники подій для елементів списку
//       const items = this.dropdown.querySelectorAll('.search-dropdown__item');
//       items.forEach(item => {
//         item.addEventListener('click', () => {
//           this.selectAddress(item.textContent || '');
//         });
//       });
//     } else {
//       this.dropdown.innerHTML = '<div class="search-dropdown__empty">There are no options at this address</div>';
//     }
//   }
  
//   private selectAddress(address: string): void {
//     if (!this.input || !this.button) return;
    
//     this.selectedAddress = address;
//     this.input.value = address;
    
//     // Активуємо кнопку пошуку
//     this.button.disabled = false;
    
//     // Ховаємо випадаючий список
//     this.hideDropdown();
//   }
  
//   private handleSearch(): void {
//     if (!this.selectedAddress) return;
    
//     // Встановлюємо вибрану адресу в стан
//     this.addressStateManager.setValue(this.selectedAddress);
    
//     // Тут можна додати логіку для фільтрації об'єктів за адресою
//     console.log(`Searching for: ${this.selectedAddress}`);
//   }
  
//   private showDropdown(): void {
//     if (this.dropdown) {
//       this.dropdown.style.display = 'block';
//     }
//   }
  
//   private hideDropdown(): void {
//     if (this.dropdown) {
//       this.dropdown.style.display = 'none';
//     }
//   }
  
//   // Метод для отримання стану адреси
//   public getAddressState(): StateManager<string | null> {
//     return this.addressStateManager;
//   }
// }

// components/search/SearchComponent.ts

// export class SearchComponent {
//   private container: HTMLElement | null = null;
//   private input: HTMLInputElement | null = null;
//   private button: HTMLButtonElement | null = null;
//   private dropdown: HTMLElement | null = null;
//   private searchTimeout: number | null = null;
//   private selectedAddress: string | null = null;
//   private selectedStreet: string | null = null;
//   private isSearchingStreet: boolean = true; // Режим пошуку (вулиця/номер будинку)
//   private addressStateManager: StateManager<string | null>;

//   constructor(
//     containerSelector: string,
//     private listingTypeState: StateManager<ListingType>,
//     private propertyTypeState: StateManager<PropertyType>,
//     private cityState: StateManager<City>
//   ) {
//     this.container = document.querySelector(containerSelector);
//     this.addressStateManager = new StateManager<string | null>(null);
    
//     if (!this.container) {
//       console.error(`Search container with selector "${containerSelector}" not found`);
//       return;
//     }
    
//     this.initElements();
//     this.initEvents();
    
//     // Підписуємося на зміни інших фільтрів
//     this.listingTypeState.subscribe(this.resetSearch.bind(this));
//     this.propertyTypeState.subscribe(this.resetSearch.bind(this));
//     this.cityState.subscribe(this.resetSearch.bind(this));
//   }
  
//   private initElements(): void {
//     if (!this.container) return;
    
//     this.input = this.container.querySelector('.search-placeholder');
//     this.button = this.container.querySelector('.search-button');
    
//     // Створюємо випадаючий список, якщо його ще немає
//     if (!this.dropdown) {
//       this.dropdown = document.createElement('div');
//       this.dropdown.className = 'search-dropdown';
//       this.dropdown.style.display = 'none';
//       this.container.appendChild(this.dropdown);
//     }
    
//     // Початково кнопка пошуку неактивна
//     if (this.button) {
//       this.button.disabled = true;
//     }
//   }
  
//   private initEvents(): void {
//     if (!this.input || !this.button) return;
    
//     // Подія при введенні тексту
//     this.input.addEventListener('input', this.handleInputChange.bind(this));
    
//     // Подія натискання кнопки пошуку
//     this.button.addEventListener('click', this.handleSearch.bind(this));
    
//     // Закриваємо випадаючий список при кліку поза ним
//     document.addEventListener('click', (e) => {
//       if (this.container && !this.container.contains(e.target as Node)) {
//         this.hideDropdown();
//       }
//     });
    
//     // Обробка кліку Enter у полі вводу
//     this.input.addEventListener('keydown', (e) => {
//       if (e.key === 'Enter' && this.button && !this.button.disabled) {
//         this.handleSearch();
//       }
//     });
//   }
  
//   private handleInputChange(): void {
//     if (!this.input || !this.dropdown) return;
    
//     const searchValue = this.input.value.trim();
    
//     // Якщо вибрана вулиця і видалено текст, скидаємо вибір вулиці
//     if (this.selectedStreet && !searchValue.includes(this.selectedStreet)) {
//       this.resetStreetSelection();
//       return;
//     }
    
//     // Якщо вибрана вулиця, оновлюємо пошуковий запит для номерів будинків
//     if (this.selectedStreet && !this.isSearchingStreet) {
//       const streetPrefix = this.selectedStreet + ' ';
//       if (searchValue.startsWith(streetPrefix)) {
//         const buildingQuery = searchValue.substring(streetPrefix.length);
//         this.updateBuildingSearch(buildingQuery);
//         return;
//       }
//     }
    
//     // Скидаємо обрану адресу та деактивуємо кнопку
//     this.selectedAddress = null;
//     if (this.button) {
//       this.button.disabled = true;
//     }
    
//     // Якщо поле пусте, ховаємо випадаючий список і скидаємо фільтр
//     if (!searchValue) {
//       this.hideDropdown();
//       this.addressStateManager.setValue(null);
//       return;
//     }
    
//     // Показуємо випадаючий список з індикатором пошуку
//     this.showDropdown();
//     this.dropdown.innerHTML = '<div class="search-dropdown__searching">Searching...</div>';
    
//     // Затримка для імітації пошуку
//     if (this.searchTimeout) {
//       clearTimeout(this.searchTimeout);
//     }
    
//     this.searchTimeout = window.setTimeout(() => {
//       this.performSearch(searchValue);
//     }, 500); // Затримка 500мс
//   }
  
//   private updateBuildingSearch(query: string): void {
//     // Викликаємо пошук адрес на вулиці з запитом для номера будинку
//     if (this.searchTimeout) {
//       clearTimeout(this.searchTimeout);
//     }
    
//     // Показуємо випадаючий список з індикатором пошуку
//     this.showDropdown();
//     if (this.dropdown) {
//       this.dropdown.innerHTML = '<div class="search-dropdown__searching">Searching...</div>';
//     }
    
//     this.searchTimeout = window.setTimeout(() => {
//       if (this.selectedStreet) {
//         const fullQuery = this.selectedStreet + ' ' + query;
//         this.performSearch(fullQuery);
//       }
//     }, 500);
//   }
  
//   private performSearch(searchValue: string): void {
//     if (!this.dropdown) return;
    
//     // Отримуємо поточні фільтри
//     const listingType = this.listingTypeState.getValue();
//     const propertyType = this.propertyTypeState.getValue();
//     const city = this.cityState.getValue();
    
//     // Отримуємо відфільтровані об'єкти
//     const filteredItems = getFilteredProperties(listingType, propertyType, city);
    
//     // Якщо вулицю ще не вибрано, шукаємо вулиці
//     if (this.isSearchingStreet) {
//       this.searchStreets(filteredItems, searchValue);
//     } else {
//       // Інакше шукаємо конкретні адреси на вибраній вулиці
//       this.searchAddressesOnStreet(filteredItems, searchValue);
//     }
//   }
  
// private searchStreets(items: PropertyItem[], searchValue: string): void {
//   if (!this.dropdown) return;
  
//   // Отримуємо унікальні назви вулиць
//   const streets = new Set<string>();
  
//   items.forEach(item => {
//     // Використовуємо поле street замість extractStreetName
//     if (item.street.toLowerCase().includes(searchValue.toLowerCase())) {
//       streets.add(item.street);
//     }
//   });
    
//     // Перетворюємо Set на масив і сортуємо
//     const sortedStreets = Array.from(streets).sort();
    
//     // Виводимо результати в випадаючий список
//     if (sortedStreets.length > 0) {
//       this.dropdown.innerHTML = sortedStreets
//         .map(street => `<div class="search-dropdown__item search-dropdown__item--street">${street}</div>`)
//         .join('');
      
//       // Додаємо обробники подій для вибору вулиці
//       const streetItems = this.dropdown.querySelectorAll('.search-dropdown__item--street');
//       streetItems.forEach(item => {
//         item.addEventListener('click', () => {
//           this.selectStreet(item.textContent || '');
//         });
//       });
//     } else {
//       this.dropdown.innerHTML = '<div class="search-dropdown__empty">No streets found</div>';
//     }
//   }
  
//   private searchAddressesOnStreet(items: PropertyItem[], searchValue: string): void {
//     if (!this.dropdown || !this.selectedStreet) return;
    
//     // Фільтруємо адреси, які містять вибрану вулицю та пошуковий запит
//     const matchingAddresses = items
//       .filter(item => {
//         const hasStreet = item.address.includes(this.selectedStreet!);
//         const matchesSearch = searchValue ? 
//           item.address.toLowerCase().includes(searchValue.toLowerCase()) : 
//           true;
//         return hasStreet && matchesSearch;
//       })
//       .map(item => item.address);
    
//     // Виводимо результати в випадаючий список
//     if (matchingAddresses.length > 0) {
//       this.dropdown.innerHTML = matchingAddresses
//         .map(address => `<div class="search-dropdown__item">${address}</div>`)
//         .join('');
      
//       // Додаємо можливість повернутися до пошуку вулиць
//       this.dropdown.innerHTML = `
//         <div class="search-dropdown__back">← Back to street search</div>
//         ${this.dropdown.innerHTML}
//       `;
      
//       // Додаємо обробник для кнопки "назад"
//       const backButton = this.dropdown.querySelector('.search-dropdown__back');
//       if (backButton) {
//         backButton.addEventListener('click', () => {
//           this.resetStreetSelection();
//         });
//       }
      
//       // Додаємо обробники подій для елементів списку
//       const items = this.dropdown.querySelectorAll('.search-dropdown__item');
//       items.forEach(item => {
//         item.addEventListener('click', () => {
//           this.selectAddress(item.textContent || '');
//         });
//       });
//     } else {
//       this.dropdown.innerHTML = `
//         <div class="search-dropdown__back">← Back to street search</div>
//         <div class="search-dropdown__empty">No addresses found on this street</div>
//       `;
      
//       // Додаємо обробник для кнопки "назад"
//       const backButton = this.dropdown.querySelector('.search-dropdown__back');
//       if (backButton) {
//         backButton.addEventListener('click', () => {
//           this.resetStreetSelection();
//         });
//       }
//     }
//   }
  
//   private selectStreet(street: string): void {
//     if (!this.input) return;
    
//     this.selectedStreet = street;
//     this.isSearchingStreet = false;
//     this.input.value = street + ' '; // Додаємо пробіл, щоб користувач міг продовжити вводити номер
    
//     // Переміщуємо курсор в кінець рядка
//     this.input.focus();
//     this.input.selectionStart = this.input.value.length;
//     this.input.selectionEnd = this.input.value.length;
    
//     // Виконуємо пошук адрес на вибраній вулиці
//     this.performSearch(this.input.value);
//   }
  
//   private selectAddress(address: string): void {
//     if (!this.input || !this.button) return;
    
//     this.selectedAddress = address;
//     this.input.value = address;
    
//     // Активуємо кнопку пошуку
//     this.button.disabled = false;
    
//     // Ховаємо випадаючий список
//     this.hideDropdown();
//   }
  
//   private resetStreetSelection(): void {
//     if (!this.input) return;
    
//     this.selectedStreet = null;
//     this.isSearchingStreet = true;
    
//     // Очищаємо поле вводу
//     this.input.value = '';
    
//     // Деактивуємо кнопку пошуку
//     if (this.button) {
//       this.button.disabled = true;
//     }
    
//     // Ховаємо випадаючий список, а потім показуємо знову для пошуку вулиць
//     this.hideDropdown();
//     this.handleInputChange();
//   }
  
//   private handleSearch(): void {
//     if (!this.selectedAddress) return;
    
//     // Встановлюємо вибрану адресу в стан
//     this.addressStateManager.setValue(this.selectedAddress);
    
//     // Тут можна додати логіку для фільтрації об'єктів за адресою
//     console.log(`Searching for: ${this.selectedAddress}`);
//   }
  
//   private showDropdown(): void {
//     if (this.dropdown) {
//       this.dropdown.style.display = 'block';
//     }
//   }
  
//   private hideDropdown(): void {
//     if (this.dropdown) {
//       this.dropdown.style.display = 'none';
//     }
//   }
  
//   // Метод для скидання пошуку при зміні інших фільтрів
//   private resetSearch(): void {
//     if (!this.input) return;
    
//     // Очищаємо поле вводу
//     this.input.value = '';
//     this.selectedAddress = null;
//     this.selectedStreet = null;
//     this.isSearchingStreet = true;
    
//     // Деактивуємо кнопку пошуку
//     if (this.button) {
//       this.button.disabled = true;
//     }
    
//     // Ховаємо випадаючий список
//     this.hideDropdown();
    
//     // Скидаємо стан адреси
//     this.addressStateManager.setValue(null);
//   }
  
//   // Метод для очищення пошуку
//   private clearSearch(): void {
//     if (!this.input) return;
    
//     this.input.value = '';
//     this.selectedAddress = null;
//     this.selectedStreet = null;
//     this.isSearchingStreet = true;
    
//     if (this.button) {
//       this.button.disabled = true;
//     }
    
//     // Скидаємо стан адреси
//     this.addressStateManager.setValue(null);
//     this.hideDropdown();
//   }
  
//   // Допоміжний метод для вилучення назви вулиці з адреси
//   private extractStreetName(address: string): string {
//     // Спрощена логіка вилучення назви вулиці
//     // Припускаємо, що формат адреси: "Назва вулиці, Номер будинку, ..."
//     const parts = address.split(',');
//     if (parts.length > 0) {
//       return parts[0].trim();
//     }
//     return address;
//   }
  
//   // Метод для отримання стану адреси
//   public getAddressState(): StateManager<string | null> {
//     return this.addressStateManager;
//   }
// }

// components/search/SearchComponent.ts


export class SearchComponent {
  private container: HTMLElement | null = null;
  private input: HTMLInputElement | null = null;
  private button: HTMLButtonElement | null = null;
  private dropdown: HTMLElement | null = null;
  private searchTimeout: number | null = null;
  private selectedAddress: string | null = null;
  private selectedStreet: string | null = null;
  private isSearchingStreet: boolean = true; // Режим пошуку (вулиця/номер будинку)
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
    
    // Підписуємося на зміни інших фільтрів
    this.listingTypeState.subscribe(this.resetSearch.bind(this));
    this.propertyTypeState.subscribe(this.resetSearch.bind(this));
    this.cityState.subscribe(this.resetSearch.bind(this));
  }
  
  private initElements(): void {
    if (!this.container) return;
    
    this.input = this.container.querySelector('.search-placeholder');
    this.button = this.container.querySelector('.search-button');
    
    // Створюємо випадаючий список, якщо його ще немає
    if (!this.dropdown) {
      this.dropdown = document.createElement('div');
      this.dropdown.className = 'search-dropdown';
      this.dropdown.style.display = 'none';
      this.container.appendChild(this.dropdown);
    }
    
    // Початково кнопка пошуку неактивна
    if (this.button) {
      this.button.disabled = true;
    }
  }
  
  private initEvents(): void {
    if (!this.input || !this.button) return;
    
    // Подія при введенні тексту
    this.input.addEventListener('input', this.handleInputChange.bind(this));
    
    // Подія натискання кнопки пошуку
    this.button.addEventListener('click', this.handleSearch.bind(this));
    
    // Закриваємо випадаючий список при кліку поза ним
    document.addEventListener('click', (e) => {
      if (this.container && !this.container.contains(e.target as Node)) {
        this.hideDropdown();
      }
    });
    
    // Обробка кліку Enter у полі вводу
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.button && !this.button.disabled) {
        this.handleSearch();
      }
    });
  }
  
  private handleInputChange(): void {
    if (!this.input || !this.dropdown) return;
    
    const searchValue = this.input.value.trim();
    
    // Якщо вибрана вулиця і текст змінився, але все ще містить вулицю
    if (this.selectedStreet && searchValue.includes(this.selectedStreet)) {
      // Ми вводимо номер або щось після вибору вулиці - зберігаємо вулицю активною
      this.updateBuildingSearch(searchValue);
      return;
    }
    
    // Якщо вибрана вулиця, але її більше немає в полі вводу, скидаємо вибір
    if (this.selectedStreet && !searchValue.includes(this.selectedStreet)) {
      this.resetStreetSelection();
      return;
    }
    
    // Скидаємо обрану адресу та деактивуємо кнопку, якщо немає вулиці
    this.selectedAddress = null;
    if (this.button && !this.selectedStreet) {
      this.button.disabled = true;
    }
    
    // Якщо поле пусте, ховаємо випадаючий список і скидаємо фільтр
    if (!searchValue) {
      this.hideDropdown();
      this.addressStateManager.setValue(null);
      return;
    }
    
    // Показуємо випадаючий список з індикатором пошуку
    this.showDropdown();
    this.dropdown.innerHTML = '<div class="search-dropdown__searching">Searching...</div>';
    
    // Затримка для імітації пошуку
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    this.searchTimeout = window.setTimeout(() => {
      this.performSearch(searchValue);
    }, 500); // Затримка 500мс
  }
  
  private updateBuildingSearch(query: string): void {
    // Викликаємо пошук адрес на вулиці з запитом для номера будинку
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // Показуємо випадаючий список з індикатором пошуку
    this.showDropdown();
    if (this.dropdown) {
      this.dropdown.innerHTML = '<div class="search-dropdown__searching">Searching...</div>';
    }
    
    this.searchTimeout = window.setTimeout(() => {
      if (this.selectedStreet) {
        this.performSearch(query);
      }
    }, 500);
  }
  
  private performSearch(searchValue: string): void {
    if (!this.dropdown) return;
    
    // Отримуємо поточні фільтри
    const listingType = this.listingTypeState.getValue();
    const propertyType = this.propertyTypeState.getValue();
    const city = this.cityState.getValue();
    
    // Отримуємо відфільтровані об'єкти
    const filteredItems = getFilteredProperties(listingType, propertyType, city);
    
    // Якщо вулицю ще не вибрано, шукаємо вулиці
    if (this.isSearchingStreet) {
      this.searchStreets(filteredItems, searchValue);
    } else {
      // Інакше шукаємо конкретні адреси на вибраній вулиці
      this.searchAddressesOnStreet(filteredItems, searchValue);
    }
  }
  
  private searchStreets(items: PropertyItem[], searchValue: string): void {
    if (!this.dropdown) return;
    
    // Отримуємо унікальні назви вулиць
    const streets = new Set<string>();
    
    items.forEach(item => {
      // Використовуємо поле street для пошуку
      if (item.street.toLowerCase().includes(searchValue.toLowerCase())) {
        streets.add(item.street);
      }
    });
    
    // Перетворюємо Set на масив і сортуємо
    const sortedStreets = Array.from(streets).sort();
    
    // Виводимо результати в випадаючий список
    if (sortedStreets.length > 0) {
      this.dropdown.innerHTML = sortedStreets
        .map(street => `<div class="search-dropdown__item search-dropdown__item--street">${street}</div>`)
        .join('');
      
      // Додаємо обробники подій для вибору вулиці
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
    
    // Визначаємо частину пошукового рядка, яка йде після назви вулиці
    const streetPrefix = this.selectedStreet + ' ';
    let buildingNumber = '';
    
    if (searchValue.startsWith(streetPrefix)) {
      buildingNumber = searchValue.substring(streetPrefix.length).trim();
    }
    
    // Фільтруємо адреси, які містять вибрану вулицю та номер (якщо введено)
    const matchingAddresses = items.filter(item => {
      // Перевіряємо, чи містить адреса вибрану вулицю
      const hasStreet = item.street === this.selectedStreet;
      
      // Якщо номер будинку не введено, показуємо всі адреси з цією вулицею
      if (!buildingNumber) {
        return hasStreet;
      }
      
      // Якщо номер введено, шукаємо його в адресі
      // Витягуємо номер будинку з адреси (приймаємо, що це перші цифри в рядку або після коми)
      const addressParts = item.address.split(',');
      let foundNumber = false;
      
      for (const part of addressParts) {
        const trimmedPart = part.trim();
        
        // Шукаємо номер на початку частини адреси
        const numberAtStart = trimmedPart.match(/^(\d+)/);
        if (numberAtStart && numberAtStart[1].includes(buildingNumber)) {
          foundNumber = true;
          break;
        }
        
        // Шукаємо номер в кінці частини адреси
        const numberAtEnd = trimmedPart.match(/(\d+)$/);
        if (numberAtEnd && numberAtEnd[1].includes(buildingNumber)) {
          foundNumber = true;
          break;
        }
        
        // Шукаємо номер як окрему частину
        if (trimmedPart.includes(buildingNumber)) {
          foundNumber = true;
          break;
        }
      }
      
      return hasStreet && foundNumber;
    }).map(item => item.address);
    
    // Виводимо результати в випадаючий список
    if (matchingAddresses.length > 0) {
      this.dropdown.innerHTML = matchingAddresses
        .map(address => `<div class="search-dropdown__item">${address}</div>`)
        .join('');
      
      // Додаємо можливість повернутися до пошуку вулиць
      this.dropdown.innerHTML = `
        <div class="search-dropdown__back">← Back to street search</div>
        ${this.dropdown.innerHTML}
      `;
      
      // Додаємо обробник для кнопки "назад"
      const backButton = this.dropdown.querySelector('.search-dropdown__back');
      if (backButton) {
        backButton.addEventListener('click', () => {
          this.resetStreetSelection();
        });
      }
      
      // Додаємо обробники подій для елементів списку
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
      
      // Додаємо обробник для кнопки "назад"
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
    this.input.value = street + ' '; // Додаємо пробіл, щоб користувач міг продовжити вводити номер
    
    // Активуємо кнопку пошуку, оскільки вулиця вже вибрана
    if (this.button) {
      this.button.disabled = false;
    }
    
    // Переміщуємо курсор в кінець рядка
    this.input.focus();
    this.input.selectionStart = this.input.value.length;
    this.input.selectionEnd = this.input.value.length;
    
    // Виконуємо пошук адрес на вибраній вулиці
    this.performSearch(this.input.value);
  }
  
  private selectAddress(address: string): void {
    if (!this.input || !this.button) return;
    
    this.selectedAddress = address;
    this.input.value = address;
    
    // Активуємо кнопку пошуку
    this.button.disabled = false;
    
    // Ховаємо випадаючий список
    this.hideDropdown();
  }
  
  private resetStreetSelection(): void {
    if (!this.input) return;
    
    this.selectedStreet = null;
    this.isSearchingStreet = true;
    
    // Очищаємо поле вводу
    this.input.value = '';
    
    // Деактивуємо кнопку пошуку
    if (this.button) {
      this.button.disabled = true;
    }
    
    // Ховаємо випадаючий список, а потім показуємо знову для пошуку вулиць
    this.hideDropdown();
    this.handleInputChange();
  }
  
  private handleSearch(): void {
    // Якщо у нас є конкретна адреса, використовуємо її
    if (this.selectedAddress) {
      this.addressStateManager.setValue(this.selectedAddress);
      console.log(`Searching for address: ${this.selectedAddress}`);
    } 
    // Якщо є тільки вулиця, використовуємо її
    else if (this.selectedStreet) {
      // Створюємо фільтр за вулицею
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
  
  // Метод для скидання пошуку при зміні інших фільтрів
  private resetSearch(): void {
    if (!this.input) return;
    
    // Очищаємо поле вводу
    this.input.value = '';
    this.selectedAddress = null;
    this.selectedStreet = null;
    this.isSearchingStreet = true;
    
    // Деактивуємо кнопку пошуку
    if (this.button) {
      this.button.disabled = true;
    }
    
    // Ховаємо випадаючий список
    this.hideDropdown();
    
    // Скидаємо стан адреси
    this.addressStateManager.setValue(null);
  }
  
  // Метод для очищення пошуку
  private clearSearch(): void {
    if (!this.input) return;
    
    this.input.value = '';
    this.selectedAddress = null;
    this.selectedStreet = null;
    this.isSearchingStreet = true;
    
    if (this.button) {
      this.button.disabled = true;
    }
    
    // Скидаємо стан адреси
    this.addressStateManager.setValue(null);
    this.hideDropdown();
  }
  
  // Метод для отримання стану адреси
  public getAddressState(): StateManager<string | null> {
    return this.addressStateManager;
  }
}
