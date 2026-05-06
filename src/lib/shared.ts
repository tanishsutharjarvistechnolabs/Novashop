import { CartReqBody, Product } from "@/interfaces";
import { useCartStore } from "@/stores/cart-store";
import { APIToAddItemToCart, APIToRemoveItemFromCart, APIToUpdateCartItemQuantity } from "./api/api.service";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

export const handleAddToCart = async (product: Product, quantity: number = 1) => {
    const cartItem = {
        id: (product.id).toString(),
        name: product.name,
        price: product.priceInKes || product.itemRate || 0,
        quantity: quantity,
        imageSrc: product.primaryImageUrl,
        imageAlt: product.name,
        sku: product.itemCode,
    };
    useCartStore.getState().addToCart(cartItem);

    const auth = useAuthStore.getState().auth

    if (auth && auth.authToken) {
        try {
            const product: CartReqBody[] = [
                {
                    productId: Number(cartItem.id),
                    price: cartItem.price,
                    quantity: cartItem.quantity,
                }
            ]

            const res = await APIToAddItemToCart(product, auth.authToken);
            if (!res || !res.data || res.status !== 200) return;

            const resData = res.data;
            if (resData.status && resData.statusCode === 200) {
                console.log("Item added to cart on server successfully");
            }
        } catch (error) {
            console.error("Error removing item from cart on server:", error);
        }
    }
    toast.success(`${product.name} added to cart!`);
}

export const handleRemoveFromCart = async (id: string) => {
    useCartStore.getState().removeFromCart(id);

    const auth = useAuthStore.getState().auth

    if (auth && auth.authToken) {
        try {
            const res = await APIToRemoveItemFromCart(id, auth.authToken);
            if (!res || !res.data || res.status !== 200) return;

            const resData = res.data;
            if (resData.status && resData.statusCode === 200) {
                console.log("Item removed from cart on server successfully");
            }
        } catch (error) {
            console.error("Error removing item from cart on server:", error);
        }
    }
    toast.success("Item removed from cart!");
}

export const handleUpdateQuantity = async (id: string, quantity: number) => {
    useCartStore.getState().updateQuantity(id, quantity);

    const auth = useAuthStore.getState().auth

    if (auth && auth.authToken) {
        try {
            const res = await APIToUpdateCartItemQuantity(id, quantity, auth.authToken);
            if (!res || !res.data || res.status !== 200) return;

            const resData = res.data;
            if (resData.status && resData.statusCode === 200) {
                console.log("Cart item quantity updated on server successfully");
            }
        } catch (error) {
            console.error("Error updating cart item quantity on server:", error);
        }
    }
    toast.success("Your cart has been updated");
}