import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Pagination,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TableRowsIcon from "@mui/icons-material/TableRows";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";

const REGION_COLOR = {
  South: "warning",
  West: "info",
  East: "success",
  Central: "secondary",
};

const CATEGORY_COLOR = {
  Furniture: "primary",
  "Office Supplies": "success",
  Technology: "error",
};

const DetailRow = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <Box sx={{ mb: 1 }}>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
      <Typography variant="body2">{value || "—"}</Typography>
    </Box>
  </Grid>
);

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null); // for detail dialog

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders?page=${page}&limit=12&search=${encodeURIComponent(search)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch orders");
      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <TableRowsIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>
          View Orders
        </Typography>
        <Chip
          label={`${total.toLocaleString()} records`}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ ml: "auto" }}
        />
      </Box>
      <Divider sx={{ mb: 2 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search by Order ID, Customer Name, Category, or Region..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer
            sx={{
              maxHeight: 460,
              borderRadius: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {[
                    "Row ID",
                    "Order ID",
                    "Date",
                    "Customer",
                    "Segment",
                    "Category",
                    "Region",
                    "Sales ($)",
                    "Details",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontWeight: 700,
                        backgroundColor: "#f0f4f8",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      align="center"
                      sx={{ py: 4, color: "text.secondary" }}
                    >
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order._id} hover sx={{ cursor: "default" }}>
                      <TableCell>{order.Row_ID}</TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "monospace",
                          fontSize: "0.72rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order.Order_ID}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {order.Order_Date}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {order.Customer_Name}
                      </TableCell>
                      <TableCell>{order.Segment}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.Category}
                          size="small"
                          color={CATEGORY_COLOR[order.Category] || "default"}
                          variant="filled"
                          sx={{ fontSize: "0.7rem" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.Region}
                          size="small"
                          color={REGION_COLOR[order.Region] || "default"}
                          variant="outlined"
                          sx={{ fontSize: "0.7rem" }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        ${Number(order.Sales).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="text"
                          color="primary"
                          startIcon={<InfoOutlinedIcon fontSize="small" />}
                          onClick={() => setSelected(order)}
                          sx={{ borderRadius: 2, textTransform: "none" }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              color="primary"
              size="small"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}

      {/* Order Detail Dialog */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <InfoOutlinedIcon color="primary" />
          Order Details
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {selected?.Order_ID}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={1}>
            <DetailRow label="Row ID" value={selected?.Row_ID} />
            <DetailRow label="Order ID" value={selected?.Order_ID} />
            <DetailRow label="Order Date" value={selected?.Order_Date} />
            <DetailRow label="Ship Date" value={selected?.Ship_Date} />
            <DetailRow label="Ship Mode" value={selected?.Ship_Mode} />
            <DetailRow label="Customer ID" value={selected?.Customer_ID} />
            <DetailRow label="Customer Name" value={selected?.Customer_Name} />
            <DetailRow label="Segment" value={selected?.Segment} />
            <DetailRow label="Country" value={selected?.Country} />
            <DetailRow label="City" value={selected?.City} />
            <DetailRow label="State" value={selected?.State} />
            <DetailRow label="Postal Code" value={selected?.Postal_Code} />
            <DetailRow label="Region" value={selected?.Region} />
            <DetailRow label="Product ID" value={selected?.Product_ID} />
            <DetailRow label="Category" value={selected?.Category} />
            <DetailRow label="Sub-Category" value={selected?.Sub_Category} />
            <DetailRow label="Product Name" value={selected?.Product_Name} />
            <DetailRow
              label="Sales"
              value={selected ? `$${Number(selected.Sales).toFixed(2)}` : ""}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSelected(null)}
            startIcon={<CloseIcon />}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ViewOrders;
