import { create } from 'zustand'
import { ProductCategory } from '@/interfaces'
import { APIToGetAllCategories } from '@/lib/api/api.service'


interface CategoryState {
    categories: ProductCategory[]
    isLoading: boolean
    error: string | null
    fetchCategories: () => Promise<void>
}

export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    isLoading: false,
    error: null,

    fetchCategories: async () => {
        set({ isLoading: true, error: null })
        try {
            const res = await APIToGetAllCategories({ page: 1, pageSize: 10 });
            if (!res || !res.data || res.status !== 200) return;

            const resData = res.data
            if (resData && resData.status && resData.statusCode === 200 && resData.data && resData.data.data) {
                set({ categories: resData.data.data })
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
