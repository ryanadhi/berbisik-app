import React from "react";
import Grid from "@material-ui/core/Grid";

import Whisper from "../components/whisper/Whisper";
import Profile from "../components/profile/Profile";
import WhisperSkeleton from "../utils/WhisperSkeleton";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getWhispers } from "../redux/actions/dataAction";

export default function Home() {
  const dispatch = useDispatch();
  const { whispers, dataLoading } = useSelector((state) => state.data);
  React.useEffect(() => {
    dispatch(getWhispers());
  }, [dispatch]);

  let showWhispers = !dataLoading ? (
    whispers.map((whisper) => (
      <Whisper key={whisper.whisperId} whisper={whisper} />
    ))
  ) : (
    <WhisperSkeleton />
  );

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
        <Grid item sm={8} xs={12}>
          {showWhispers}
        </Grid>
      </Grid>
    </div>
  );
}
