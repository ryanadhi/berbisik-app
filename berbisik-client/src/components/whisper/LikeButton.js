import React from "react";
import { Link } from "react-router-dom";

// Mui
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

// Icons
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { likeWhisper, unlikeWhisper } from "../../redux/actions/dataAction";

export default function LikeButton({ whisperId }) {
  const dispatch = useDispatch();
  const { authenticated, likes } = useSelector((state) => state.user);

  const likedWhisper = () => {
    if (likes && likes.find((like) => like.whisperId === whisperId))
      return true;
    else return false;
  };

  const handleLikeWhisper = () => {
    dispatch(likeWhisper(whisperId));
  };

  const handleUnlikeWhisper = () => {
    dispatch(unlikeWhisper(whisperId));
  };

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
  return likeButton;
}
