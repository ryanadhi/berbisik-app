import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

// Mui
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
  commentData: {
    marginLeft: 12,
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
  typography: {
    color: "#cf7500",
  },
  large: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    "@media (min-width:600px)": {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
  },
}));

export default function Comments({ comments }) {
  const classes = useStyles();
  return (
    <Grid container>
      {comments.map((comment, index) => {
        const { body, createdAt, userCreatedImage, userCreated } = comment;
        return (
          <React.Fragment key={createdAt}>
            <Grid item sm={12} xs={12}>
              <Grid container justify="center" alignItems="center">
                <Grid item sm={2} xs={2}>
                  <Avatar
                    alt={userCreated}
                    src={userCreatedImage}
                    className={classes.large}
                  />
                </Grid>
                <Grid item sm={9}>
                  <div className={classes.commentData}>
                    <Typography
                      variant="h6"
                      component={Link}
                      to={`/users/${userCreated}`}
                      color="primary"
                      className={classes.typography}
                    >
                      @{userCreated}
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
