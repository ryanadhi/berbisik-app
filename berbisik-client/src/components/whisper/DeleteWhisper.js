import React from "react";

// Redux
import { useDispatch } from "react-redux";
import { deleteWhisper } from "../../redux/actions/dataAction";
// Mui
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

// Icons
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import { red } from "@material-ui/core/colors";

const useStyles = makeStyles({
  deleteButton: {
    // position: "absolute",
    // left: "90%",
    // top: "10%",
  },
});

export default function DeleteWhisper({ whisperId }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDeleteWhisper = () => {
    dispatch(deleteWhisper(whisperId));
    setOpen(false);
  };
  return (
    <>
      <Tooltip title="Delete Bisikan" placement="top">
        <IconButton onClick={handleOpen} className={classes.deleteButton}>
          <DeleteOutline style={{ color: red[500] }} />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Are you sure you want to delete this Bisikan ?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteWhisper}
            variant="contained"
            style={{ backgroundColor: red[500] }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
