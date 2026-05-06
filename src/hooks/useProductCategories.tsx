"use client";

import { PaginationQuery, ProductCategory } from "@/interfaces";
import { APIToGetAllCategories } from "@/lib/api/api.service";
import { useState, useEffect } from "react";

interface UseProductCategoriesReturn {
    productCategories: ProductCategory[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useProductCategories = (
    options: PaginationQuery = { page: 1, pageSize: 10 }
): UseProductCategoriesReturn => {
    const { page = 1, pageSize = 10 } = options;

    const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        const loadProductCategories = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await APIToGetAllCategories({ page, pageSize });

                if (!res || !res.data || res.status !== 200) return;

                const resData = res.data
                if (resData && resData.status && resData.statusCode === 200 && resData.data && resData.data.data) {
                    setProductCategories(resData.data.data);
                }
            } catch (err) {
                console.error("Error fetching product categories:", err);
                setError("Failed to load product categories.");
            } finally {
                setLoading(false);
            }
        };

        loadProductCategories();
    }, [page, pageSize, trigger]);

    const refetch = () => setTrigger((prev) => prev + 1);

    return { productCategories, loading, error, refetch };
};