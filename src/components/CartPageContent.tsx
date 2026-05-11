"use client";

import { useState } from "react";
import { InnerBanner } from "@/components/InnerBanner";
import { QuantitySelector } from "@/components/QuantitySelector";
import { SupportSection } from "@/components/SupportSection";
import type { CartPageContentProps } from "@/interfaces";
import { formatKes } from "@/lib/storefront-data";
import { useCartStore } from "@/stores/cart-store";
import { handleRemoveFromCart, handleUpdateQuantity } from "@/lib/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CartPageContent({ data }: CartPageContentProps) {

  const [itemToRemove, setItemToRemove] = useState<{ id: string; name: string } | null>(null);
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const vatAmount = parseFloat((subtotal * data.vatRate).toFixed(2));
  const total = subtotal + vatAmount;

  return (
    <>
      <InnerBanner
        title={data.banner.title}
        imageSrc={data.banner.imageSrc}
        imageAlt={data.banner.imageAlt}
        // breadcrumbs={[
        //   { label: "Home", href: "/" },
        //   { label: "Cart" }
        // ]}
      />

      <section className="cartWrapper py-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-7 col-md-7 col-sm-12 col-12">
              <div className="addProductWrapper">
                {items.length === 0 ? (
                  <>
                    <div className="added-porduct-item">
                      <div className="porduct-item-content">
                        <h4 className="fs-20 fw-500">Your cart is empty.</h4>
                        <p className="fs-14 fw-500 mb-2">Add a product to continue to checkout.</p>
                      </div>
                    </div>
                    <div className="w-100 d-flex justify-content-start mt-4">
                      <button
                        className="btn btn-blue w-100"
                        onClick={() => router.push("/")}
                      >
                        <span>View Products</span> <i className="icon-dot fs-10"></i>
                      </button>
                    </div>
                  </>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="added-porduct-item">
                      <button
                        type="button"
                        className="removeBtn border-0 bg-transparent p-0"
                        aria-label={`Remove ${item.name} from cart`}
                        data-bs-toggle="modal"
                        data-bs-target="#cartItemRemoveModal"
                        onClick={() => setItemToRemove({ id: item.id, name: item.name })}
                      >
                        <i className="fa-classic fa-regular fa-circle-xmark"></i>
                      </button>
                      <Link className="pro-img-main"
                        href={`/product-details/${item.id}`}
                      >
                        <img src={item.imageSrc} alt={item.imageAlt} />
                      </Link>
                      <div className="porduct-item-content">
                        <h4 className="fs-20 fw-500">{item.name}</h4>
                        <p className="fs-14 fw-500 mb-2">SKU: {item.sku}</p>
                        <QuantitySelector
                          key={item.id}
                          value={item.quantity}
                          onChange={(quantity) => {
                            handleUpdateQuantity(item.id, quantity);
                          }}
                        />
                        <h3 className="fs-20 fw-600 color-blue">{formatKes(item.price * item.quantity)}</h3>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="col-xl-4 col-lg-5 col-md-5 col-sm-12 col-12">
              <div className="SubTotalWrapper">
                <div className="tital-item">
                  <span className="fw-600">Subtotal</span>
                  <span className="fw-600">{formatKes(subtotal)}</span>
                </div>
                <div className="tital-item">
                  <span className="fw-400">VAT (16%)</span>
                  <span className="fw-400">{formatKes(vatAmount)}</span>
                </div>
                {/* <div className="tital-item">
                  <span className="fw-400">Delivery fee</span>
                  <span className="fw-400">{formatKes(data.deliveryFee, 0)}</span>
                </div> */}
                <div className="tital-item">
                  <hr />
                </div>
                <div className="tital-item">
                  <span className="fw-600">Total payable</span>
                  <span className="fw-600">{formatKes(total)}</span>
                </div>
                <div className="tital-item">
                  <button
                    className="btn btn-blue"
                    onClick={() => router.push("/payment-method")}
                    disabled={items.length === 0}
                  >
                    <span>Place Order</span> <i className="icon-dot fs-10"></i>
                  </button>
                </div>
                <div className="tital-item justify-content-center">
                  By placing your order you agree to the terms of sale.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className="modal fade"
        id="cartItemRemoveModal"
        data-bs-backdrop="static"
        tabIndex={-1}
        aria-labelledby="removeItemLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="LoginLabel">
                Remove Item
              </h5>
              <button type="button" id="closeSigupModel" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="w-100">
                <p className="fw-400 mb-2 text-center">
                  Are you sure you want to remove <strong>{itemToRemove?.name}</strong> from your cart?
                </p>
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-blue-line" data-bs-dismiss="modal"
                onClick={() => setItemToRemove(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-blue"
                data-bs-dismiss="modal"
                onClick={() => {
                  if (itemToRemove) {
                    handleRemoveFromCart(itemToRemove.id);
                    setItemToRemove(null);
                  }
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <SupportSection /> */}
    </>
  );
}
