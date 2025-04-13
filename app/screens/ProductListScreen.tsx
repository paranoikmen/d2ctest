import React, { useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { Appbar, Searchbar, Badge, FAB } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { cartStore } from '../stores/CartStore';
import ProductItem from '../components/ProductItem';
import { Product } from '../models/Product';
import { useNavigation } from '@react-navigation/native';

const ProductListScreen = observer(() => {
  const navigation = useNavigation();
  const { products, isLoading, error, totalItems } = cartStore;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGoToCart = () => {
    navigation.navigate('Cart' as never);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <ProductItem product={item} />
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Список товаров" />
        <Appbar.Action
          icon="cart"
          onPress={handleGoToCart}
        />
        {totalItems > 0 && (
          <Badge style={styles.badge}>{totalItems}</Badge>
        )}
      </Appbar.Header>

      <Searchbar
        placeholder="Поиск товаров"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      <FAB
        style={styles.fab}
        icon="cart"
        label={`${totalItems}`}
        onPress={handleGoToCart}
        visible={totalItems > 0}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchbar: {
    margin: 10,
  },
  list: {
    paddingBottom: 80,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ProductListScreen;
