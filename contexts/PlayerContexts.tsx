import { createContext, useState, ReactNode, useContext } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: Number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  playList: (list: Episode[], index: number) => void;
  play: (episode: Episode) => void;
  playNext: () => void;
  playPrevius: () => void;
  setPlayingState: (state: boolean) => void;
  hasNext: boolean;
  hasPrevius: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
};

export function PlayerContextProvider({
  children,
}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);



  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length;
  const hasPrevius = currentEpisodeIndex > 0;

  function playNext() {
    if (isShuffling){
        const nextRandomEpisodeIndex = Math.floor(Math.random()*episodeList.length)
        setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    }else if (hasNext) {
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevius() {
    if (hasPrevius) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        isPlaying,
        isLooping,
        isShuffling,
        playList,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevius,
        hasNext,
        hasPrevius,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  return useContext(PlayerContext);
};
