import { create } from 'zustand'
import { Product } from '@/interfaces'
import { APIToGetAllProducts } from '@/lib/api/api.service'


interface ProductsState {
    products: Product[]
    isLoading: boolean
    error: string | null
    fetchAllProduct: () => Promise<void>
}

export const useProductStore = create<ProductsState>((set) => ({
    products: [],
    isLoading: false,
    error: null,

    fetchAllProduct: async () => {
        set({ isLoading: true, error: null })
        try {
            const res = await APIToGetAllProducts({ page: 1, pageSize: 10 });
            if (!res || !res.data || res.status !== 200) return;

            const resData = res.data
            if (resData && resData.status && resData.statusCode === 200 && resData.data && resData.data.data) {
                set({ products: resData.data.data })
            }
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : 'Failed to fetch categories',
            })
        } finally {
            set({ isLoading: false })
        }
    },
}))