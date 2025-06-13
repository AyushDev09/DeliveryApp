import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create(
  persist(
    (set) => ({
      cart: {}, // { productId: quantity }
      setCart: (cart) => set({ cart }),
      addToCart: (productId) =>
        set((state) => ({
          cart: {
            ...state.cart,
            [productId]: (state.cart[productId] || 0) + 1,
          },
        })),
      clearCart: () => set({ cart: {} }),

      order: null, // Store placed order here
      setOrder: (order) => set({ order }),
    }),
    {
      name: 'delivery-app-storage', // unique storage key
      getStorage: () => AsyncStorage, // adapt for React Native
    }
  )
);

export default useStore;
