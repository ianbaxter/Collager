import React, { useState, useEffect } from "react";
import $ from "jquery";
import "./Collager.css";
import Cutout from "../Cutout/Cutout";

const Collager = () => {
  const api = "https://accounts.spotify.com/authorize";
  const ClientID = "87c75803145f4e2899fac3058de2699c";
  const redirectUri = "http://localhost:3000/redirect";
  const scopes = ["user-top-read"];

  const [token, setToken] = useState(null);
  const [favArtistsNames, setFavArtistsNames] = useState([]);
  const [imgUrls, setImgUrls] = useState([]);

  useEffect(() => {
    if (window.location.hash) {
      // Get hash from response
      console.log("Getting hash from response");
      let hash = window.location.hash.substring(1).split("&");
      let accessToken = hash[0].split("=")[1];
      if (accessToken) {
        // Set the token
        console.log("Setting token to: " + accessToken);
        setToken(accessToken);
        accessSpotifyApi(accessToken);
      }
      window.location.hash = "";
    }
  }, []);

  function accessSpotifyApi(token) {
    console.log("Fetching spotify data");
    $.ajax({
      url:
        "https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term",
      headers: {
        Authorization: "Bearer " + token
      },
      success: data => {
        console.log("Succefully fetched spotify data");
        console.log(data);
        let myFavArtistsNames = [];
        let myFavArtistsImgUrls = [];
        data.items.forEach(artist => {
          myFavArtistsNames.push(artist.name);
          myFavArtistsImgUrls.push(artist.images[0].url);
        });

        setFavArtistsNames(myFavArtistsNames);
        setImgUrls(myFavArtistsImgUrls);
      }
    });
  }

  return (
    <div className="Collager-container">
      {!token && (
        <div className="login-container">
          <p>Make a collage of your favourite artists!</p>
          <a
            className="login-btn"
            href={`${api}?client_id=${ClientID}&redirect_uri=${redirectUri}&scope=${scopes.join(
              "%20"
            )}&response_type=token&show_dialog=true`}
          >
            Login With Spotify
          </a>
        </div>
      )}
      {token && (
        <div className="collage-container">
          <Cutout imgUrls={imgUrls} />{" "}
        </div>
      )}
    </div>
  );
};

export default Collager;