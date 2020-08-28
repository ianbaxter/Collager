import React, { useState, useEffect } from "react";
import "./App.css";
import Cutout from "../Cutout/Cutout";

const App = () => {
  const api = "https://accounts.spotify.com/authorize";
  const ClientID = "87c75803145f4e2899fac3058de2699c";
  const redirectUri = "http://localhost:3000/redirect";
  const scopes = ["user-top-read"];

  const [token, setToken] = useState(null);
  const [imgUrls, setImgUrls] = useState([]);

  useEffect(() => {
    if (window.location.hash) {
      // After spotify authorization get hash from response
      let hash = window.location.hash.substring(1).split("&");
      let accessToken = hash[0].split("=")[1];
      if (accessToken) {
        // Set the token
        setToken(accessToken);
        accessSpotifyApi(accessToken);
      }
      window.location.hash = "";
    }
  }, []);

  function accessSpotifyApi(token) {
    fetch(
      "https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        let myFavArtistsImgUrls = [];
        data.items.forEach((artist) => {
          myFavArtistsImgUrls.push(artist.images[0].url);
        });

        setImgUrls(myFavArtistsImgUrls);
      })
      .catch((err) => console.error(err));
  }

  function shuffleImgUrls() {
    let shuffledImgUrls = [...imgUrls];
    for (let i = shuffledImgUrls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledImgUrls[i], shuffledImgUrls[j]] = [
        shuffledImgUrls[j],
        shuffledImgUrls[i],
      ];
    }

    setImgUrls(shuffledImgUrls);
  }

  return (
    <div className="app">
      {!token && (
        <main className="login-container">
          <p>
            Make a barcode collage of your favourite artists, because why not.
          </p>
          <a
            className="spotify-btn"
            href={`${api}?client_id=${ClientID}&redirect_uri=${redirectUri}&scope=${scopes.join(
              "%20"
            )}&response_type=token&show_dialog=true`}
          >
            Login With Spotify
          </a>
        </main>
      )}
      {token && (
        <main className="authorized-container">
          <header>
            <button className="spotify-btn" onClick={shuffleImgUrls}>
              Reorder
            </button>
          </header>
          <div className="collage-container">
            <Cutout imgUrls={imgUrls} />
          </div>
        </main>
      )}
    </div>
  );
};

export default App;
