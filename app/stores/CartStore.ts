import { makeAutoObservable, runInAction } from 'mobx';
import { AnalyticsEvent, CartItem, OrderOption, Product } from '../models/Product';
import { generateProducts, sendAnalyticsEvent, submitOrder } from '../services/ApiService';

class CartStore {
  products: Product[] = [];
  cartItems: CartItem[] = [];
  orderOptions: OrderOption[] = [
    { id: 'leave_at_door', name: 'Оставить у двери', selected: false },
    { id: 'call_on_delivery', name: 'Позвонить при доставке', selected: false },
    { id: 'contactless', name: 'Бесконтактная доставка', selected: false },
    { id: 'dont_ring', name: 'Не звонить в дверь', selected: false },
  ];
  analyticsEvents: AnalyticsEvent[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadProducts();
  }

  get totalAmount(): number {
    return this.cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
  }

  get selectedOptions(): OrderOption[] {
    return this.orderOptions.filter(option => option.selected);
  }

  get totalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  get isMinimumOrderMet(): boolean {
    return this.totalAmount >= 1000;
  }

  async loadProducts() {
    this.isLoading = true;
    this.error = null;

    try {
      // Имитируем загрузку с сервера
      await new Promise(resolve => setTimeout(resolve, 500));
      const products = generateProducts(1000);

      runInAction(() => {
        this.products = products;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Ошибка загрузки товаров';
        this.isLoading = false;
      });
    }
  }

  addToCart(product: Product, quantity: number = 1) {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }

    this.sendAnalyticsEvent('CART_UPDATED');
  }

  removeFromCart(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.sendAnalyticsEvent('CART_UPDATED');
  }

  updateQuantity(productId: number, quantity: number) {
    const item = this.cartItems.find(item => item.product.id === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.sendAnalyticsEvent('CART_UPDATED');
      }
    }
  }

  toggleOption(optionId: string) {
    const option = this.orderOptions.find(option => option.id === optionId);

    if (option) {
      option.selected = !option.selected;
      this.sendAnalyticsEvent('CART_UPDATED');
    }
  }

  async sendAnalyticsEvent(type: 'CART_UPDATED' | 'ORDER_SUBMITTED') {
    const event: AnalyticsEvent = {
      type,
      items: [...this.cartItems],
      options: this.orderOptions.filter(option => option.selected),
      timestamp: Date.now(),
    };

    try {
      const success = await sendAnalyticsEvent(event);

      runInAction(() => {
        event.status = success ? 'SENT' : 'FAILED';
        this.analyticsEvents.push(event);
      });

      return success;
    } catch (error) {
      runInAction(() => {
        event.status = 'FAILED';
        this.analyticsEvents.push(event);
      });

      return false;
    }
  }

  async submitOrder() {
    if (this.cartItems.length === 0) {
      this.error = 'Корзина пуста';
      return { success: false, error: 'Корзина пуста' };
    }

    if (!this.isMinimumOrderMet) {
      this.error = 'Минимальная сумма заказа 1000 рублей';
      return { success: false, error: 'Минимальная сумма заказа 1000 рублей' };
    }

    this.isLoading = true;
    this.error = null;

    try {
      const result = await submitOrder({
        items: this.cartItems,
        options: this.selectedOptions,
        totalAmount: this.totalAmount,
      });

      await this.sendAnalyticsEvent('ORDER_SUBMITTED');

      runInAction(() => {
        this.isLoading = false;

        if (result.success) {
          // Успешный заказ - очищаем корзину
          this.cartItems = [];
          this.orderOptions.forEach(option => option.selected = false);
        } else {
          this.error = this.translateError(result.error || 'Неизвестная ошибка');
        }
      });

      return result;
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.error = 'Ошибка при отправке заказа';
      });

      return { success: false, error: 'Ошибка при отправке заказа' };
    }
  }

  clearCart() {
    this.cartItems = [];
    this.orderOptions.forEach(option => option.selected = false);
  }

  translateError(errorCode: string): string {
    if (errorCode === 'SERVER_UNAVAILABLE') {
      return 'Сервис временно недоступен. Пожалуйста, попробуйте позже.';
    } else if (errorCode === 'MINIMUM_AMOUNT_NOT_REACHED') {
      return 'Минимальная сумма заказа 1000 рублей';
    }

    return 'Произошла ошибка при обработке заказа';
  }
}

export const cartStore = new CartStore();
