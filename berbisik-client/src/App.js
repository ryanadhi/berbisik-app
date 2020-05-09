import React from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import axios from "axios";
import { useDispatch } from "react-redux";

// Pages
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";

// Components
import Navbar from "./components/Navbar";

// Utils
import AuthRoute from "./utils/AuthRoute";

// Redux
import { getUserData, logout } from "./redux/actions/userAction";
import { SET_AUTHENTICATED } from "./redux/types";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#364f6b",
      main: "#364f6b",
      dark: "#072740",
      contrastText: "#f5f5f5",
    },
    secondary: {
      light: "#7af4fc",
      main: "#f73859",
      dark: "#009098",
      contrastText: "#252a34",
    },
  },
});

function App() {
  const dispatch = useDispatch();
  const token = localStorage.firebaseAuthToken;

  React.useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        dispatch(logout());
        window.location.href = "/login";
      } else {
        dispatch({ type: SET_AUTHENTICATED });
        axios.defaults.headers.common["Authorization"] = token;
        dispatch(getUserData());
      }
    }
  }, [token, dispatch]);
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Navbar />
        <div className="container">
          <Switch>
            <AuthRoute component={Login} path="/login" />
            <AuthRoute component={Signup} path="/signup" />
            <Route component={Home} path="/" />
          </Switch>
        </div>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
