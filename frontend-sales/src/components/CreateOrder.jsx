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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

// ── Dropdown options ─────────────────────────────────────
const SHIP_MODES = [
  "First Class",
  "Same Day",
  "Second Class",
  "Standard Class",
];
const SEGMENTS = ["Consumer", "Corporate", "Home Office"];
const REGIONS = ["Central", "East", "South", "West"];
const CATEGORIES = ["Furniture", "Office Supplies", "Technology"];
const SUB_CATS = {
  Furniture: ["Bookcases", "Chairs", "Furnishings", "Tables"],
  "Office Supplies": [
    "Appliances",
    "Art",
    "Binders",
    "Envelopes",
    "Fasteners",
    "Labels",
    "Paper",
    "Storage",
    "Supplies",
  ],
  Technology: ["Accessories", "Copiers", "Machines", "Phones"],
};

// ── Date helpers (stored as M/D/YYYY in MongoDB) ─────────
const toInputDate = (str) => {
  if (!str) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const parts = str.split("/");
  if (parts.length !== 3) return "";
  const [m, d, y] = parts;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

const fromInputDate = (str) => {
  if (!str) return "";
  const [y, m, d] = str.split("-");
  return `${parseInt(m)}/${d}/${y}`;
};

const EMPTY = {
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
};

export default function CreateOrder() {
  const [formData, setFormData] = useState(EMPTY);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // ── Handlers ─────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // reset Sub_Category when Category changes
      ...(name === "Category" ? { Sub_Category: "" } : {}),
    }));
  };

  const handleDateChange = (name) => (e) => {
    setFormData((prev) => ({ ...prev, [name]: fromInputDate(e.target.value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setCreatedOrder(null);

    try {
      const response = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          Sales: formData.Sales === "" ? "" : Number(formData.Sales),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create order");

      setMessage("Order created successfully.");
      setIsError(false);
      setCreatedOrder(data);
      setFormData(EMPTY);
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    }
  };

  const subCatOptions = formData.Category
    ? SUB_CATS[formData.Category] || []
    : [];

  // ── Reusable dropdown ──────────────────────────────────
  const DropdownField = ({ label, name, options, required = false }) => (
    <FormControl fullWidth size="small" required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        name={name}
        value={formData[name]}
        onChange={(e) =>
          handleChange({ target: { name, value: e.target.value } })
        }
      >
        <MenuItem value="">
          <em>— Select —</em>
        </MenuItem>
        {options.map((o) => (
          <MenuItem key={o} value={o}>
            {o}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

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
          {/* Order ID — free text */}
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

          {/* Order Date — date picker */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Order Date"
              type="date"
              value={toInputDate(formData.Order_Date)}
              onChange={handleDateChange("Order_Date")}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Ship Date — date picker */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ship Date"
              type="date"
              value={toInputDate(formData.Ship_Date)}
              onChange={handleDateChange("Ship_Date")}
              fullWidth
              size="small"
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Ship Mode — dropdown */}
          <Grid item xs={12} sm={6}>
            <DropdownField
              label="Ship Mode"
              name="Ship_Mode"
              options={SHIP_MODES}
            />
          </Grid>

          {/* Customer ID — free text */}
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

          {/* Customer Name — free text */}
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

          {/* Segment — dropdown */}
          <Grid item xs={12} sm={6}>
            <DropdownField label="Segment" name="Segment" options={SEGMENTS} />
          </Grid>

          {/* Country — free text */}
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

          {/* City — free text */}
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

          {/* State — free text */}
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

          {/* Postal Code — numeric */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Postal Code"
              name="Postal_Code"
              value={formData.Postal_Code}
              onChange={handleChange}
              fullWidth
              size="small"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
          </Grid>

          {/* Region — dropdown */}
          <Grid item xs={12} sm={6}>
            <DropdownField
              label="Region"
              name="Region"
              options={REGIONS}
              required
            />
          </Grid>

          {/* Product ID — free text */}
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

          {/* Category — dropdown */}
          <Grid item xs={12} sm={6}>
            <DropdownField
              label="Category"
              name="Category"
              options={CATEGORIES}
            />
          </Grid>

          {/* Sub-Category — dropdown filtered by Category */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" disabled={!formData.Category}>
              <InputLabel>Sub-Category</InputLabel>
              <Select
                label="Sub-Category"
                name="Sub_Category"
                value={formData.Sub_Category}
                onChange={(e) =>
                  handleChange({
                    target: { name: "Sub_Category", value: e.target.value },
                  })
                }
              >
                <MenuItem value="">
                  <em>— Select Category first —</em>
                </MenuItem>
                {subCatOptions.map((o) => (
                  <MenuItem key={o} value={o}>
                    {o}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Product Name — free text */}
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

          {/* Sales — number with $ */}
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
              inputProps={{ min: 0, step: "0.01" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={
              !formData.Order_ID ||
              !formData.Ship_Date ||
              !formData.Customer_ID ||
              !formData.Customer_Name ||
              !formData.Region ||
              !formData.Product_ID ||
              !formData.Product_Name ||
              formData.Sales === ""
            }
          >
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
            sx={{ p: 2, backgroundColor: "#fafafa", overflowX: "auto" }}
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
