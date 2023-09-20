import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import Swal from 'sweetalert2';
import './App.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playlistId, setPlaylistId] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaylistLoaded, setIsPlaylistLoaded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputValues, setInputValues] = useState('');

  useEffect(() => {
    if (isPlaylistId(inputValue)) {
      // Handle Playlist ID
      setPlaylistId(inputValue);
    } else {
      // Handle Video URL
      loadVideoFromUrl(inputValue);
    }
  }, [inputValue]);

  useEffect(() => {
    if (playlistId) {
      loadPlaylist();
    } else {
      setVideos([]);
      setSelectedVideo(null);
      setCurrentVideoIndex(0);
      setIsPlaylistLoaded(false);
    }
  }, [playlistId]);

  useEffect(() => {
    // When the currentVideoIndex changes, update the selected video
    if (currentVideoIndex >= 0 && currentVideoIndex < videos.length) {
      setSelectedVideo(videos[currentVideoIndex]);
    }
  }, [currentVideoIndex, videos]);

  const isPlaylistId = (input) => {
    // Detect if the input is a valid Playlist ID (custom validation logic)
    return input.startsWith('PL'); // Customize as needed
  };

  const loadVideoFromUrl = (url) => {
    const videoId = getVideoIdFromUrl(url);
    if (videoId) {
      setSelectedVideo({ snippet: { resourceId: { videoId } } });
      setCurrentVideoIndex(0); // Reset to the first video
    }
  };

  const loadPlaylist = async () => {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/playlistItems',
        {
          params: {
            part: 'snippet',
            maxResults: 50,
            playlistId: playlistId,
            key: 'AIzaSyCFqHns8z3rIscGBybgbfdTW0tKxqcHgac',
          },
        }
      );

      setVideos(response.data.items);
      if (response.data.items.length > 0) {
        setSelectedVideo(response.data.items[0]);
        setIsPlaylistLoaded(true);
      }
    } catch (error) {
      console.error('Error loading playlist:', error);
      // Add error handling here, e.g., display an error message to the user
    }
  };

  const handleVideoClick = (video) => {
    const index = videos.findIndex((v) => v.id === video.id);
    setSelectedVideo(video);
    setCurrentVideoIndex(index);
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      const nextVideoIndex = currentVideoIndex + 1;
      setSelectedVideo(videos[nextVideoIndex]);
      setCurrentVideoIndex(nextVideoIndex);
    }
  };

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      const previousVideoIndex = currentVideoIndex - 1;
      setSelectedVideo(videos[previousVideoIndex]);
      setCurrentVideoIndex(previousVideoIndex);
    }
  };

  const handleInfo = () => {
    Swal.fire({
      icon: 'question',
      title: 'How To Get Playlist ID',
      text: 'To get your Playlist ID, visit your YouTube playlist and copy the part after "list=" in the URL.',
      background: '#242424',
      color: 'white',
    });
  };

  const handleLoadVideo = () => {
    setSelectedVideo({ snippet: { resourceId: { videoId: getVideoIdFromUrl(inputValues) } } });
    setIsPlaylistLoaded(true)
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputChanges = (event) => {
    setInputValues(event.target.value);
  };

  const getVideoIdFromUrl = (url) => {
    const videoIdMatch = url.match(/(?:\?v=|\/embed\/|\/watch\?v=|\/\d{1,2}\/|\/vi\/)([^#\&\?]*).*/);
    return (videoIdMatch && videoIdMatch[1]) || '';
  };

  return (
    <div className="App">
      <h1>YouTube Music Player</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Playlist ID"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={loadPlaylist}>Load Playlist</button>

        <a style={{ cursor: 'pointer' }} onClick={handleInfo}>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="45" viewBox="0 0 24 24">
            <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"></path>
          </svg>
        </a>
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter YouTube Video URL"
          value={inputValues}
          onChange={handleInputChanges}
        />
        <button onClick={handleLoadVideo}>Play Video</button>

        <a style={{ cursor: 'pointer' }} onClick={handleInfo}>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="45" viewBox="0 0 24 24">
            <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 7 L 11 9 L 13 9 L 13 7 L 11 7 z M 11 11 L 11 17 L 13 17 L 13 11 L 11 11 z"></path>
          </svg>
        </a>
      </div>

      {isPlaylistLoaded ? (
        <div className="player-container">
          <div className="video-player">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${selectedVideo?.snippet.resourceId.videoId}`}
              controls
              width="900px"
              height="500px"
            />
          </div>

          <div className="playlist">
            
            <ul>
              {videos.map((video) => (
                <li
                  style={{ cursor: 'pointer', textAlign: 'left' }}
                  key={video.id}
                  onClick={() => handleVideoClick(video)}
                  className={
                    selectedVideo?.id === video.id ? 'selected' : ''
                  }
                >
                  {video.snippet.title}
                </li>
              ))}
            </ul>
            <div className="navigation-buttons">
              {currentVideoIndex > 0 && (
                <button onClick={handlePreviousVideo}>Previous</button>
              )}
              {currentVideoIndex < videos.length - 1 && (
                <button onClick={handleNextVideo}>Next</button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>Enter a Playlist ID or YouTube Video URL to load.</p>
      )}
    </div>
  );
}

export default App;
