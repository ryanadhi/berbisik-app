import React from "react";
import { Link } from "react-router-dom";

// Redux
import { useSelector, useDispatch } from "react-redux";

// Material UI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

// Icons
import HomeIcon from "@material-ui/icons/Home";
import AddIcon from "@material-ui/icons/Add";
import NotificationsIcon from "@material-ui/icons/Notifications";

export default function Navbar() {
  const dispatch = useDispatch;
  const { authenticated } = useSelector((state) => state.user);
  return (
    <div>
      <AppBar>
        <Toolbar className="nav-container">
          {authenticated ? (
            <>
              <Tooltip title="Add Bisikan" placement="top">
                <IconButton>
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Link to="/">
                <Tooltip title="Home" placement="top">
                  <IconButton>
                    <HomeIcon />
                  </IconButton>
                </Tooltip>
              </Link>
              <Tooltip title="Notifications" placement="top">
                <IconButton>
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
