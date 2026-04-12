import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';

const SongContext = createContext();

export const SongProvider = ({ children }) => {

    const [song, setSong] = useState([]);
    const [Videosong, setVideoSong] = useState([]);
    const [loading, setLoading] = useState(false);
    const [songLoading, setSongLoading] = useState(true);
    const [album, setAlbum] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [singlesong, setSingleSong] = useState([]);
    const [index, setIndex] = useState(0);
    const [albumSong, setAlbumSong] = useState([]);
    const [albumData, setAlbumData] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const [volume, setVolume] = useState(1);
      const [bgcolor, setBgColor] = useState("#000000")
      const [progress, setProgress] = useState(0);
        const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const intervalRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSongs, setFilteredSongs] = useState([]);
 
    async function fetchSong() {
        try {
            const { data } = await axios.get("/api/song/all");
            setSong(data);
            setSelectedSong(data[0]._id);
            setIsPlaying(false);
        } catch (error) {
            // console.log(error);

        }
    }

    async function fetchVideoSong () {
        try {
            const { data } = await axios.get("/api/video/all");
            setVideoSong(data);
            // setSelectedSong(data[0]._id);
            setIsPlaying(false);
        } catch (error) {
            // console.log(error);

        }
    }

    async function likeVideo(videoId) {
        try {
            const { data } = await axios.post(`/api/video/${videoId}/like`);
            toast.success(data.message);
            fetchVideoSong(); 
        } catch (error) {
            console.log(error.response?.data?.message || error.message);
        }
    }

    async function dislikeVideo(videoId) {
        try {
            const { data } = await axios.post(`/api/video/${videoId}/dislike`);
            fetchVideoSong(); 
        } catch (error) {
            console.log(error.response?.data?.message || error.message);
        }
    }
    

    async function fetchSingleSong() {
        try {
            const { data } = await axios.get("/api/song/single/" + selectedSong);
            setSingleSong(data);
        } catch (error) {
            // console.log(error);
        }
    }

    async function addAlbum(formData, setTitle, setDescription, setFile) {
        setLoading(true)
        try {
            const { data } = await axios.post("/api/song/album/new", formData);
            toast.success(data.message);
            setLoading(false);
            fetchAlbums();
            setTitle("");
            setDescription("");
            setFile(null);
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
        }
    }

    async function addSong(formData, setTitle, setDescription, setFile, setSinger, setAlbum, setvisibleThumbnail) {
        setLoading(true)
        try {
            const { data } = await axios.post("/api/song/new", formData);
            toast.success(data.message);
            setLoading(false);
            fetchSong();
            setTitle("");
            setDescription("");
            setFile(null);
            setvisibleThumbnail(true);
            setSinger("");
            setAlbum("");
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
        }
    }

    async function addThumbnail(id, formData, setFile, setvisibleThumbnail) {
        setLoading(true)
        try {
            const { data } = await axios.post("/api/song/" + id, formData);
            toast.success(data.message);
            setLoading(false);
            fetchSong();
            setFile(null);
            setvisibleThumbnail(false);
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
        }
    }

    //video upload
    async function addVideoSong(formData, setDescription, setFile) {
        setLoading(true)
        try {
            const { data } = await axios.post("/api/video/videos", formData);
            toast.success(data.message);
            setLoading(false);
            fetchSong();
            setDescription("");
            setFile(null);
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
        }
    }

    async function addVideoThumbnail(id, formData, setFile) {
        setLoading(true)
        try {
            const { data } = await axios.post("/api/video/" + id, formData);
            toast.success(data.message);
            setLoading(false);
            fetchSong();
            setFile(null);
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
        }
    }

    async function fetchAlbums() {
        try {
            const { data } = await axios.get("/api/song/album/all");
            setAlbum(data);
        } catch (error) {
            console.log(error);

        }
    }

    async function deleteSong(id) {
        try {
            const { data } = await axios.delete("/api/song/" + id);
            toast.success(data.message);
            fetchSong();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function deleteAlbum(id) {
        try {
            const { data } = await axios.delete("/api/song/delete/" + id);
            toast.success(data.message);
            fetchAlbums();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchSong();
        fetchAlbums();
        fetchVideoSong();
    },[]);

    function nextMusic() {
        if (index === song.length - 1) {
            setIndex(0);
            setSelectedSong(song[0]._id);
        } else {
            setIndex(index + 1);
            setSelectedSong(song[index + 1]._id);
        }
    }

    function previousMusic() {
        if (index === 0) {
            return null;
        } else {
            setIndex(index - 1);
            setSelectedSong(song[index - 1]._id);
        }
    }

    async function fetchAlbumSong(id) {
        try {
            const { data } = await axios.get("/api/song/album/" + id);
            setAlbumSong(data.songs);
            setAlbumData(data.album);
        } catch (error) {
            console.log(error);
        }
    }

    const handlePlayPause = () => {
        if (isPlaying) {
          audioRef.current.pause();
          setBgColor("#000000")
        } 
        else {
          audioRef.current.play()
        }
        setIsPlaying(!isPlaying);
      }

      const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
      };

      const generateRandomColor = () => {
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        setBgColor(randomColor);
      }; 

       useEffect(() => {
          const audio = audioRef.current;
          if (!audio) {
            return;
          }
      
          const handleLoadedMetaData = () => {
            setDuration(audio.duration);
          };
      
          const handleTimeUpdate = () => {
            setProgress(audio.currentTime);
          };
      
          audio.addEventListener("loadedmetadata", handleLoadedMetaData);
          audio.addEventListener("timeupdate", handleTimeUpdate);
      
          return () => {
            audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
          };
        }, [singlesong]);

        const handleProgressChange = (e) => {
            const newTime = (e.target.value / 100) * duration;
            audioRef.current.currentTime = newTime;
            setProgress(newTime);
          };

          useEffect(() => {
              if (isPlaying) {
                intervalRef.current = setInterval(generateRandomColor, 2000);
              } else {
                clearInterval(intervalRef.current);
              }
          
              return () => clearInterval(intervalRef.current);
            }, [isPlaying]);


    return <SongContext.Provider value={{
        song,
        addAlbum,
        loading,
        songLoading,
        album,
        addSong,
        addThumbnail,
        deleteSong,
        fetchSingleSong,
        singlesong,
        selectedSong,
        setSelectedSong,
        isPlaying,
        setIsPlaying,
        nextMusic,
        previousMusic,
        fetchAlbumSong,
        albumData,
        albumSong,
        fetchSong,
        fetchAlbums,
        deleteAlbum,
        Videosong,
        addVideoSong,
        selectedVideo, 
        setSelectedVideo,
        isMinimized, 
        setIsMinimized,
        fetchVideoSong,
        addVideoThumbnail,
        likeVideo,
        dislikeVideo,
        handlePlayPause,
        audioRef,
        volume,
        setVolume,
        bgcolor,
        setBgColor,
        handleVolumeChange,
        generateRandomColor,
        progress,
        setProgress,
        duration,
        setDuration,
        handleProgressChange,
        searchQuery, 
        setSearchQuery,
        filteredSongs,
        setFilteredSongs
    }}>
        {children}
    </SongContext.Provider>
};

export const SongData = () => useContext(SongContext);