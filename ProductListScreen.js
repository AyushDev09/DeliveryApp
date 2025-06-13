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
  { id: '1', name: 'Pizza', price: 12.99 },
  { id: '2', name: 'Burger', price: 9.99 },
  { id: '3', name: 'Sushi', price: 15.49 },
];

const ProductListScreen = () => {
  const cart = useStore((state) => state.cart);
  const addToCart = useStore((state) => state.addToCart);
  const clearCart = useStore((state) => state.clearCart);
  const setOrder = useStore((state) => state.setOrder);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const messages = [
    'Order Placed, Out for Delivery!',
    'Order Delivered!',
  ];

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
          setModalVisible(false); // Close modal after all messages
          clearInterval(interval);
        }
      }, 5000); // Change message every 5 seconds
    }

    return () => clearInterval(interval); // Cleanup on unmount or modal close
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

    // Save order in global state
    setOrder(items);
    clearCart();

    // Show the modal after a 5-second delay
    setTimeout(() => {
      setModalVisible(true);
    }, 5000);

    Alert.alert(
      'Order Placed',
      items
        .map(
          (item) =>
            `${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
        )
        .join('\n'),
      [
        {
          text: 'Track Order',
          onPress: () => {
            setModalVisible(false); // Close modal when navigating
            navigation.navigate('TrackOrder');
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.product}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => addToCart(item.id)}
      >
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

      {/* Floating Modal */}
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
    padding: 20,
    backgroundColor: '#f9fafd',
  },
  product: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  price: {
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4e8ef7',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  orderButton: {
    backgroundColor: '#34a853',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});