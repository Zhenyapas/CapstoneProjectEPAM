import { StateManager } from '../../services/StateManager';
import { City } from '../../models/types';
import { API_KEYS } from '../../config/api-keys';

interface Coordinates {
  lat: number;
  lng: number;
}

export class MapComponent {
  private mapElement: HTMLElement | null = null;
  private map: google.maps.Map | null = null;
  private marker: google.maps.Marker | null = null;
  private cityCoordinates: Record<string, Coordinates> = {
    'kyiv': { lat: 50.4501, lng: 30.5234 },
    'lviv': { lat: 49.8397, lng: 24.0297 },
    'odessa': { lat: 46.4825, lng: 30.7233 },
    'kharkiv': { lat: 49.9935, lng: 36.2304 }
  };

  constructor(
    mapElementSelector: string,
    private cityStateManager: StateManager<City>
  ) {
    this.mapElement = document.querySelector(mapElementSelector);
    
    if (!this.mapElement) {
      console.error(`Map element with selector "${mapElementSelector}" not found`);
      return;
    }

    // Підписуємося на зміни міста
    this.cityStateManager.subscribe(this.updateMap.bind(this));

    // Ініціалізуємо карту після завантаження API
    this.loadGoogleMapsAPI().then(() => {
      this.initMap();
      // Встановлюємо початкове місто
      this.updateMap(this.cityStateManager.getValue());
    });
  }

  private loadGoogleMapsAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Перевіряємо, чи вже завантажено API
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      // Створюємо callback для Google Maps API
      window.initMap = () => {
        resolve();
      };

      // Додаємо скрипт Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEYS.GOOGLE_MAPS}&callback=initMap&language=uk`;
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error('Google Maps failed to load'));
      document.head.appendChild(script);
    });
  }

  private initMap(): void {
    if (!this.mapElement) return;

    // Налаштування за замовчуванням (Київ)
    const defaultCity = this.cityStateManager.getValue();
    const defaultCoordinates = this.getCoordinatesForCity(defaultCity);

    this.map = new google.maps.Map(this.mapElement, {
      center: defaultCoordinates,
      zoom: 12,
      styles: this.getMapStyles(), // Кастомний стиль карти
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: true,
      fullscreenControl: true,
    });

    // Створюємо початковий маркер
    this.marker = new google.maps.Marker({
      position: defaultCoordinates,
      map: this.map,
      title: defaultCity.toUpperCase(),
      animation: google.maps.Animation.DROP
    });
  }

  private updateMap(city: City): void {
    if (!this.map || !this.marker) return;
    
    const coordinates = this.getCoordinatesForCity(city);

    // Плавно переміщуємо карту до нового міста
    this.map.panTo(coordinates);
    
    // Змінюємо зум відповідно до міста
    this.map.setZoom(12);

    // Оновлюємо маркер
    this.marker.setPosition(coordinates);
    this.marker.setTitle(city.toUpperCase());
    
    // Додаємо анімацію до маркера
    this.marker.setAnimation(google.maps.Animation.DROP);
  }

  private getCoordinatesForCity(city: City): Coordinates {
    // Повертаємо координати для міста або координати Києва за замовчуванням
    return this.cityCoordinates[city.toLowerCase()] || this.cityCoordinates['kyiv'];
  }

  // Кастомний стиль для Google Maps
  private getMapStyles(): google.maps.MapTypeStyle[] {
    return [
    {
      "featureType": "administrative.locality",
      "elementType": "labels",
      "stylers": [
        { "visibility": "off" }  // Повністю прибирає назви міст
      ]
    },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#dedede" }, { "lightness": 21 }]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }]
      }
    ];
  }
}