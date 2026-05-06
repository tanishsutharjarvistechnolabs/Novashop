"use client";
import ProductPage from "@/components/ProductPage";
import { Suspense, useEffect, useState } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <ProductPage />
    </Suspense>
  );
}
