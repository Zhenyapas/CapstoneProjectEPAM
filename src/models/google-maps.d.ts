declare global {
    interface Window {
      google: typeof google;
      initMap: () => void;
    }
  
    namespace google {
      namespace maps {
        class Map {
          constructor(element: Element, options: MapOptions);
          panTo(latLng: LatLng | LatLngLiteral): void;
          setZoom(zoom: number): void;
        }
  
        class Marker {
          constructor(options: MarkerOptions);
          setPosition(latLng: LatLng | LatLngLiteral): void;
          setTitle(title: string): void;
          setAnimation(animation: Animation | null): void;
          setMap(map: Map | null): void;
        }
  
        interface MapOptions {
          center: LatLng | LatLngLiteral;
          zoom: number;
          styles?: MapTypeStyle[];
          mapTypeControl?: boolean;
          streetViewControl?: boolean;
          zoomControl?: boolean;
          fullscreenControl?: boolean;
        }
  
        interface LatLngLiteral {
          lat: number;
          lng: number;
        }
  
        interface LatLng {
          lat(): number;
          lng(): number;
        }
  
        interface MarkerOptions {
          position: LatLng | LatLngLiteral;
          map: Map | null;
          title?: string;
          animation?: Animation;
        }
  
        interface MapTypeStyle {
          featureType?: string;
          elementType?: string;
          stylers?: Array<{ [key: string]: string | number }>;
        }
  
        enum Animation {
          BOUNCE,
          DROP
        }
      }
    }
  }
  
  export {};