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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  //fetch data from the API
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => console.log(error));
  }, []);

  //useffect for filtering products based on search term
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  //useffect for filtering by price
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
  }, [sortType, filteredProducts]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  //checks for sort type and sorts the products based on the selected sort type
  const handleSort = (e) => {
    setSortType(e.target.value);
  };

  //sorts the categories based on the selected category
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

  //resets all filters back to default
  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortType("");
    setFilteredProducts(products);
  };

  return (
    <div className="App">
      <header className="App-header">
        <TextField
          label="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: 200, height: 50 }}
        />
        <FormControl>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortType}
            onChange={handleSort}
            style={{ width: 200, height: 50 }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="asc">Price Low to High</MenuItem>
            <MenuItem value="desc">Price High to Low</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{ width: 200, height: 50 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="jewelery">Jewelery</MenuItem>
            <MenuItem value="men's clothing">Men's Clothing</MenuItem>
            <MenuItem value="women's clothing">Women's Clothing</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleReset}>
          Reset
        </Button>
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
              {filteredProducts.map((product) => (
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
      </header>
    </div>
  );
}

export default App;
