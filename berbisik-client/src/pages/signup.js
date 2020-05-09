import React from "react";
import AppIcon from "../images/icon.png";
import { Link, useHistory } from "react-router-dom";

// Helpers
import { useInput } from "../helpers/useInput";

// MUI
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { signup } from "../redux/actions/userAction";

const useStyles = makeStyles({
  form: {
    textAlign: "center",
  },
  logo: {
    margin: "20px auto 20px auto",
  },
  title: {
    margin: "10px auto 10px auto",
  },
  textField: {
    margin: "10px auto 10px auto",
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    position: "relative",
  },
  generalError: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: 10,
  },
  progress: {
    position: "absolute",
  },
});

export default function Login(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const { errors, loading } = useSelector((state) => state.UI);

  const { value: email, bind: bindEmail, reset: resetEmail } = useInput("");
  const {
    value: password,
    bind: bindPassword,
    reset: resetPassword,
  } = useInput("");
  const {
    value: confirmPassword,
    bind: bindConfirmPassword,
    reset: resetConfirmPassword,
  } = useInput("");
  const {
    value: username,
    bind: bindUsername,
    reset: resetUsername,
  } = useInput("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const newUserData = { email, password, confirmPassword, username };
    dispatch(signup(newUserData, history));
    resetPassword();
    resetEmail();
    resetConfirmPassword();
    resetUsername();
  };
  return (
    <div>
      <Grid container spacing={2} className={classes.form}>
        <Grid item sm></Grid>
        <Grid item sm>
          <img src={AppIcon} alt="App Logo" className={classes.logo} />
          <Typography variant="h2" className={classes.title}>
            Sign Up
          </Typography>
          <form noValidate onSubmit={handleSubmit}>
            <TextField
              required
              type="text"
              id="email"
              label="Email"
              {...bindEmail}
              helperText={errors.email}
              error={errors.email ? true : false}
              autoComplete="off"
              fullWidth
              className={classes.textField}
            />
            <TextField
              required
              type="password"
              id="password"
              label="Password"
              {...bindPassword}
              helperText={errors.password}
              error={errors.password ? true : false}
              autoComplete="off"
              fullWidth
              className={classes.textField}
            />
            <TextField
              required
              type="password"
              id="confirm-password"
              label="Confirm Password"
              {...bindConfirmPassword}
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              autoComplete="off"
              fullWidth
              className={classes.textField}
            />
            <TextField
              required
              type="text"
              id="username"
              label="Username"
              {...bindUsername}
              helperText={errors.username}
              error={errors.username ? true : false}
              autoComplete="off"
              fullWidth
              className={classes.textField}
            />
            {errors.general && (
              <Typography variant="body2" className={classes.generalError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Sign Up
              {loading && (
                <CircularProgress
                  className={classes.progress}
                  size={20}
                  color="secondary"
                />
              )}
            </Button>
            <br />
            <small>
              Already have an account? please login{" "}
              <Link to="/login">here</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm></Grid>
      </Grid>
    </div>
  );
}
