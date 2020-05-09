import React from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

// Pages
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";

// Components
import Navbar from "./components/Navbar";

// Utils
import AuthRoute from "./utils/AuthRoute";

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
      main: "#3fc1c9",
      dark: "#009098",
      contrastText: "#252a34",
    },
  },
});

let authenticated;
const token = localStorage.firebaseAuthToken;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = "/login";
    authenticated = false;
  } else {
    authenticated = true;
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Navbar />
        <div className="container">
          <Switch>
            <AuthRoute
              component={Login}
              path="/login"
              authenticated={authenticated}
            />
            <AuthRoute
              component={Signup}
              path="/signup"
              authenticated={authenticated}
            />
            <Route component={Home} path="/" />
          </Switch>
        </div>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
