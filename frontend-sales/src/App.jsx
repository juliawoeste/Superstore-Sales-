import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import Home from "./components/Home";
import CreateOrder from "./components/CreateOrder";
import UpdateOrder from "./components/UpdateOrder";

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/createOrder" exact element={<CreateOrder />} />
          <Route path="/updateOrder" exact element={<UpdateOrder />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
