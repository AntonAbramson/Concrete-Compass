import React, { useContext } from "react";
import { GraphQLClient } from "graphql-request";
import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Paper } from "@material-ui/core";
import NoContent from "../Pin/NoContent";
import Blog from "../Blog";
import ReactMapGL from "react-map-gl";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import Context from "../../context";
import { ME_QUERY } from "../../graphql/queries";
import { BASE_URL } from "../../client";

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: idToken }
      });
      const { me } = await client.request(ME_QUERY);
      dispatch({ type: "LOGIN_USER", payload: me });
      dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn() });
    } catch (err) {
      onFailure(err);
    }

    //console.log({data})
  };

  const onFailure = err => {
    console.error("Error logging in", err);
    //dispatch({ type: "IS_LOGGED_IN", payload: false })
  };

  //From Map.js

  const mobileSize = useMediaQuery("(max-width: 650px)");

  const INITIAL_VIEWPORT = {
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 13
  };

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Typography
          component="h1"
          variant="h3"
          gutterBottom
          noWrap
          style={{ color: "rgb(66, 133, 234" }}
        >
          Concrete Compass
        </Typography>
        <GoogleLogin
          clientId="81044974359-kjscrdgddo7154o17pkjjf3a8ieegf9l.apps.googleusercontent.com"
          onSuccess={onSuccess}
          onFailure={onFailure}
          isSignedIn={true}
          buttonText="Login with Google"
          theme="dark"
        />
      </div>
      <div className={mobileSize ? classes.rootMobile : classes.root}>
        <ReactMapGL
          width="100vw"
          height="calc(100vh - 64px)"
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxApiAccessToken="pk.eyJ1IjoiZ3Blcm5vdiIsImEiOiJjanhkdWF0ZDcwaTYxM3ltdzdoZTM1dHJmIn0.a0H1kXNk5uWjAYz5SgtIQg"
        >
          {" "}
        </ReactMapGL>
        <Blog />
      </div>
    </React.Fragment>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
