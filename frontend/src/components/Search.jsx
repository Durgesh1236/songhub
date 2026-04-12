import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { SongData } from '../context/Song';
import Layout from './Layout';
import { FaMicrophone } from "react-icons/fa";
import { UserData } from '../context/User';

const Search = () => {
  
  const {song, 
    setSelectedSong, 
    setIsPlaying, fetchSong, searchQuery, setSearchQuery, filteredSongs, setFilteredSongs} = SongData();
  const { addToHistory } = UserData();

  // console.log(filteredSongs)

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
 
    if (query) {
      const results = song.filter((song) =>
        song.title.toLowerCase().includes(query.toLowerCase())
      ); 
      setFilteredSongs(results);
    } else {
      setFilteredSongs([]);
    }
  };

  const onclickHandler = (id) => {
    setSelectedSong(id);
    setIsPlaying(true);
    addToHistory(id);
  };

  const handleSearch = () => {
    if (searchQuery) {
      const results = song.filter((song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(results);
    } else {
      setFilteredSongs([]);
    }
  };

  const emptyHandler = () => {
    setFilteredSongs([]);
    setSearchQuery('');
  };

  const startVoiceSearch = () => {
    const userConfirmation = confirm("Speak Play and Your song name");
    if (!userConfirmation) return;

    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        alert('Voice recognition is not supported in this browser.');
        return;
    }

    
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-IN';
    recognition.interimResults = false; 
    recognition.maxAlternatives = 1; 

    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        let songName = transcript;

        if (transcript.startsWith("play ")) {
            songName = transcript.replace("play ", "").trim();
        }

        const speech = new SpeechSynthesisUtterance(`songhub play your song ${songName}`);
        speech.lang = 'en-IN';
        speech.rate = 0.9;
        speech.pitch = 1;
        const voices = window.speechSynthesis.getVoices();
        speech.voice = voices.find(voice => voice.name.includes("Female")) || voices[0];
        window.speechSynthesis.speak(speech);

        speech.onend = () => {
            setSearchQuery(songName);
            handleSearchChange({ target: { value: songName } });

            const spokenWords = songName.split(/\s+/);
            let bestMatch = null;
            let maxMatches = 0;

            song.forEach((s) => {
                const songTitleWords = s.title.toLowerCase().split(/\s+/);
                const matchingWords = spokenWords.filter(word => songTitleWords.includes(word)).length;

                if (matchingWords > maxMatches) {
                    maxMatches = matchingWords;
                    bestMatch = s;
                }
            });

            if (bestMatch) {
                setSelectedSong(bestMatch._id);
                setIsPlaying(true);
                addToHistory(bestMatch._id);
            } else {
                alert("Song not found! Please try again.");
            }
        };
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        alert('Error occurred in speech recognition. Please try again.');
    };

    recognition.onend = () => {
        console.log('Speech recognition ended.');
    };
};

  return (
    <Layout className="text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-full max-w-[90%] sm:max-w-[50%] overflow-hidden">
        <input
          className="flex-1 outline-none bg-inherit text-sm min-w-0"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <img
          onClick={handleSearch}
          className="w-4 cursor-pointer"
          src={assets.search_icon}
          alt="Search"
        />
        <p onClick={startVoiceSearch} className="inline w-4 cursor-pointer mx-2">
          <FaMicrophone />
        </p>
        <img
          onClick={emptyHandler}
          className="inline w-3 cursor-pointer ml-2"
          src={assets.cross_icon}
          alt="Close"
        />
      </div>

      {/* Display search results */}
      <div className="mt-4">
        {filteredSongs.length > 0 ? (
          <ul className="bg-black border rounded-md shadow-md p-3">
            {filteredSongs.map((item, index) => (
              <li
                key={index}
                className="text-white flex text-sm py-2 px-3 hover:bg-gray-700 rounded-md cursor-pointer"
                onClick={() => onclickHandler(item._id)}
              >
                <img src={item.thumbnail.url} className='w-9 mr-4' alt="" />
                <p className='pt-1'>{item.title}</p>
              </li>
            ))}
          </ul>
        ) : (
          searchQuery && <p className="text-gray-500 text-sm">No results found.</p>
        )}
      </div>
    </Layout>
  );
};

export default Search;