import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import DropDown from "./DropDown";

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // State for filtered products
  const [filteredProducts, setFilteredProducts] = useState([]);

  // State for sorted products
  const [sortedProducts, setSortedProducts] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    const timer = setTimeout(() => {
      //console.log("fetch data");
      fetch("https://fakestoreapi.com/products")
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
          setFilteredProducts(data);
          setLoading(false); // Set loading to false after data is fetched
        })
        .catch((error) => console.log(error));
    }, 1000); // Fetch data after 1 second

    // Cleanup function to clear timeout in case component unmounts
    return () => clearTimeout(timer);
  }, []);

  // Use effect for filtering products based on search term
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Use effect for filtering by category
  useEffect(() => {
    if (selectedCategory === "") {
      setFilteredProducts(products);
    } else {
      const filteredByCategory = products.filter(
        (product) => product.category === selectedCategory
      );

      setFilteredProducts(filteredByCategory);
    }
  }, [selectedCategory, products]);

  // Use effect for sorting products
  useEffect(() => {
    const sorted = [...filteredProducts].sort((a, b) => {
      if (sortType === "asc") {
        return a.price - b.price;
      }
      if (sortType === "desc") {
        return b.price - a.price;
      }
      return 0;
    });
    setSortedProducts(sorted);
  }, [sortType, filteredProducts]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortType(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortType("");
    setFilteredProducts(products);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <DropDown
          label="Sort by"
          value={sortType}
          onChange={handleSort}
          options={[
            { label: "None", value: "" },
            { label: "Price Low to High", value: "asc" },
            { label: "Price High to Low", value: "desc" },
          ]}
        />
        <DropDown
          label="Category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          options={[
            { label: "All Categories", value: "" },
            { label: "Electronics", value: "electronics" },
            { label: "Jewelery", value: "jewelery" },
            { label: "Men's Clothing", value: "men's clothing" },
            { label: "Women's Clothing", value: "women's clothing" },
          ]}
        />

        <TextField
          label="Search products..."
          value={searchTerm}
          onChange={handleSearch}
        />

        <Button variant="contained" onClick={handleReset}>
          Reset
        </Button>
      </header>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ width: 50, height: 50 }}
                  />
                </TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
