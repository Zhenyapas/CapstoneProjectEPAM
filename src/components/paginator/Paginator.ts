
export interface PaginatorOptions {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  }
  
  export class Paginator {
    private container: HTMLElement | null = null;
    private options: PaginatorOptions;
    private maxPagesToShow: number = 5; // Скільки сторінок показувати (не рахуючи "Previous" і "Next")
  
    constructor(containerSelector: string, options: PaginatorOptions) {
      this.container = document.querySelector(containerSelector);
      this.options = options;
  
      if (!this.container) {
        console.error(`Paginator container with selector "${containerSelector}" not found`);
        return;
      }
      
      this.setResponsiveSettings();
      this.render();
    }
  
    public updateOptions(options: Partial<PaginatorOptions>): void {
      this.options = { ...this.options, ...options };
      this.render();
    }


    private setResponsiveSettings(): void {
        // Змінюємо кількість сторінок на мобільних
        const updateMaxPages = () => {
          if (window.innerWidth <= 480) {
            this.maxPagesToShow = 3; // Менше сторінок на мобільних
          } else if (window.innerWidth <= 768) {
            this.maxPagesToShow = 4; // Дещо більше на планшетах
          } else {
            this.maxPagesToShow = 5; // Повний розмір на десктопах
          }
          this.render();
        };
      
        updateMaxPages();
      

        window.addEventListener('resize', updateMaxPages);
    }
  

    private render(): void {
    if (!this.container) return;
  
    this.container.innerHTML = '';
  
    const { totalItems, itemsPerPage, currentPage } = this.options;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    if (totalPages <= 1) {
      return;
    }
  
    const paginatorElement = document.createElement('div');
    paginatorElement.className = 'paginator';
  
    const prevButton = document.createElement('button');
    prevButton.className = 'paginator__button paginator__button--prev';
    prevButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    prevButton.disabled = currentPage <= 1;
    prevButton.setAttribute('aria-label', 'Попередня сторінка');
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        this.options.onPageChange(currentPage - 1);
      }
    });
    paginatorElement.appendChild(prevButton);
  
    const pages = this.calculateVisiblePages(currentPage, totalPages);
  
    const numbersContainer = document.createElement('div');
    numbersContainer.className = 'paginator__numbers';
    
    pages.forEach(page => {
      if (page === '...') {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'paginator__ellipsis';
        ellipsis.textContent = '...';
        numbersContainer.appendChild(ellipsis);
      } else {
        const pageButton = document.createElement('button');
        pageButton.className = `paginator__button paginator__button--number ${
          page === currentPage ? 'paginator__button--active' : ''
        }`;
        pageButton.textContent = page.toString();
        pageButton.addEventListener('click', () => {
          if (page !== currentPage) {
            this.options.onPageChange(page as number);
          }
        });
        numbersContainer.appendChild(pageButton);
      }
    });
    
    paginatorElement.appendChild(numbersContainer);
  
    const nextButton = document.createElement('button');
    nextButton.className = 'paginator__button paginator__button--next';
    nextButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    nextButton.disabled = currentPage >= totalPages;
    nextButton.setAttribute('aria-label', 'Наступна сторінка');
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        this.options.onPageChange(currentPage + 1);
      }
    });
    paginatorElement.appendChild(nextButton);
  
    this.container.appendChild(paginatorElement);
    }
  
    private calculateVisiblePages(currentPage: number, totalPages: number): (number | string)[] {
        const pages: (number | string)[] = [];
      
        if (totalPages <= this.maxPagesToShow) {
          for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          const halfVisible = Math.floor(this.maxPagesToShow / 2);
          
          let startPage = Math.max(1, currentPage - halfVisible);
          let endPage = Math.min(totalPages, startPage + this.maxPagesToShow - 1);
          

          if (endPage === totalPages) {
            startPage = Math.max(1, totalPages - this.maxPagesToShow + 1);
          }
          
          endPage = Math.min(totalPages, startPage + this.maxPagesToShow - 1);
      
          if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
              pages.push('...');
            }
          }
          
          for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
          }
          
          if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
              pages.push('...');
            }
            pages.push(totalPages);
          }
        }
        
        return pages;
    }

  }