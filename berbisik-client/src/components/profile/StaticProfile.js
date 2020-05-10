import React from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

// MUI
import { makeStyles } from "@material-ui/core/styles";
import MuiLink from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";

const useStyles = makeStyles({
  button: {
    marginTop: 20,
    position: "relative",
  },
  paper: {
    padding: 20,
  },
  profile: {
    "& .image-wrapper": {
      textAlign: "center",
      position: "relative",
      "& button": {
        position: "absolute",
        top: "80%",
        left: "70%",
      },
    },
    "& .profile-image": {
      width: 200,
      height: 200,
      objectFit: "cover",
      maxWidth: "100%",
      borderRadius: "50%",
    },
    "& .profile-details": {
      textAlign: "center",
      "& span, svg": {
        verticalAlign: "middle",
      },
      "& a": {
        color: "#00bcd4",
      },
    },
    "& hr": {
      border: "none",
      margin: "0 0 10px 0",
    },
    "& svg.button": {
      "&:hover": {
        cursor: "pointer",
      },
    },
  },
  buttons: {
    textAlign: "center",
    "& a": {
      margin: "20px 10px",
    },
  },
});

export default function StaticProfile({ profile }) {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <img src={profile.imageUrl} alt="profile" className="profile-image" />
        </div>
        <hr />
        <div className="profile-details">
          <MuiLink
            component={Link}
            to={`/users/${profile.username}`}
            color="primary"
            variant="h5"
          >
            @{profile.username}
          </MuiLink>
          <hr />
          {profile.bio && (
            <Typography variant="body2">{profile.bio}</Typography>
          )}
          <hr />
          {profile.location && (
            <React.Fragment>
              <LocationOn color="primary" /> <span>{profile.location}</span>
              <hr />
            </React.Fragment>
          )}
          {profile.website && (
            <React.Fragment>
              <LinkIcon color="primary" />
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                {profile.website}
              </a>
              <hr />
            </React.Fragment>
          )}
          <CalendarToday color="primary" />{" "}
          <span>Joined {dayjs(profile.createdAt).format("MMM YYYY")}</span>
        </div>
      </div>
    </Paper>
  );
}
