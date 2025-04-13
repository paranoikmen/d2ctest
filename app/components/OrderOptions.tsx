import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Checkbox, Text, Title, Divider, Surface } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { cartStore } from '../stores/CartStore';

const OrderOptions = observer(() => {
  const { orderOptions } = cartStore;

  const handleToggleOption = (optionId: string) => {
    cartStore.toggleOption(optionId);
  };

  return (
    <Surface style={styles.container} elevation={1}>
      <Title style={styles.title}>Опции заказа</Title>
      <Divider style={styles.divider} />

      {orderOptions.map(option => (
        <View key={option.id} style={styles.optionRow}>
          <Checkbox
            status={option.selected ? 'checked' : 'unchecked'}
            onPress={() => handleToggleOption(option.id)}
          />
          <Text style={styles.optionText}>{option.name}</Text>
        </View>
      ))}
    </Surface>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default OrderOptions;
