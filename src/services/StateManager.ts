type Listener<T> = (value: T) => void;

export class StateManager<T> {
  private value: T;
  private listeners: Listener<T>[] = [];

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  getValue(): T {
    return this.value;
  }

  setValue(newValue: T): void {
    if (this.value !== newValue) {
      this.value = newValue;
      this.notifyListeners();
    }
  }

  subscribe(listener: Listener<T>): void {
    this.listeners.push(listener);
  }

  unsubscribe(listener: Listener<T>): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.value));
  }
}