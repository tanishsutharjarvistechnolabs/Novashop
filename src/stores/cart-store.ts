import { CartReqBody } from "@/interfaces";
import { APIToAddItemToCart, APIToFetchUserCart } from "@/lib/api/api.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    sku: string;
    imageSrc: string;
    imageAlt?: string;
};

type CartStore = {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    isSyncing: boolean;
    totalItems: () => number;
    totalPrice: () => number;
    syncWithServer: (token: string) => Promise<void>;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isSyncing: false,

            addToCart: (item) =>
                set((state) => {
                    const existing = state.items.find((i) => i.id === item.id);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                            ),
                        };
                    }
                    return { items: [...state.items, item] };
                }),

            removeFromCart: (id) =>
                set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items: quantity <= 0
                        ? state.items.filter((i) => i.id !== id)
                        : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
                })),

            clearCart: () => set({ items: [] }),

            totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

            totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
            syncWithServer: async (token) => {
                set({ isSyncing: true });
                try {
                    const localItems = get().items;

                    if (localItems.length > 0) {
                        const cartReqBody: CartReqBody[] = localItems.map((item) => ({
                            productId: parseInt(item.id),
                            price: item.price,
                            quantity: item.quantity,
                        }));

                        const pushRes = await APIToAddItemToCart(cartReqBody, token);

                        if (!pushRes || !pushRes.data || pushRes.status !== 200 || !pushRes.data.status) {
                            console.error("Failed to push local cart to server.");
                            return;
                        }
                    }

                    const response = await APIToFetchUserCart(token);
                    if (!response || !response.data || response.status !== 200) return;

                    if (
                        response.data.status &&
                        response.data.statusCode === 200 &&
                        response.data.data &&
                        Array.isArray(response.data.data.items)
                    ) {
                        const serverCartItems: CartItem[] = response.data.data.items.map((item: any) => ({
                            id: item.productId.toString(),
                            name: item.productName,
                            price: item.price,
                            quantity: item.quantity,
                            sku: item.itemCode,
                            imageSrc: item.productImg,
                            imageAlt: item.productName,
                        }));

                        set({ items: serverCartItems });
                    }
                } catch (error) {
                    console.error("Error syncing cart with server:", error);
                } finally {
                    set({ isSyncing: false });
                }
            },
        }),
        {
            name: "cart",
        }
    )
);