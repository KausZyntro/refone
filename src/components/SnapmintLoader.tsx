// components/SnapmintEMI.tsx

"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    loadOnPage?: () => void;
    snapOptions?: any;
    Snapmint?: any;
  }
}

interface Props {
  price: number;
  page?: string;
}

export default function SnapmintEMI({
  price,
  page = "products_page",
}: Props) {
  useEffect(() => {
    if (!price || price <= 0) return;

    const initialize = () => {
      if (typeof window.loadOnPage === "function") {
        window.loadOnPage();
      }
    };

    const existingScript = document.getElementById(
      "snapmint-script"
    ) as HTMLScriptElement | null;

    if (existingScript) {
      setTimeout(initialize, 500);
      return;
    }

    const script = document.createElement("script");

    script.id = "snapmint-script";
    script.src =
      "https://checkout-merchant.snapmint.com/js/v1/2025";
    script.async = true;

    script.onload = () => {
      setTimeout(initialize, 500);
    };

    script.onerror = () => {
      console.error("Snapmint script failed to load");
    };

    document.body.appendChild(script);
  }, [price]);

  return (
    <div
      className="snapmint-emi-container"
      style={{ minHeight: "30px" }}
    >
      <div className="snap_emi_txt" />

      <span
        className="snapmint_lowest_emi_value"
        data-snapmint-price={price}
        data-snapmint-merchant_id="1439"
        data-snapmintpage={page}
      />
    </div>
  );
}
