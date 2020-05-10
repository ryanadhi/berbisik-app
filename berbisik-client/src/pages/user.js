import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// Mui
import Grid from "@material-ui/core/Grid";

// Components
import Whisper from "../components/whisper/Whisper";
import StaticProfile from "../components/profile/StaticProfile";
import WhisperSkeleton from "../utils/WhisperSkeleton";
import ProfileSkeleton from "../utils/ProfileSkeleton";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../redux/actions/dataAction";

export default function User(props) {
  const dispatch = useDispatch();
  const { whispers, dataLoading } = useSelector((state) => state.data);
  const [profile, setProfile] = React.useState(null);
  const [whisperIdParam, setWhisperIdParam] = React.useState(null);
  const { username, whisperId } = useParams();

  React.useEffect(() => {
    if (whisperId) {
      setWhisperIdParam(whisperId);
    }
    dispatch(getUserData(username));
    axios
      .get(`/users/${username}`)
      .then(({ data }) => {
        setProfile(data.user);
      })
      .catch((err) => console.log(err));
  }, [whisperId]);

  const whispersMarkup = dataLoading ? (
    <WhisperSkeleton />
  ) : whispers.length === 0 ? (
    <p>No bisikan from this user</p>
  ) : !whisperIdParam ? (
    whispers.map((whisper) => (
      <Whisper key={whisper.whisperId} whisper={whisper} />
    ))
  ) : (
    whispers.map((whisper) => {
      if (whisper.whisperId !== whisperIdParam)
        return <Whisper key={whisper.whisperId} whisper={whisper} />;
      else
        return (
          <Whisper
            key={whisper.whisperId}
            whisper={whisper}
            openDialog={true}
          />
        );
    })
  );

  return (
    <Grid container spacing={2}>
      <Grid item sm={4} xs={12}>
        {profile ? <StaticProfile profile={profile} /> : <ProfileSkeleton />}
      </Grid>
      <Grid item sm={8} xs={12}>
        {whispersMarkup}
      </Grid>
    </Grid>
  );
}
