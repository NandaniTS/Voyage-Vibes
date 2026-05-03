declare global {
  interface Window {
    location: Location;
  }
  
  interface Location {
    href: string;
  }
  
  interface Storage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
  }
  
  const localStorage: Storage;
  const window: Window;
}

export {};
