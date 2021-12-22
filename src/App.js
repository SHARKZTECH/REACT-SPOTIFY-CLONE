import './App.css';
import Login from './Login';
import { useEffect ,useState} from 'react';
import {getTokenFromUrl} from "./spotify"
import SpotifyWebApi from "spotify-web-api-js";

import {useDataLayerValue} from "./DataLayer";

import Player from './Player';

const spotify=new SpotifyWebApi();

function App() {
  const [{user,token},dispatch]=useDataLayerValue();
   
  useEffect(()=>{
    //set token
    const hash=getTokenFromUrl()
    window.location.hash="";
    const _token=hash.access_token;

    if(_token){
      dispatch({
        type: "SET_TOKEN",
        token: _token,
      });

      spotify.setAccessToken(_token);
      spotify.getMe().then(user=>{
        dispatch({
          type:'SET_USER',
          user:user,
        })
      });
     

    

      spotify.getPlaylist("37i9dQZEVXcJZyENOWUFo7").then((response) =>
      dispatch({
        type: "SET_DISCOVER_WEEKLY",
        discover_weekly: response,
      })
    );

    
    spotify.getMyTopArtists().then((response) =>
    dispatch({
      type: "SET_TOP_ARTISTS",
      top_artists: response,
    })
  );

  dispatch({
    type: "SET_SPOTIFY",
    spotify: spotify,
  });

  spotify.getMe().then((user) => {
    dispatch({
      type: "SET_USER",
      user:user,
    });
  });

  spotify.getUserPlaylists().then((playlists) => {
    dispatch({
      type: "SET_PLAYLISTS",
      playlists,
    });
  });

  
    }
  },[token,dispatch]);

 console.log("user "+user)
 console.log("token "+token)
  return (
    <div className="App">
      {
        token ? (
          <Player spotify={spotify}/>
        ):(
          <Login />
        )       
       
      }
    </div>
  );
}

export default App;
