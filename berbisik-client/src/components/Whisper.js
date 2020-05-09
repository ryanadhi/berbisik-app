import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Components
import DeleteWhisper from "./DeleteWhisper";

// Mui
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

// Icons
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import ChatIcon from "@material-ui/icons/Chat";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { likeWhisper, unlikeWhisper } from "../redux/actions/dataAction";

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

export default function Whisper({ whisper }) {
  dayjs.extend(relativeTime);
  const dispatch = useDispatch();
  const classes = useStyles();
  const { credentials, authenticated, likes } = useSelector(
    (state) => state.user
  );

  const likedWhisper = () => {
    if (likes && likes.find((like) => like.whisperId === whisper.whisperId))
      return true;
    else return false;
  };

  const handleLikeWhisper = () => {
    dispatch(likeWhisper(whisper.whisperId));
  };

  const handleUnlikeWhisper = () => {
    dispatch(unlikeWhisper(whisper.whisperId));
  };

  const deleteButton =
    authenticated && whisper.userCreated === credentials.username ? (
      <DeleteWhisper whisperId={whisper.whisperId} />
    ) : null;

  const likeButton = !authenticated ? (
    <Link to="/login">
      <Tooltip title="Like" placement="top">
        <IconButton>
          <FavoriteBorder color="primary" />
        </IconButton>
      </Tooltip>
    </Link>
  ) : likedWhisper() ? (
    <Tooltip title="Undo like" placement="top">
      <IconButton onClick={handleUnlikeWhisper}>
        <FavoriteIcon color="primary" />
      </IconButton>
    </Tooltip>
  ) : (
    <Tooltip title="Like" placement="top">
      <IconButton onClick={handleLikeWhisper}>
        <FavoriteBorder color="primary" />
      </IconButton>
    </Tooltip>
  );

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
            {whisper.userCreated}
          </Typography>
          {deleteButton}
          <Typography variant="body2" color="textSecondary">
            {dayjs(whisper.createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{whisper.body}</Typography>
          {likeButton}
          <span>{whisper.likeCount} Likes</span>
          <Tooltip title="Comments" placement="top">
            <IconButton>
              <ChatIcon color="primary" />
            </IconButton>
          </Tooltip>
          <span>{whisper.commentCount} Comments</span>
        </CardContent>
      </Card>
    </div>
  );
}
