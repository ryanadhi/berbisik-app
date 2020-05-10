import React from "react";

// Helpers
import { useInput } from "../../helpers/useInput";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { editUserDetails } from "../../redux/actions/userAction";

// Mui
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

// Icons
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles({
  button: {
    marginTop: 20,
    position: "relative",
    float: "right",
  },
  textField: {
    margin: "10px auto 10px auto",
  },
});

export default function EditDetails() {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { credentials } = useSelector((state) => state.user);

  const [open, setOpen] = React.useState(false);
  const { value: bio, bind: bindBio, reset: resetBio } = useInput(
    credentials.bio || ""
  );
  const {
    value: location,
    bind: bindLocation,
    reset: resetLocation,
  } = useInput(credentials.location || "");
  const { value: website, bind: bindWebsite, reset: resetWebsite } = useInput(
    credentials.website || ""
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const userDetails = {
      bio,
      website,
      location,
    };
    dispatch(editUserDetails(userDetails));
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Edit Details" placement="top">
        <IconButton onClick={handleOpen} className={classes.button}>
          <EditIcon color="primary" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        {" "}
        <DialogTitle>Edit your details</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              name="bio"
              tpye="text"
              label="Bio"
              multiline
              rows="3"
              placeholder="A short bio about yourself"
              className={classes.textField}
              {...bindBio}
              fullWidth
            />
            <TextField
              name="website"
              tpye="text"
              label="Website"
              placeholder="Your personal/professinal website"
              className={classes.textField}
              {...bindWebsite}
              fullWidth
            />
            <TextField
              name="location"
              tpye="text"
              label="Location"
              placeholder="Where you live"
              className={classes.textField}
              {...bindLocation}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
