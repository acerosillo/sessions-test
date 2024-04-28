import React, { useState, useEffect } from "react";

//import "./App.css";
export function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  useEffect(() => {
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (sortType === "asc") {
        return a.price - b.price;
      }
      if (sortType === "desc") {
        return b.price - a.price;
      }
      return 0;
    });
    setFilteredProducts(sortedProducts);
  }, [sortType, filteredProducts]); // Fixed dependency array here

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortType(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    if (e.target.value === "") {
      setFilteredProducts(products);
    } else {
      const filteredByCategory = products.filter(
        (product) => product.category === e.target.value
      );
      setFilteredProducts(filteredByCategory);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortType("");
    setFilteredProducts(products);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fake Store Products</h1>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select onChange={handleSort}>
          <option value="">Sort by</option>
          <option value="asc">Price Low to High</option>
          <option value="desc">Price High to Low</option>
        </select>
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="jewelery">Jewelery</option>
          <option value="men's clothing">Men's Clothing</option>
          <option value="women's clothing">Women's Clothing</option>
        </select>
        <button onClick={handleReset}>Reset</button>
        <div className="product-list">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product">
              <img src={product.image} alt={product.title} />
              <div className="product-info">
                <h2>{product.title}</h2>
                <p>${product.price}</p>
                <p>Category: {product.category}</p>
              </div>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}
