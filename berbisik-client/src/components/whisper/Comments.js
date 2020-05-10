import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

// Mui
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  commentImage: {
    maxWidth: "100%",
    height: 100,
    objectFit: "cover",
    borderRadius: "50%",
  },
  commentData: {
    marginLeft: 20,
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

export default function Comments({ comments }) {
  const classes = useStyles();
  return (
    <Grid container>
      {comments.map((comment, index) => {
        const { body, createdAt, userCreatedImage, userCreated } = comment;
        return (
          <React.Fragment key={createdAt}>
            <Grid item sm={12}>
              <Grid container>
                <Grid item sm={2}>
                  <img
                    src={userCreatedImage}
                    alt="comment"
                    className={classes.commentImage}
                  />
                </Grid>
                <Grid item sm={9}>
                  <div className={classes.commentData}>
                    <Typography
                      variant="h5"
                      component={Link}
                      to={`/users/${userCreated}`}
                      color="primary"
                    >
                      {userCreated}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
                    </Typography>
                    <hr className={classes.invisibleSeparator} />
                    <Typography variabnt="body1">{body}</Typography>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            {index !== comments.length - 1 && (
              <hr className={classes.visibleSeparator} />
            )}
          </React.Fragment>
        );
      })}
    </Grid>
  );
}
