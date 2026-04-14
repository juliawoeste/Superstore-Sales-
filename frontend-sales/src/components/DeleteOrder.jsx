import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  InputAdornment,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";

const DeleteOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [confirmOrder, setConfirmOrder] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5001/api/orders?page=${page}&limit=10&search=${encodeURIComponent(
          search
        )}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
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

  // Debounce search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const openConfirm = (order) => {
    setConfirmId(order._id);
    setConfirmOrder(order);
    setSuccess("");
    setError("");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${confirmId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setSuccess(`Order "${confirmOrder?.Order_ID}" deleted successfully.`);
      setConfirmId(null);
      setConfirmOrder(null);
      fetchOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const regionColor = {
    South: "warning",
    West: "info",
    East: "success",
    Central: "secondary",
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <DeleteOutlineIcon color="error" />
        <Typography variant="h6" fontWeight={600}>
          Delete Orders
        </Typography>
        <Chip label={`${total} records`} size="small" sx={{ ml: "auto" }} />
      </Box>
      <Divider sx={{ mb: 2 }} />

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        size="small"
        placeholder="Search by Order ID, Customer, Category, Region..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 420 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {[
                    "Row ID",
                    "Order ID",
                    "Customer",
                    "Category",
                    "Region",
                    "Sales ($)",
                    "Action",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{ fontWeight: 700, backgroundColor: "#f5f5f5" }}
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
                      colSpan={7}
                      align="center"
                      sx={{ py: 3, color: "text.secondary" }}
                    >
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order._id} hover>
                      <TableCell>{order.Row_ID}</TableCell>
                      <TableCell
                        sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
                      >
                        {order.Order_ID}
                      </TableCell>
                      <TableCell>{order.Customer_Name}</TableCell>
                      <TableCell>{order.Category}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.Region}
                          size="small"
                          color={regionColor[order.Region] || "default"}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>${Number(order.Sales).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteOutlineIcon />}
                          onClick={() => openConfirm(order)}
                          sx={{ borderRadius: 2 }}
                        >
                          Delete
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
              onChange={(_, val) => setPage(val)}
              color="primary"
              size="small"
            />
          </Box>
        </>
      )}

      {/* Confirm Dialog */}
      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete order{" "}
            <strong>{confirmOrder?.Order_ID}</strong> for customer{" "}
            <strong>{confirmOrder?.Customer_Name}</strong>? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={
              deleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteOutlineIcon />
              )
            }
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DeleteOrder;
