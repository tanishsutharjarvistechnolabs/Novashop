"use client";

import { InnerBanner } from "@/components/InnerBanner";
import { SectionBadge } from "@/components/SectionBadge";
import { SupportSection } from "@/components/SupportSection";
import { Product, ProductCategory } from "@/interfaces";
import { APIToGetProductsByCategory } from "@/lib/api/api.service";
import { handleAddToCart } from "@/lib/shared";
import { formatKes, productPageData } from "@/lib/storefront-data";
import { useCategoryStore } from "@/stores/categories-store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function ProductPage() {
  const { categories: productCategories } = useCategoryStore()
  const searchParams = useSearchParams();
  const categoryId: number = Number(searchParams.get("categoryId")) || productCategories[0]?.productCategoryID || 0;
  const [products, setProducts] = useState<Product[]>([]);
  const selectedCategory = productCategories.find(
    (category) => category.productCategoryID === categoryId
  );

  useEffect(() => {
    const FetchProductsByCategory = async () => {
      try {
        const res = await APIToGetProductsByCategory(categoryId);
        if (!res || !res.data || res.status !== 200) return;

        const resData = res.data;
        if (resData && resData.status && resData.statusCode === 200 && resData.data) {
          setProducts(resData.data);
        }

      } catch (error) {
        console.error("Error fetching products for category", categoryId, error);
        setProducts([]);
      }
    }

    if (categoryId) {
      FetchProductsByCategory();
    }

  }, [categoryId]);


  return (
    <>
      <InnerBanner
        title={productPageData.banner.title}
        imageSrc={productPageData.banner.imageSrc}
        imageAlt={productPageData.banner.imageAlt}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products" },
        ]}
      />

      <section className="shop-category-page pt-100">
        <div className="container">
          <div className="row category-layout-row">
            <div className="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="productSideMenu">
                <SectionBadge>Product categories</SectionBadge>
                {!productCategories || productCategories.length === 0 ? (
                  <p className="text-center text-muted fs-4 fw-500">No categories available</p>
                ) : (
                  <div className="categories-list" data-lenis-prevent-wheel>
                    {productCategories.map((category: ProductCategory) => (
                      <Link key={category.productCategoryID} href={{
                        pathname: "/product",
                        query: { categoryId: category.productCategoryID },
                      }}
                        className={categoryId === category.productCategoryID ? "active" : ""}
                      >
                        {category.productCategoryName} <span className="count">({category.productCount})</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-xl-9 col-lg-8 col-md-8 col-sm-12 col-12">
              <div className="c-banner-wrapper">
                <div className="c-banner-text">
                  <h2 className="text-uppercase fw-600 color-white mb-2">
                    {productPageData.promo.title}
                  </h2>
                  <p className="fw-500 color-white">{productPageData.promo.description}</p>
                </div>
                <img src={productPageData.promo.imageSrc} alt={productPageData.promo.imageAlt} />
              </div>

              <div className="category-products-header">
                <div>
                  <p className="shop-product-category mb-1">
                    {selectedCategory ? selectedCategory.productCategoryName : "All Products"}
                  </p>
                  <h2 className="title fs-44 mb-0">
                    {selectedCategory ? selectedCategory.productCategoryName : productPageData.banner.title}
                  </h2>
                </div>
              </div>

              {!products || products.length === 0 ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "30vh" }}>
                  <p className="text-muted fs-4 fw-500 m-0">No products available</p>
                </div>
              ) : (
                <div className="productlistHldr shop-product-grid">
                  {products.map((product) => (
                    <article key={product.id} className="productBox shop-product-card">
                      <Link
                        href={`/product-details/${product.id}`}
                        className="productItem shop-product-image"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        <img src={product.primaryImageUrl} alt={product.name} />
                      </Link>
                      <div className="product-item-meta shop-product-content">
                        <p className="shop-product-category">{product.productCategoryName}</p>
                        <h3 className="productTitle">
                          <Link href={`/product-details/${product.id}`}
                            onClick={() => window.scrollTo(0, 0)}
                          >{product.name}</Link>
                        </h3>
                        <p className="shop-product-description">{product.shortDescription}</p>
                        <strong className="product-price">{formatKes(product.itemRate || product.priceInKes || 0)}</strong>
                        <div className="service-add-cart shop-card-actions">
                          <Link
                            href={`/product-details/${product.id}`}
                            className="btn btn-blue-line"
                            onClick={() => window.scrollTo(0, 0)}
                          >
                            <span>View Product</span>
                          </Link>
                          <button className="btn btn-blue"
                            onClick={() => {
                              handleAddToCart(product);
                            }}
                          >
                            <span>Add To Cart</span> <i className="icon-dot fs-10"></i>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="col-12 pt-100">
              <hr />
            </div>
          </div>
        </div>
      </section >

      <SupportSection />
    </>
  );
}
