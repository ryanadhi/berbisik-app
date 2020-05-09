import React from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

import Whisper from "../components/Whisper";
import Profile from "../components/Profile";

export default function Home() {
  const [whispers, setWhispers] = React.useState([]);

  React.useEffect(() => {
    axios
      .get("/whispers")
      .then((result) => {
        setWhispers(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let showWhispers =
    whispers.length > 0 ? (
      whispers.map((whisper) => (
        <Whisper key={whisper.whisperId} whisper={whisper} />
      ))
    ) : (
      <p>loading..</p>
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
