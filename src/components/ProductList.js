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
  Select,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";

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
        <FormControl>
          <InputLabel>Sort by</InputLabel>
          <Select value={sortType} onChange={handleSort}>
            <MenuItem value="">None</MenuItem>
            <MenuItem value="asc">Price Low to High</MenuItem>
            <MenuItem value="desc">Price High to Low</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Category</InputLabel>
          <Select value={selectedCategory} onChange={handleCategoryChange}>
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="jewelery">Jewelery</MenuItem>
            <MenuItem value="men's clothing">Men's Clothing</MenuItem>
            <MenuItem value="women's clothing">Women's Clothing</MenuItem>
          </Select>
        </FormControl>

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
