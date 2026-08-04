export {};

type GoogleLatLng = { lat: () => number; lng: () => number };

export type GoogleMapInstance = {
  setCenter: (latlng: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  overlayMapTypes: { push: (mapType: unknown) => void };
};

export type GooglePolygonHandle = { setMap: (map: unknown) => void };

export type GoogleMapsNamespace = {
  Map: new (el: HTMLElement, options: Record<string, unknown>) => GoogleMapInstance;
  Polygon: new (options: Record<string, unknown>) => GooglePolygonHandle;
  ImageMapType: new (options: Record<string, unknown>) => unknown;
  Size: new (width: number, height: number) => unknown;
  event: {
    addListener: (
      target: unknown,
      eventName: string,
      handler: (e: { latLng: GoogleLatLng }) => void
    ) => void;
  };
};

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          elementId: string
        ) => unknown;
      };
      maps?: GoogleMapsNamespace;
    };
  }
}
