import { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

export default function MapReduceQuery() {
  const [region, setRegion] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleRunQuery = async () => {
    setMessage("");
    setIsError(false);
    setResults([]);

    if (!region) {
      setMessage("Please select a region.");
      setIsError(true);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5001/api/orders/map-reduce/region/${encodeURIComponent(
          region
        )}`
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

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <AssessmentOutlinedIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Map Reduce Query
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {message && (
        <Alert
          severity={isError ? "error" : "info"}
          sx={{ mb: 2 }}
          onClose={() => setMessage("")}
        >
          {message}
        </Alert>
      )}

      <Box display="flex" gap={2} mb={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Region</InputLabel>
          <Select
            value={region}
            label="Region"
            onChange={(e) => setRegion(e.target.value)}
          >
            <MenuItem value="East">East</MenuItem>
            <MenuItem value="West">West</MenuItem>
            <MenuItem value="South">South</MenuItem>
            <MenuItem value="Central">Central</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleRunQuery}>
          Run Query
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
    </Paper>
  );
}
