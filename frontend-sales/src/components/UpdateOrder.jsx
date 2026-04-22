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
  CircularProgress,
  InputAdornment,
  Chip,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

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

const EMPTY_FORM = {
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

// ── Helper: convert M/D/YYYY or MM/DD/YYYY → YYYY-MM-DD for date input
const toInputDate = (str) => {
  if (!str) return "";
  // already ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const parts = str.split("/");
  if (parts.length !== 3) return "";
  const [m, d, y] = parts;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

// ── Helper: convert YYYY-MM-DD → M/DD/YYYY to match stored format
const fromInputDate = (str) => {
  if (!str) return "";
  const [y, m, d] = str.split("-");
  return `${parseInt(m)}/${d}/${y}`;
};

// ── Reusable dropdown ────────────────────────────────────
const DropdownField = ({ label, name, value, options, onChange, disabled }) => (
  <FormControl fullWidth size="small" disabled={disabled}>
    <InputLabel>{label}</InputLabel>
    <Select
      label={label}
      name={name}
      value={value}
      onChange={(e) => onChange({ target: { name, value: e.target.value } })}
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

// ── Section header ───────────────────────────────────────
const Section = ({ title }) => (
  <Grid item xs={12}>
    <Typography
      variant="subtitle2"
      color="text.secondary"
      fontWeight={700}
      sx={{ mt: 1.5, mb: 0.5, letterSpacing: 1, fontSize: "0.72rem" }}
    >
      {title}
    </Typography>
    <Divider />
  </Grid>
);

export default function UpdateOrder() {
  const [rowId, setRowId] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [orderFound, setOrderFound] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [updatedOrder, setUpdatedOrder] = useState(null);

  // ── Step 1: fetch by Row ID ──────────────────────────────
  const handleFetch = async () => {
    if (!rowId.trim()) return;
    setFetching(true);
    setFetchError("");
    setOrderFound(false);
    setFormData(EMPTY_FORM);
    setSaveMessage("");
    setUpdatedOrder(null);

    try {
      const res = await fetch(
        `http://localhost:5001/api/orders/rowid/${rowId.trim()}`,
      );
      const data = await res.json();

      if (!res.ok) {
        setFetchError(`Row ID ${rowId} does not exist.`);
        return;
      }

      setFormData({
        Order_ID: data.Order_ID || "",
        Order_Date: data.Order_Date || "",
        Ship_Date: data.Ship_Date || "",
        Ship_Mode: data.Ship_Mode || "",
        Customer_ID: data.Customer_ID || "",
        Customer_Name: data.Customer_Name || "",
        Segment: data.Segment || "",
        Country: data.Country || "",
        City: data.City || "",
        State: data.State || "",
        Postal_Code: data.Postal_Code || "",
        Region: data.Region || "",
        Product_ID: data.Product_ID || "",
        Category: data.Category || "",
        Sub_Category: data.Sub_Category || "",
        Product_Name: data.Product_Name || "",
        Sales: data.Sales || "",
      });
      setOrderFound(true);
    } catch (err) {
      setFetchError("Failed to connect to server.");
    } finally {
      setFetching(false);
    }
  };

  // ── Step 2: field changes ────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // reset Sub_Category when Category changes
      ...(name === "Category" ? { Sub_Category: "" } : {}),
    }));
  };

  // date fields need conversion from YYYY-MM-DD back to M/DD/YYYY
  const handleDateChange = (name) => (e) => {
    setFormData((prev) => ({ ...prev, [name]: fromInputDate(e.target.value) }));
  };

  // ── Step 3: save ─────────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage("");
    setIsError(false);
    setUpdatedOrder(null);

    try {
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== ""),
      );

      const res = await fetch(
        `http://localhost:5001/api/orders/row/${rowId.trim()}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...cleanedData,
            ...(cleanedData.Sales && { Sales: Number(cleanedData.Sales) }),
          }),
        },
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || "Failed to update order");

      setSaveMessage("Order updated successfully.");
      setIsError(false);
      setUpdatedOrder(data);
      setOrderFound(false);
      setFormData(EMPTY_FORM);
      setRowId("");
    } catch (err) {
      setSaveMessage(err.message);
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setRowId("");
    setFormData(EMPTY_FORM);
    setOrderFound(false);
    setFetchError("");
    setSaveMessage("");
    setUpdatedOrder(null);
  };

  const dis = !orderFound; // shorthand: fields disabled when no order loaded
  const subCatOptions = formData.Category
    ? SUB_CATS[formData.Category] || []
    : [];

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <EditOutlinedIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Update Order
        </Typography>
        {orderFound && (
          <Chip
            label={`Editing Row ID: ${rowId}`}
            color="warning"
            size="small"
            sx={{ ml: 1 }}
          />
        )}
      </Box>
      <Divider sx={{ mb: 2 }} />

      {saveMessage && (
        <Alert
          severity={isError ? "error" : "success"}
          sx={{ mb: 2 }}
          onClose={() => setSaveMessage("")}
        >
          {saveMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleUpdate}>
        <Grid container spacing={2}>
          {/* ── Row ID lookup ─────────────────────────────── */}
          <Grid item xs={12}>
            <Box display="flex" gap={1.5} alignItems="flex-start">
              <TextField
                label="Row ID"
                value={rowId}
                size="small"
                onChange={(e) => {
                  setRowId(e.target.value);
                  if (orderFound) {
                    setOrderFound(false);
                    setFormData(EMPTY_FORM);
                    setFetchError("");
                  }
                }}
                onKeyDown={(e) =>
                  e.key === "Enter" && !orderFound && handleFetch()
                }
                sx={{ width: 220 }}
                required
                error={!!fetchError}
                helperText={fetchError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter Row ID to find order"
              />
              {!orderFound ? (
                <Button
                  variant="contained"
                  onClick={handleFetch}
                  disabled={fetching || !rowId.trim()}
                  startIcon={
                    fetching ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <SearchIcon />
                    )
                  }
                  sx={{ height: 40 }}
                >
                  {fetching ? "Searching..." : "Find Order"}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleReset}
                  startIcon={<RestartAltIcon />}
                  sx={{ height: 40 }}
                >
                  Clear
                </Button>
              )}
            </Box>
          </Grid>

          {/* ══ ORDER INFO ══════════════════════════════════ */}
          <Section title="ORDER INFO" />

          {/* Order ID — read-only display */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Order ID"
              value={formData.Order_ID}
              fullWidth
              size="small"
              disabled
              helperText={dis ? "" : "Auto-assigned, not editable"}
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#555",
                },
              }}
            />
          </Grid>

          {/* Order Date — date picker */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Order Date"
              type="date"
              fullWidth
              size="small"
              disabled={dis}
              value={toInputDate(formData.Order_Date)}
              onChange={handleDateChange("Order_Date")}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Ship Date — date picker */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Ship Date"
              type="date"
              fullWidth
              size="small"
              disabled={dis}
              value={toInputDate(formData.Ship_Date)}
              onChange={handleDateChange("Ship_Date")}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Ship Mode — dropdown */}
          <Grid item xs={12} sm={6} md={4}>
            <DropdownField
              label="Ship Mode"
              name="Ship_Mode"
              value={formData.Ship_Mode}
              options={SHIP_MODES}
              onChange={handleChange}
              disabled={dis}
            />
          </Grid>

          {/* ══ CUSTOMER ════════════════════════════════════ */}
          <Section title="CUSTOMER" />

          {/* Customer ID — read-only */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Customer ID"
              value={formData.Customer_ID}
              fullWidth
              size="small"
              disabled
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#555",
                },
              }}
            />
          </Grid>

          {/* Customer Name — free text */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Customer Name"
              name="Customer_Name"
              value={formData.Customer_Name}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled={dis}
            />
          </Grid>

          {/* Segment — dropdown */}
          <Grid item xs={12} sm={6} md={4}>
            <DropdownField
              label="Segment"
              name="Segment"
              value={formData.Segment}
              options={SEGMENTS}
              onChange={handleChange}
              disabled={dis}
            />
          </Grid>

          {/* ══ LOCATION ════════════════════════════════════ */}
          <Section title="LOCATION" />

          {/* Country — read-only (only "United States" in data) */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Country"
              value={formData.Country}
              fullWidth
              size="small"
              disabled
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#555",
                },
              }}
            />
          </Grid>

          {/* City — free text */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="City"
              name="City"
              value={formData.City}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled={dis}
            />
          </Grid>

          {/* State — free text */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="State"
              name="State"
              value={formData.State}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled={dis}
            />
          </Grid>

          {/* Postal Code — number */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Postal Code"
              name="Postal_Code"
              value={formData.Postal_Code}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled={dis}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
          </Grid>

          {/* Region — dropdown */}
          <Grid item xs={12} sm={6} md={4}>
            <DropdownField
              label="Region"
              name="Region"
              value={formData.Region}
              options={REGIONS}
              onChange={handleChange}
              disabled={dis}
            />
          </Grid>

          {/* ══ PRODUCT ═════════════════════════════════════ */}
          <Section title="PRODUCT" />

          {/* Product ID — read-only */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Product ID"
              value={formData.Product_ID}
              fullWidth
              size="small"
              disabled
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#555",
                },
              }}
            />
          </Grid>

          {/* Category — dropdown */}
          <Grid item xs={12} sm={6} md={4}>
            <DropdownField
              label="Category"
              name="Category"
              value={formData.Category}
              options={CATEGORIES}
              onChange={handleChange}
              disabled={dis}
            />
          </Grid>

          {/* Sub-Category — dropdown filtered by Category */}
          <Grid item xs={12} sm={6} md={4}>
            <DropdownField
              label="Sub-Category"
              name="Sub_Category"
              value={formData.Sub_Category}
              options={
                subCatOptions.length
                  ? subCatOptions
                  : formData.Sub_Category
                    ? [formData.Sub_Category]
                    : []
              }
              onChange={handleChange}
              disabled={dis || !formData.Category}
            />
          </Grid>

          {/* Product Name — full-width free text */}
          <Grid item xs={12}>
            <TextField
              label="Product Name"
              name="Product_Name"
              value={formData.Product_Name}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled={dis}
            />
          </Grid>

          {/* ══ FINANCIAL ═══════════════════════════════════ */}
          <Section title="FINANCIAL" />

          {/* Sales — number with $ adornment */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Sales"
              name="Sales"
              value={formData.Sales}
              onChange={handleChange}
              fullWidth
              size="small"
              type="number"
              disabled={dis}
              inputProps={{ min: 0, step: "0.01" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        {/* Save / Cancel buttons */}
        {orderFound && (
          <Box mt={3} display="flex" gap={1.5} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={handleReset}
              startIcon={<RestartAltIcon />}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="warning"
              disabled={saving}
              startIcon={
                saving ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <SaveIcon />
                )
              }
              sx={{ px: 3 }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        )}
      </Box>

      {/* Show updated order result */}
      {updatedOrder && (
        <Box mt={3}>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Updated Order
          </Typography>
          <Paper
            variant="outlined"
            sx={{ p: 2, backgroundColor: "#fafafa", overflowX: "auto" }}
          >
            <pre style={{ margin: 0, fontSize: "0.8rem" }}>
              {JSON.stringify(updatedOrder, null, 2)}
            </pre>
          </Paper>
        </Box>
      )}
    </Paper>
  );
}
