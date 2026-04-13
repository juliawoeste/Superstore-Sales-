import { Breadcrumbs, Typography, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link as RouterLink } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <RouterLink
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </RouterLink>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Welcome to the Superstore Sales Dashboard
      </Typography>

      <Button
        component={RouterLink}
        to="/createOrder"
        variant="contained"
        sx={{ display: "block", margin: "20px auto" }}
      >
        Create Order
      </Button>

      <Button
        component={RouterLink}
        to="/updateOrder"
        variant="contained"
        sx={{ display: "block", margin: "20px auto" }}
      >
        Update Order
      </Button>
    </div>
  );
};

export default Home;
