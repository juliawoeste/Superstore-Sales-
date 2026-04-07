import { Breadcrumbs, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link, Outlet } from "react-router";

const Home = () => {
  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          color="inherit"
          href="/"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
      </Breadcrumbs>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Welcome to the Superstore Sales Dashboard
      </Typography>
      <Outlet />
    </div>
  );
};

export default Home;
