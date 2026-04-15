import { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Container,
  AppBar,
  Toolbar,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TableRowsIcon from "@mui/icons-material/TableRows";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

import ViewOrders from "./ViewOrders";
import DeleteOrder from "./DeleteOrder";
import CreateOrder from "./CreateOrder";
import UpdateOrder from "./UpdateOrder";
import Dashboard from "./Dashboard";

const Home = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f0f4f8" }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <StorefrontIcon sx={{ mr: 1.5 }} />
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
            StoreIQ — Superstore Sales Manager
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          backgroundColor: "white",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={<TableRowsIcon fontSize="small" />}
              iconPosition="start"
              label="View Orders"
            />
            <Tab
              icon={<DeleteOutlineIcon fontSize="small" />}
              iconPosition="start"
              label="Delete Orders"
            />
            <Tab
              icon={<AddCircleOutlineIcon fontSize="small" />}
              iconPosition="start"
              label="Create Order"
            />
            <Tab
              icon={<EditOutlinedIcon fontSize="small" />}
              iconPosition="start"
              label="Update Order"
            />
            <Tab
              icon={<AssessmentOutlinedIcon fontSize="small" />}
              iconPosition="start"
              label="Dashboard"
            />
          </Tabs>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {tab === 0 && <ViewOrders />}
        {tab === 1 && <DeleteOrder />}
        {tab === 2 && <CreateOrder />}
        {tab === 3 && <UpdateOrder />}
        {tab === 4 && <Dashboard />}
      </Container>
    </Box>
  );
};

export default Home;
