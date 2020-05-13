import React from "react";

// Helpers
import { useInput } from "../../helpers/useInput";

// Mui
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { submitComment } from "../../redux/actions/dataAction";

const useStyles = makeStyles({
  button: {
    marginTop: 20,
    position: "relative",
    float: "right",
  },
  textField: {
    width: "80%",
    margin: "10px auto 10px auto",
  },
  submitButton: {
    position: "relative",
    float: "right",
    marginTop: 10,
  },
  progressSpinner: {
    position: "absolute",
  },
  visibleSeparator: {
    width: "100%",
    textAlign: "center",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
  },
  formComment: {
    backgroundColor: "#dee3e2",
    borderRadius: "10px",
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default function CommentForm({ whisperId }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { loading, errors } = useSelector((state) => state.UI);
  const { authenticated } = useSelector((state) => state.user);

  const { value: body, bind: bindBody, reset: resetBody } = useInput("");

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(submitComment(whisperId, { body }));
    resetBody();
  };

  const commentFormMarkup = authenticated ? (
    <Grid item sm={12} style={{ textAlign: "center" }}>
      <form onSubmit={handleSubmit} className={classes.formComment}>
        <Grid container alignItems="center" justify="center">
          <TextField
            name="body"
            type="text"
            label="Comment on scream"
            error={errors.comment ? true : false}
            helperText={errors.comment}
            {...bindBody}
            fullWidth
            className={classes.textField}
            multiline
            color="secondary"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Submit
          </Button>
        </Grid>
      </form>
      {/* <hr className={classes.visibleSeparator} /> */}
    </Grid>
  ) : null;

  return commentFormMarkup;
}
