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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

export default function UpdateOrder() {
  const [rowId, setRowId] = useState("");
  const [formData, setFormData] = useState({
    Customer_Name: "",
    Region: "",
    Category: "",
    Product_Name: "",
    Sales: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [updatedOrder, setUpdatedOrder] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setUpdatedOrder(null);

    try {
      const response = await fetch(
        `http://localhost:5001/api/orders/row/${rowId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            Sales: formData.Sales === "" ? "" : Number(formData.Sales),
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to update order");
      }

      setMessage("Order updated successfully.");
      setIsError(false);
      setUpdatedOrder(data);

      setFormData({
        Customer_Name: "",
        Region: "",
        Category: "",
        Product_Name: "",
        Sales: "",
      });
      setRowId("");
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <EditOutlinedIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Update Order
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

      <Box component="form" onSubmit={handleUpdate}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Row ID"
              value={rowId}
              onChange={(e) => setRowId(e.target.value)}
              fullWidth
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
              label="Product Name"
              name="Product_Name"
              value={formData.Product_Name}
              onChange={handleChange}
              fullWidth
              size="small"
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
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button type="submit" variant="contained" size="large">
            Update Order
          </Button>
        </Box>
      </Box>

      {updatedOrder && (
        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Updated Order
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
              {JSON.stringify(updatedOrder, null, 2)}
            </pre>
          </Paper>
        </Box>
      )}
    </Paper>
  );
}
