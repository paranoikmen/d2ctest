import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Title, Button, Text, Divider } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { cartStore } from '../stores/CartStore';

interface CartSummaryProps {
  onCheckout?: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = observer(({ onCheckout }) => {
  const { totalAmount, totalItems, isMinimumOrderMet } = cartStore;

  return (
    <Surface style={styles.card} elevation={1}>
      <View style={styles.content}>
        <Title>Ваша корзина</Title>
        <Divider style={styles.divider} />

        <View style={styles.row}>
          <Text>Товаров в корзине:</Text>
          <Text>{totalItems}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.total}>Итого:</Text>
          <Text style={styles.total}>{totalAmount} ₽</Text>
        </View>

        {!isMinimumOrderMet && (
          <Text style={styles.warning}>
            Минимальная сумма заказа: 1000 ₽. Добавьте товаров еще на {1000 - totalAmount} ₽
          </Text>
        )}
      </View>

      {onCheckout && (
        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={onCheckout}
            disabled={!isMinimumOrderMet || totalItems === 0}
          >
            Оформить заказ
          </Button>
        </View>
      )}
    </Surface>
  );
});

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  divider: {
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  total: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 8,
  },
  actions: {
    padding: 8,
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  warning: {
    color: 'red',
    marginTop: 8,
  },
});

export default CartSummary;
