import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Mui
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
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
  const classes = useStyles();
  dayjs.extend(relativeTime);
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
          <Typography variant="body2" color="textSecondary">
            {dayjs(whisper.createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{whisper.body}</Typography>
        </CardContent>
      </Card>
    </div>
  );
}
