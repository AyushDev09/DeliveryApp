import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';

import useStore from './store';
import { useNavigation } from '@react-navigation/native';

const products = [
  { id: '1', name: 'Pizza', price: 200 },
  { id: '2', name: 'Burger', price: 150 },
  { id: '3', name: 'Sushi', price: 500 },
  { id: '4', name: 'Wrap', price: 80 },
  { id: '5', name: 'Chicken', price: 300 },
];

const ProductListScreen = () => {
  const cart = useStore((state) => state.cart);
  const addToCart = useStore((state) => state.addToCart);
  const clearCart = useStore((state) => state.clearCart);
  const setOrder = useStore((state) => state.setOrder);
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const messages = ['Order Placed, Out for Delivery!', 'Order Delivered!'];

  useEffect(() => {
    let interval;
    if (modalVisible) {
      let messageIndex = 0;
      setCurrentMessage(messages[messageIndex]);

      interval = setInterval(() => {
        messageIndex += 1;
        if (messageIndex < messages.length) {
          setCurrentMessage(messages[messageIndex]);
        } else {
          setModalVisible(false); 
          clearInterval(interval);
        }
      }, 5000); 
    }

    return () => clearInterval(interval);
  }, [modalVisible]);

  const placeOrder = () => {
    const items = Object.entries(cart).map(([id, qty]) => {
      const product = products.find((p) => p.id === id);
      return { ...product, quantity: qty };
    });

    if (items.length === 0) {
      Alert.alert('Your cart is empty');
      return;
    }

    setOrder(items);
    clearCart();


    setTimeout(() => {
      setModalVisible(true);
    }, 5000);

    Alert.alert(
      'Order Placed',
      items
        .map(
          (item) =>
            `${item.name} x${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`
        )
        .join('\n'),
      [
        {
          text: 'Track Order',
          onPress: () => {
            setModalVisible(false);
            navigation.navigate('TrackOrder');
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.product}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
      <TouchableOpacity style={styles.button} onPress={() => addToCart(item.id)}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
      {cart[item.id] ? <Text>Qty: {cart[item.id]}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity style={styles.orderButton} onPress={placeOrder}>
        <Text style={styles.orderButtonText}>Place Order</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{currentMessage}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: '#f9fafd',
  },
  product: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    color: '#555',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4e8ef7',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#4e8ef7',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  qtyText: {
    fontSize: 16,
    color: '#4e8ef7',
    fontWeight: '600',
  },
  orderButton: {
    backgroundColor: '#34a853',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#34a853',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  modalText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4e8ef7',
  },
});
