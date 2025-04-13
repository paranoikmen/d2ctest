import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Appbar, Surface, Title, Paragraph, Button, Divider, Text } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { cartStore } from '../stores/CartStore';
import { useNavigation } from '@react-navigation/native';

const CheckoutScreen = observer(() => {
  const navigation = useNavigation();
  const { cartItems, totalAmount, selectedOptions, isLoading, error } = cartStore;
  const [submitting, setSubmitting] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConfirmOrder = async () => {
    setSubmitting(true);

    try {
      const result = await cartStore.submitOrder();

      if (result.success) {
        Alert.alert(
          'Заказ оформлен',
          'Ваш заказ успешно оформлен и передан в обработку.',
          [{ text: 'OK', onPress: () => navigation.navigate('ProductList' as never) }]
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title="Подтверждение заказа" />
      </Appbar.Header>

      {error && (
        <Surface style={styles.errorCard} elevation={1}>
          <View style={styles.content}>
            <Paragraph style={styles.errorText}>{error}</Paragraph>
          </View>
        </Surface>
      )}

      <ScrollView>
        <Surface style={styles.card} elevation={1}>
          <View style={styles.content}>
            <Title>Товары в корзине</Title>
            <Divider style={styles.divider} />

            {cartItems.map(item => (
              <View key={item.product.id} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text>{item.product.name}</Text>
                  <Text style={styles.quantity}>{item.quantity} шт.</Text>
                </View>
                <Text style={styles.price}>{item.quantity * item.product.price} ₽</Text>
              </View>
            ))}

            <Divider style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Итого:</Text>
              <Text style={styles.totalPrice}>{totalAmount} ₽</Text>
            </View>
          </View>
        </Surface>

        {selectedOptions.length > 0 && (
          <Surface style={styles.card} elevation={1}>
            <View style={styles.content}>
              <Title>Выбранные опции</Title>
              <Divider style={styles.divider} />

              {selectedOptions.map(option => (
                <Paragraph key={option.id}>{option.name}</Paragraph>
              ))}
            </View>
          </Surface>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleConfirmOrder}
            disabled={submitting || isLoading}
            loading={submitting || isLoading}
            style={styles.button}
          >
            Подтвердить заказ
          </Button>

          <Button
            mode="outlined"
            onPress={handleBack}
            disabled={submitting || isLoading}
            style={styles.button}
          >
            Вернуться к корзине
          </Button>
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 8,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  divider: {
    marginVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  itemInfo: {
    flex: 1,
  },
  quantity: {
    color: '#666',
    fontSize: 14,
  },
  price: {
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    margin: 16,
  },
  button: {
    marginVertical: 8,
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

export default CheckoutScreen;
