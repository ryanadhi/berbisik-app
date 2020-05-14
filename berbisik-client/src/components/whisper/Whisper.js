import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Components
import DeleteWhisper from "./DeleteWhisper";
import WhisperDialog from "./WhisperDialog";
import LikeButton from "./LikeButton";

// Mui
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";

// Icons
import ChatIcon from "@material-ui/icons/Chat";

// Redux
import { useSelector, useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
  },
  media: {
    minWidth: 200,
  },
  content: {
    padding: 10,
    objectFit: "cover",
  },
  rootGrid: {
    flexGrow: 1,
  },
  paperContainer: {
    padding: 5,
    marginBottom: 20,
    borderRadius: "10px",
  },
  contentAction: {
    padding: 0,
    height: 20,
  },
  gridContent: {
    padding: 5,
  },
  gridImage: {
    paddingTop: 12,
  },
  typography: {
    color: "#cf7500",
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    "@media (min-width:600px)": {
      width: theme.spacing(9),
      height: theme.spacing(9),
    },
  },
}));

export default function Whisper({ whisper, openDialog }) {
  dayjs.extend(relativeTime);
  const classes = useStyles();
  const { credentials, authenticated } = useSelector((state) => state.user);

  const deleteButton =
    authenticated && whisper.userCreated === credentials.username ? (
      <DeleteWhisper whisperId={whisper.whisperId} />
    ) : null;

  return (
    <>
      <Paper className={classes.paperContainer} elevation={3}>
        <Grid container className={classes.rootGrid} spacing={1}>
          <Grid
            container
            justify="center"
            className={classes.gridImage}
            sm={2}
            xs={2}
          >
            <Avatar
              alt={whisper.userCreated}
              src={whisper.userCreatedImage}
              className={classes.large}
            />
          </Grid>
          <Grid container sm={10} xs={10} direction="column">
            <Grid container>
              <Grid item sm={10} xs={10}>
                <CardContent className={classes.gridContent}>
                  <Typography
                    variant="h6"
                    component={Link}
                    to={`/users/${whisper.userCreated}`}
                    color="primary"
                    className={classes.typography}
                  >
                    @{whisper.userCreated}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {" . "}
                    {dayjs(whisper.createdAt).fromNow()}
                  </Typography>
                  <Typography variant="body1">{whisper.body}</Typography>
                </CardContent>
              </Grid>
              <Grid
                container
                sm={2}
                xs={2}
                justify="center"
                alignItems="flex-start"
              >
                <WhisperDialog
                  whisperId={whisper.whisperId}
                  userCreated={whisper.userCreated}
                  openDialog={openDialog}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item sm={10} xs={10}>
                <CardContent className={classes.contentAction}>
                  <LikeButton whisperId={whisper.whisperId} />
                  <span style={{ marginRight: "10px", marginLeft: "10px" }}>
                    {whisper.likeCount} Likes
                  </span>
                  <Link
                    to={`/users/${whisper.userCreated}/whispers/${whisper.whisperId}`}
                  >
                    <Tooltip title="Comments" placement="top">
                      <IconButton>
                        <ChatIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  </Link>
                  <span style={{ marginRight: "10px", marginLeft: "10px" }}>
                    {whisper.commentCount} Comments
                  </span>
                </CardContent>
              </Grid>
              <Grid container sm={2} xs={2} justify="center">
                {deleteButton}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
