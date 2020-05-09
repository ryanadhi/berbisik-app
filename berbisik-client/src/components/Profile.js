import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

// Utils
import MyButton from "../utils/MyButton";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, uploadImage } from "../redux/actions/userAction";

// MUI
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import MuiLink from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

// Icons
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";

const useStyles = makeStyles({
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

export default function Profile() {
  const classes = useStyles();
  const {
    authenticated,
    credentials,
    likes,
    notifications,
    userLoading,
  } = useSelector((state) => state.user);

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    // const formData = new FormData();
    // formData.append('image', image, image.name);
    // this.props.uploadImage(formData);
  };
  const handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };
  let profileMarkUp = !userLoading ? (
    authenticated ? (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <input
              type="file"
              id="imageInput"
              hidden="hidden"
              onChange={handleImageChange}
            />
            <MyButton
              tip="Edit profile picture"
              onClick={handleEditPicture}
              btnClassName="button"
            >
              <EditIcon color="primary" />
            </MyButton>
            <img
              src={credentials.imageUrl}
              alt="profile"
              className="profile-image"
            />
          </div>
          <hr />
          <div className="profile-details">
            <MuiLink
              component={Link}
              to={`/users/${credentials.username}`}
              color="primary"
              variant="h5"
            >
              @{credentials.username}
            </MuiLink>
            <hr />
            {credentials.bio && (
              <Typography variant="body2">{credentials.bio}</Typography>
            )}
            <hr />
            {credentials.location && (
              <React.Fragment>
                <LocationOn color="primary" />{" "}
                <span>{credentials.location}</span>
                <hr />
              </React.Fragment>
            )}
            {credentials.website && (
              <React.Fragment>
                <LinkIcon color="primary" />
                <a
                  href={credentials.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  {credentials.website}
                </a>
                <hr />
              </React.Fragment>
            )}
            <CalendarToday color="primary" />{" "}
            <span>
              Joined {dayjs(credentials.createdAt).format("MMM YYYY")}
            </span>
          </div>
        </div>
      </Paper>
    ) : (
      <Paper className={classes.paper}>
        <Typography variant="body2" align="center">
          No profile found, please login again
        </Typography>
        <div className={classes.buttons}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/login"
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/signup"
          >
            Signup
          </Button>
        </div>
      </Paper>
    )
  ) : (
    <p>loading,,</p>
  );
  return profileMarkUp;
}
