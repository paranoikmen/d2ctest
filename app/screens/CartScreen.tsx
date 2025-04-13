import React from 'react';
import { StyleSheet, View, FlatList, ScrollView, Alert } from 'react-native';
import { Appbar, Surface, Title, Paragraph, Button, Text } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { cartStore } from '../stores/CartStore';
import { CartItem } from '../models/Product';
import CartSummary from '../components/CartSummary';
import OrderOptions from '../components/OrderOptions';
import { useNavigation } from '@react-navigation/native';

const CartScreen = observer(() => {
  const navigation = useNavigation();
  const { cartItems, error } = cartStore;

  const handleBackToProducts = () => {
    navigation.goBack();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Корзина пуста', 'Добавьте товары в корзину');
      return;
    }

    navigation.navigate('Checkout' as never);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <Surface style={styles.card} elevation={1}>
      <View style={styles.content}>
        <Title>{item.product.name}</Title>
        <Paragraph>{item.product.description}</Paragraph>
        <View style={styles.priceRow}>
          <Text>{item.quantity} x {item.product.price} ₽</Text>
          <Text style={styles.price}>{item.quantity * item.product.price} ₽</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Button onPress={() => cartStore.updateQuantity(item.product.id, item.quantity - 1)}>-</Button>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <Button onPress={() => cartStore.addToCart(item.product)}>+</Button>
        <Button
          icon="delete"
          onPress={() => cartStore.removeFromCart(item.product.id)}
        >
          Удалить
        </Button>
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackToProducts} />
        <Appbar.Content title="Корзина" />
        <Appbar.Action icon="cart-remove" onPress={() => cartStore.clearCart()} />
      </Appbar.Header>

      {error && (
        <Surface style={styles.errorCard} elevation={1}>
          <View style={styles.content}>
            <Paragraph style={styles.errorText}>{error}</Paragraph>
          </View>
        </Surface>
      )}

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Корзина пуста</Text>
          <Button mode="contained" onPress={handleBackToProducts}>
            Перейти к покупкам
          </Button>
        </View>
      ) : (
        <ScrollView>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.product.id.toString()}
            scrollEnabled={false}
          />

          <OrderOptions />

          <CartSummary onCheckout={handleCheckout} />
        </ScrollView>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontWeight: 'bold',
  },
  actions: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  quantity: {
    marginHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
  },
  errorCard: {
    margin: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  errorText: {
    color: 'red',
  },
});

export default CartScreen;
