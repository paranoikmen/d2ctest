import React, { useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Surface, Title, Paragraph, Button, Text } from 'react-native-paper';
import { Product } from '../models/Product';
import { observer } from 'mobx-react-lite';
import { cartStore } from '../stores/CartStore';

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = observer(({ product }) => {
  const { cartItems } = cartStore;
  const cartItem = cartItems.find(item => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = useCallback(() => {
    cartStore.addToCart(product);
  }, [product]);

  const handleRemoveFromCart = useCallback(() => {
    if (quantity > 0) {
      cartStore.updateQuantity(product.id, quantity - 1);
    }
  }, [product.id, quantity]);

  return (
    <Surface style={styles.card} elevation={1}>
      <View style={styles.cardHeader}>
        {product.image && (
          <Image source={{ uri: product.image }} style={styles.image} />
        )}
        <View style={styles.content}>
          <Title>{product.name}</Title>
          <Paragraph>{product.description}</Paragraph>
          <Paragraph>Количество товаров на складе: {product.available}</Paragraph>
          <Paragraph style={styles.price}>{product.price} ₽</Paragraph>
        </View>
      </View>
      <View style={styles.actions}>
        {quantity > 0 ? (
          <View style={styles.quantityContainer}>
            <Button onPress={handleRemoveFromCart}>-</Button>
            <Text style={styles.quantity}>{quantity}</Text>
            <Button onPress={handleAddToCart} disabled={quantity === product.available}>+</Button>
          </View>
        ) : (
          <Button mode="contained" onPress={handleAddToCart}>
            В корзину
          </Button>
        )}
      </View>
    </Surface>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 8,
  },
  actions: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
});

export default ProductItem;
