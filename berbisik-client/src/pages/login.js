import React from "react";
import AppIcon from "../images/icon.png";
import axios from "axios";
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
  const history = useHistory();
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const { value: email, bind: bindEmail, reset: resetEmail } = useInput("");
  const {
    value: password,
    bind: bindPassword,
    reset: resetPassword,
  } = useInput("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setLoading(true);
    const userData = { email, password };
    axios
      .post("/login", userData)
      .then(({ data }) => {
        console.log(data);
        localStorage.setItem("firebaseAuthToken", `Bearer ${data.token}`);
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
        setErrors(err.response.data);
      })
      .finally(() => {
        setLoading(false);
        resetPassword();
        resetEmail();
      });
  };
  return (
    <div>
      <Grid container spacing={2} className={classes.form}>
        <Grid item sm></Grid>
        <Grid item sm>
          <img src={AppIcon} alt="App Logo" className={classes.logo} />
          <Typography variant="h2" className={classes.title}>
            Login
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
              Login
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
              Don't have an account? please sign up{" "}
              <Link to="/signup">here</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm></Grid>
      </Grid>
    </div>
  );
}
