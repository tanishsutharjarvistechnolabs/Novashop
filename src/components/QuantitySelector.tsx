"use client";

import { useState } from "react";
import type { QuantitySelectorProps } from "@/interfaces";

export function QuantitySelector({
  value,
  defaultValue = 1,
  min = 1,
  onChange,
  className = "productform_quantity",
  inputClassName = "quantityselector_input",
}: QuantitySelectorProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  const updateValue = (nextValue: number) => {
    const safeValue = Math.max(min, nextValue);

    if (!isControlled) {
      setInternalValue(safeValue);
    }

    onChange?.(safeValue);
  };

  return (
    <div className={className}>
      <button
        type="button"
        className="quantityselector_button border-0 bg-transparent p-0"
        aria-label="Decrease quantity"
        onClick={() => updateValue(currentValue - 1)}
      >
        <i className="fa-classic fa-solid fa-minus"></i>
      </button>
      <input
        type="text"
        className={inputClassName}
        value={currentValue}
        onChange={(event) => {
          const parsedValue = Number.parseInt(event.target.value, 10);
          updateValue(Number.isNaN(parsedValue) ? min : parsedValue);
        }}
      />
      <button
        type="button"
        className="quantityselector_button border-0 bg-transparent p-0"
        aria-label="Increase quantity"
        onClick={() => updateValue(currentValue + 1)}
      >
        <i className="fa-classic fa-solid fa-plus"></i>
      </button>
    </div>
  );
}
