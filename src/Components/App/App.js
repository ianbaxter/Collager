import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const api = "https://accounts.spotify.com/authorize";
  const redirectUri =
    process.env.NODE_ENV !== "production"
      ? "http://localhost:3000/redirect"
      : process.env.REACT_APP_REDIRECT_URI;
  const scopes = ["user-top-read"];

  console.log(process.env.REACT_APP_REDIRECT_URI);

  const [token, setToken] = useState(null);
  const [imgUrls, setImgUrls] = useState([]);

  useEffect(() => {
    if (window.location.hash) {
      // After spotify authorization get hash from response
      let hash = window.location.hash.substring(1).split("&");
      let token = hash[0].split("=")[1];
      if (token) {
        // Set the token and fetch data
        setToken(token);
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
      window.location.hash = "";
    }
  }, []);

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
            href={`${api}?client_id=${
              process.env.REACT_APP_CLIENT_ID
            }&redirect_uri=${redirectUri}&scope=${scopes.join(
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
            {imgUrls.map((imgUrl) => (
              <div className="artist-container">
                <img src={imgUrl} />
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
};

export default App;
