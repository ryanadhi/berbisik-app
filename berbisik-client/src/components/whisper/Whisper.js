import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Components
import DeleteWhisper from "./DeleteWhisper";
import WhisperDialog from "./WhisperDialog";
import LikeButton from "./LikeButton";

// Mui
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

// Icons
import ChatIcon from "@material-ui/icons/Chat";

// Redux
import { useSelector, useDispatch } from "react-redux";

const useStyles = makeStyles({
  root: {
    position: "relative",
    display: "flex",
    marginBottom: 20,
  },
  media: {
    minWidth: 200,
  },
  content: {
    padding: 25,
    objectFit: "cover",
  },
});

export default function Whisper({ whisper, openDialog }) {
  dayjs.extend(relativeTime);
  const classes = useStyles();
  const { credentials, authenticated } = useSelector((state) => state.user);

  const deleteButton =
    authenticated && whisper.userCreated === credentials.username ? (
      <DeleteWhisper whisperId={whisper.whisperId} />
    ) : null;

  return (
    <div>
      <Card className={classes.root}>
        <CardMedia
          className={classes.media}
          image={whisper.userCreatedImage}
          title="Profile image"
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${whisper.userCreated}`}
            color="primary"
          >
            @{whisper.userCreated}
          </Typography>
          {deleteButton}
          <Typography variant="body2" color="textSecondary">
            {dayjs(whisper.createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{whisper.body}</Typography>
          <LikeButton whisperId={whisper.whisperId} />
          <span>{whisper.likeCount} Likes</span>
          <Tooltip title="Comments" placement="top">
            <IconButton>
              <ChatIcon color="primary" />
            </IconButton>
          </Tooltip>
          <span>{whisper.commentCount} Comments</span>
          <WhisperDialog
            whisperId={whisper.whisperId}
            userCreated={whisper.userCreated}
            openDialog={openDialog}
          />
        </CardContent>
      </Card>
    </div>
  );
}
