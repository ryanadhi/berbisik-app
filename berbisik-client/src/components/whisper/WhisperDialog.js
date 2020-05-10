import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import dayjs from "dayjs";

//Components
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";

// MUI Stuff
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

// Icons
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import ChatIcon from "@material-ui/icons/Chat";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getWhisper, clearErrors } from "../../redux/actions/dataAction";

const useStyles = makeStyles({
  profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: "50%",
    objectFit: "cover",
  },
  dialogContent: {
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    left: "90%",
  },
  expandButton: {
    position: "absolute",
    left: "90%",
  },
  spinnerDiv: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 50,
  },
  invisibleSeparator: {
    border: "none",
    margin: 4,
  },
  visibleSeparator: {
    width: "100%",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    marginBottom: 20,
  },
});

export default function WhisperDialog({ openDialog, whisperId, userCreated }) {
  const dispatch = useDispatch();
  const { url } = useRouteMatch();
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [oldPath, setOldPath] = React.useState(url);
  const [newPath, setNewPath] = React.useState(
    `/users/${userCreated}/whispers/${whisperId}`
  );
  const { whisper } = useSelector((state) => state.data);
  const { loading } = useSelector((state) => state.UI);

  React.useEffect(() => {
    if (openDialog) {
      handleOpen();
    }
  }, [openDialog]);
  const handleOpen = () => {
    if (oldPath === newPath) {
      setOldPath(`/users/${userCreated}`);
    }
    window.history.pushState(null, null, newPath);
    setOpen(true);
    dispatch(getWhisper(whisperId));
  };

  const handleClose = () => {
    window.history.pushState(null, null, oldPath);
    setOpen(false);
    dispatch(clearErrors());
  };

  const dialogMarkup = loading ? (
    <div className={classes.spinnerDiv}>
      <CircularProgress size={200} thickness={2} />
    </div>
  ) : (
    <Grid container spacing={2}>
      <Grid item sm={5}>
        <img
          src={whisper.userCreatedImage}
          alt="Profile"
          className={classes.profileImage}
        />
      </Grid>
      <Grid item sm={7}>
        <Typography
          component={Link}
          color="primary"
          variant="h5"
          to={`/users/${whisper.userCreated}`}
        >
          @{whisper.userCreated}
        </Typography>
        <hr className={classes.invisibleSeparator} />
        <Typography variant="body2" color="textSecondary">
          {dayjs(whisper.createdAt).format("h:mm a, MMMM DD YYYY")}
        </Typography>
        <hr className={classes.invisibleSeparator} />
        <Typography variant="body1">{whisper.body}</Typography>
        <LikeButton whisperId={whisper.whisperId} />
        <span>{whisper.likeCount} Likes</span>
        <Tooltip title="Comments" placement="top">
          <IconButton>
            <ChatIcon color="primary" />
          </IconButton>
        </Tooltip>
        <span>{whisper.commentCount} Comments</span>
      </Grid>
      <hr className={classes.visibleSeparator} />
      <CommentForm whisperId={whisper.whisperId} />
      <Comments comments={whisper.comments} />
    </Grid>
  );

  return (
    <>
      <Tooltip
        title="Expand Bisikan"
        placement="top"
        className={classes.expandButton}
      >
        <IconButton onClick={handleOpen}>
          <UnfoldMore color="primary" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <Tooltip title="Close" placement="top" className={classes.closeButton}>
          <IconButton onClick={handleClose}>
            <CloseIcon color="secondary" />
          </IconButton>
        </Tooltip>
        <DialogContent className={classes.dialogContent}>
          {dialogMarkup}
        </DialogContent>
      </Dialog>
    </>
  );
}
