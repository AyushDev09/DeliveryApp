import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create(
  persist(
    (set) => ({
      cart: {}, 
      setCart: (cart) => set({ cart }),
      addToCart: (productId) =>
        set((state) => ({
          cart: {
            ...state.cart,
            [productId]: (state.cart[productId] || 0) + 1,
          },
        })),
      clearCart: () => set({ cart: {} }),

      order: null, 
      setOrder: (order) => set({ order }),
    }),
    {
      name: 'delivery-app-storage', 
      getStorage: () => AsyncStorage, 
    }
  )
);

export default useStore;
