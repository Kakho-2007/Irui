import React, { useState, useEffect } from "react";
import { fetchProducts } from "../utils/backend";
import ProductCard from "../components/ProductCard";
import "./Home.css";

export default function Home({ addToCart, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Irui Store | Premium Essentials";
  }, []);

  useEffect(() => {
    async function loadData() {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const cleanedQuery = searchQuery.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    if (!cleanedQuery) return true;

    const matchesName = product.name?.toLowerCase().includes(cleanedQuery);
    const matchesKeyword = product.keywords?.some((kw) =>
      kw.toLowerCase().includes(cleanedQuery),
    );

    return matchesName || matchesKeyword;
  });

  if (loading) {
    return <div className="loading-state">Syncing Irui Store Registry...</div>;
  }

  return (
    <main className="home-container">
      <h1 className="page-title">
        {cleanedQuery
          ? `Search Results for "${searchQuery}"`
          : "Catalog Showcase"}
      </h1>

      {filteredProducts.length === 0 ? (
        <div className="no-results-state">
          <h3>No matches found inside the Irui Registry.</h3>
          <p>
            Try inspecting spelling or try queries like "kitchen", "socks", or
            "electronics".
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      )}
    </main>
  );
}
