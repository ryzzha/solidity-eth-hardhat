"use client";
import { MarketplaceState } from "@/components/MarketplaceState";
import { AddProductForm } from "@/components/AddProductForm";
import { OrdersCatalog } from "@/components/OrdersCatalog";
import { ProductCatalog } from "@/components/ProductCatalog";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col justify-start gap-10 py-4 px-32">
      <nav className="w-full flex items-center justify-between py-3 border border-yellow-500">
        <h1 className="font-bold text-xl">Marketplace</h1>
        <ConnectWalletButton />
      </nav>
      <main className="w-full h-full flex flex-col justify-start items-center gap-7">
        <MarketplaceState />
        <OrdersCatalog />
        <AddProductForm />
        <ProductCatalog />
      </main>
    </div>
  );
}
