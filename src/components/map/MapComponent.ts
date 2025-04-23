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
  private activeMarker: google.maps.Marker | null = null;
  private cityCoordinates: Record<string, Coordinates> = {
    'kyiv': { lat: 50.4501, lng: 30.5234 },
    'lviv': { lat: 49.8397, lng: 24.0297 },
    'odessa': { lat: 46.4825, lng: 30.7233 },
    'kharkiv': { lat: 49.9935, lng: 36.2304 }
  };
  private tempMarker: google.maps.Marker | null = null;

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

  public showPropertyMarker(coordinates: { lat: number; lng: number }, title: string): void {
    if (!this.map) return;
    
    // Видаляємо попередній тимчасовий маркер, якщо він є
    if (this.tempMarker) {
      this.tempMarker.setMap(null);
      this.tempMarker = null;
    }

    if (this.activeMarker) {
      this.activeMarker.setMap(null);
      this.activeMarker = null;
    }
    
    // Створюємо новий тимчасовий маркер
    this.tempMarker = new google.maps.Marker({
      position: coordinates,
      map: this.map,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: {
        url: 'img/Pin.svg', 
        scaledSize: new google.maps.Size(60, 60), 
        origin: new google.maps.Point(0, 0), 
        anchor: new google.maps.Point(20, 40) 
      }
    });
    
    this.map.panTo(coordinates);
  }
  

  public hidePropertyMarker(): void {
    if (this.tempMarker) {
      this.tempMarker.setMap(null);
      this.tempMarker = null;
    }
    
    if (this.map) {
      const cityCoordinates = this.getCoordinatesForCity(this.cityStateManager.getValue());
      this.map.panTo(cityCoordinates);
    }
  }

  public clearAllMarkers(): void {
    if (this.tempMarker) {
      this.tempMarker.setMap(null);
      this.tempMarker = null;
    }
    
    if (this.activeMarker) {
      this.activeMarker.setMap(null);
      this.activeMarker = null;
    }
    
    if (this.map) {
      const cityCoordinates = this.getCoordinatesForCity(this.cityStateManager.getValue());
      this.map.panTo(cityCoordinates);
    }
  }

  private loadGoogleMapsAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      window.initMap = () => {
        resolve();
      };


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

    const defaultCity = this.cityStateManager.getValue();
    const defaultCoordinates = this.getCoordinatesForCity(defaultCity);

    this.map = new google.maps.Map(this.mapElement, {
      center: defaultCoordinates,
      zoom: 15,
      styles: this.getMapStyles(), 
      mapTypeControl: false,
      streetViewControl: false,
      zoomControl: true,
      fullscreenControl: true,
    });

  }

  private updateMap(city: City): void {
    if (!this.map || !this.marker) return;
    
    const coordinates = this.getCoordinatesForCity(city);

    this.map.panTo(coordinates);
    
    this.map.setZoom(12);

  }

  private getCoordinatesForCity(city: City): Coordinates {
    return this.cityCoordinates[city.toLowerCase()] || this.cityCoordinates['kyiv'];
  }

  private getMapStyles(): google.maps.MapTypeStyle[] {
    return [
    {
      "featureType": "administrative.locality",
      "elementType": "labels",
      "stylers": [
        { "visibility": "off" } 
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