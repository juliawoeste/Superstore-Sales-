import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Grid,
  Divider,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function CreateOrder() {
  const [formData, setFormData] = useState({
    Order_ID: "",
    Order_Date: "",
    Ship_Date: "",
    Ship_Mode: "",
    Customer_ID: "",
    Customer_Name: "",
    Segment: "",
    Country: "",
    City: "",
    State: "",
    Postal_Code: "",
    Region: "",
    Product_ID: "",
    Category: "",
    Sub_Category: "",
    Product_Name: "",
    Sales: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setCreatedOrder(null);

    try {
      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          Row_ID: formData.Row_ID === "" ? "" : Number(formData.Row_ID),
          Sales: formData.Sales === "" ? "" : Number(formData.Sales),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      setMessage("Order created successfully.");
      setIsError(false);
      setCreatedOrder(data);

      setFormData({
        Row_ID: "",
        Order_ID: "",
        Order_Date: "",
        Ship_Date: "",
        Ship_Mode: "",
        Customer_ID: "",
        Customer_Name: "",
        Segment: "",
        Country: "",
        City: "",
        State: "",
        Postal_Code: "",
        Region: "",
        Product_ID: "",
        Category: "",
        Sub_Category: "",
        Product_Name: "",
        Sales: "",
      });
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <AddCircleOutlineIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Create Order
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {message && (
        <Alert
          severity={isError ? "error" : "success"}
          sx={{ mb: 2 }}
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Order ID"
              name="Order_ID"
              value={formData.Order_ID}
              onChange={handleChange}
              fullWidth
              size="small"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Order Date"
              name="Order_Date"
              value={formData.Order_Date}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="DD/MM/YYYY"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Ship Date"
              name="Ship_Date"
              value={formData.Ship_Date}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="DD/MM/YYYY"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Ship Mode"
              name="Ship_Mode"
              value={formData.Ship_Mode}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="Second Class"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Customer ID"
              name="Customer_ID"
              value={formData.Customer_ID}
              onChange={handleChange}
              fullWidth
              size="small"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Customer Name"
              name="Customer_Name"
              value={formData.Customer_Name}
              onChange={handleChange}
              fullWidth
              size="small"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Segment"
              name="Segment"
              value={formData.Segment}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="Consumer"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Country"
              name="Country"
              value={formData.Country}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="United States"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              name="City"
              value={formData.City}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="State"
              name="State"
              value={formData.State}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Postal Code"
              name="Postal_Code"
              value={formData.Postal_Code}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Region"
              name="Region"
              value={formData.Region}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="Central"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Product ID"
              name="Product_ID"
              value={formData.Product_ID}
              onChange={handleChange}
              fullWidth
              size="small"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Category"
              name="Category"
              value={formData.Category}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="Furniture"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Sub-Category"
              name="Sub_Category"
              value={formData.Sub_Category}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="Bookcases"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Product Name"
              name="Product_Name"
              value={formData.Product_Name}
              onChange={handleChange}
              fullWidth
              size="small"
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Sales"
              name="Sales"
              value={formData.Sales}
              onChange={handleChange}
              fullWidth
              size="small"
              type="number"
              required
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button type="submit" variant="contained" size="large">
            Create Order
          </Button>
        </Box>
      </Box>

      {createdOrder && (
        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Created Order
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              backgroundColor: "#fafafa",
              overflowX: "auto",
            }}
          >
            <pre style={{ margin: 0 }}>
              {JSON.stringify(createdOrder, null, 2)}
            </pre>
          </Paper>
        </Box>
      )}
    </Paper>
  );
}

// auto increment the row id.
// make order date, customer name and id, product name, product id, sales
// update the order by row id instead of _id
