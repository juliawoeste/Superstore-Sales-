import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import PublicIcon from "@mui/icons-material/Public";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "#1976d2",
  "#388e3c",
  "#f57c00",
  "#7b1fa2",
  "#c62828",
  "#0097a7",
  "#558b2f",
  "#ad1457",
];

const BASE = "http://localhost:5001/api/mapreduce";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

// ── Reusable section card ──────────────────────────────────
const Section = ({ icon, title, color, children, loading, error }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      borderRadius: 3,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between", // 👈 important
    }}
  >
    <Box display="flex" alignItems="center" gap={1} mb={1}>
      <Box sx={{ color }}>{icon}</Box>
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
    </Box>

    <Divider sx={{ mb: 2 }} />

    <Box sx={{ flexGrow: 1 }}>
      {" "}
      {/* 👈 forces spacing */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        children
      )}
    </Box>
  </Paper>
);

// ── Custom tooltip for bar charts ──────────────────────────
const MoneyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ p: 1.5, fontSize: "0.82rem" }}>
        <Typography variant="body2" fontWeight={700}>
          {label}
        </Typography>
        <Typography variant="body2" color="primary">
          Sales: {fmt(payload[0].value)}
        </Typography>
        {payload[1] && (
          <Typography variant="body2" color="text.secondary">
            Orders: {payload[1].value}
          </Typography>
        )}
      </Paper>
    );
  }
  return null;
};

// ── Hook to fetch one endpoint ──────────────────────────────
const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
};

// ══════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════
const Dashboard = () => {
  const [regionQuery, setRegionQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const handleRunQuery = async () => {
    setMessage("");
    setIsError(false);
    setResults([]);

    if (!regionQuery) {
      setMessage("Please select a region.");
      setIsError(true);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5001/api/mapreduce/region/${encodeURIComponent(
          regionQuery,
        )}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to run query");
      }

      setResults(data);

      if (data.length === 0) {
        setMessage("No results found for that region.");
      }
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    }
  };

  const year = useFetch(`${BASE}/sales-by-year`);

  return (
    <Box>
      {/* Page header */}
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <BarChartIcon color="primary" fontSize="large" />
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Map-Reduce Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aggregated results computed via MongoDB MapReduce
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* ── ROW 1: Region ─────────────────── */}
        {message && (
          <Alert
            severity={isError ? "error" : "info"}
            sx={{ mb: 2 }}
            onClose={() => setMessage("")}
          >
            {message}
          </Alert>
        )}
        <Grid item xs={12} sx={{ mt: 5 }}>
          <Section
            icon={<PublicIcon />}
            title="Sales by Region"
            color="#1976d2"
          >
            <Box display="flex" gap={2} mb={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Region</InputLabel>
                <Select
                  value={regionQuery}
                  label="Region"
                  onChange={(e) => setRegionQuery(e.target.value)}
                >
                  <MenuItem value="East">East</MenuItem>
                  <MenuItem value="West">West</MenuItem>
                  <MenuItem value="South">South</MenuItem>
                  <MenuItem value="Central">Central</MenuItem>
                </Select>
              </FormControl>

              <Button variant="contained" onClick={handleRunQuery}>
                Run
              </Button>
            </Box>
            {results.length > 0 && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Sales</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>{row._id}</TableCell>
                      <TableCell>
                        $
                        {Number(row.totalSales).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Section>
        </Grid>

        {/* ── ROW 2: Year ──────────────────────────────── */}
        <Grid item xs={12} sx={{ mt: 5 }}>
          <Section
            icon={<CalendarTodayIcon />}
            title="Sales by Year"
            color="#f57c00"
            loading={year.loading}
            error={year.error}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={year.data || []}
                margin={{ top: 4, right: 20, left: 10, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip content={<MoneyTooltip />} />
                <Bar dataKey="totalSales" radius={[4, 4, 0, 0]}>
                  {(year.data || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[Math.floor(Math.random() * COLORS.length)]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <TableContainer sx={{ mt: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Year</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Total Sales
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Orders
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Avg per Order
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(year.data || []).map((r) => (
                    <TableRow key={r.year} hover>
                      <TableCell>
                        <Chip
                          label={r.year}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">{fmt(r.totalSales)}</TableCell>
                      <TableCell align="right">{r.orderCount}</TableCell>
                      <TableCell align="right">
                        {fmt(r.totalSales / r.orderCount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Section>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
