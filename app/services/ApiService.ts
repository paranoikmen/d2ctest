import { AnalyticsEvent, Order, Product } from '../models/Product';

// Генерация тестовых данных
export const generateProducts = (count: number = 1000): Product[] => {
  const products: Product[] = [];
  const categories = ['Продукты', 'Электроника', 'Одежда', 'Мебель', 'Книги'];

  for (let i = 1; i <= count; i++) {
    products.push({
      id: i,
      name: `Товар ${i}`,
      price: Math.floor(Math.random() * 1000) + 100, // От 100 до 1100 рублей
      description: `Описание товара ${i} из категории ${categories[i % categories.length]}`,
      available: Math.floor(Math.random() * 20) + 1, // От 1 до 20 штук на складе
      image: `https://picsum.photos/id/${(i % 1000) + 1}/150/150`, // Используем picsum.photos вместо placeholder
    });
  }

  return products;
};

// Имитация отправки заказа на сервер
export const submitOrder = async (order: Order): Promise<{ success: boolean; error?: string }> => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Случайные ошибки с вероятностью 30%
  const randomError = Math.random();

  if (randomError < 0.1) {
    return {
      success: false,
      error: 'SERVER_UNAVAILABLE',
    };
  }

  if (order.totalAmount < 1000) {
    return {
      success: false,
      error: 'MINIMUM_AMOUNT_NOT_REACHED',
    };
  }

  // Успешная отправка
  return { success: true };
};

// Имитация отправки аналитики
export const sendAnalyticsEvent = async (event: AnalyticsEvent): Promise<boolean> => {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 500));

  // 15% вероятность ошибки
  if (Math.random() < 0.15) {
    return false;
  }

  return true;
};
