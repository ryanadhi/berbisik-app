import React from "react";

// Helpers
import { useInput } from "../../helpers/useInput";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { postWhisper, clearErrors } from "../../redux/actions/dataAction";

// Mui
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";

// Icon
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles({
  button: {
    marginTop: 20,
    position: "relative",
    float: "right",
  },
  textField: {
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
  closeButton: {
    position: "absolute",
    left: "91%",
    top: "6%",
  },
});

export default function PostWhisper() {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const { errors } = useSelector((state) => state.UI);
  const { postWhisperLoading } = useSelector((state) => state.data);

  const { value: body, bind: bindBody, reset: resetBody } = useInput("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetBody();
    dispatch(clearErrors());
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const newWhisper = {
      body,
    };
    dispatch(postWhisper(newWhisper));
  };

  React.useEffect(() => {
    if (Object.keys(errors).length === 0 && !postWhisperLoading) {
      handleClose();
    }
  }, [postWhisperLoading]);
  return (
    <div>
      <Tooltip title="Add Bisikan" placement="top">
        <IconButton onClick={handleOpen}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <Tooltip title="Close" placement="top" className={classes.closeButton}>
          <IconButton onClick={handleClose}>
            <CloseIcon color="secondary" />
          </IconButton>
        </Tooltip>
        <DialogTitle>Post a new Bisikan</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              name="body"
              type="text"
              label="Berbisik..."
              multiline
              rows="3"
              placeholder="Make your bisikan heard by your friends"
              error={errors.body ? true : false}
              helperText={errors.body}
              className={classes.textField}
              {...bindBody}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitButton}
              disabled={postWhisperLoading}
            >
              Submit
              {postWhisperLoading && (
                <CircularProgress
                  size={20}
                  className={classes.progressSpinner}
                />
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
