import { createContext,useState,ReactNode, useContext } from 'react';


type Episode = {
    title:string;
    members:string;
    thumbnail:string;
    duration:number;
    url:string;
}

type PlayerContextData = {
    espisodeList: Episode[];
    currentEdpisodeIndex:number;
    isPlaying:boolean;
    isLooping:boolean;
    isShuffling:boolean;
    hasNext:boolean;
    hasPrevious:boolean;
    play:(episode:Episode) => void ;
    setPlayingState:(state:boolean) => void;
    togglePlay:() => void;
    toggleShuffle:() => void;
    toggleLoop:() => void;
    playNext:() => void;
    clearPlayerState:() => void;
    playPrevious:() => void;
    playlist:(list:Episode[],index:number) => void; 
}

export const PlayerContext = createContext( {} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({children}){
    const [espisodeList, setEspisodeList] = useState([]);
    const [currentEdpisodeIndex, setCurrentEdpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
  
    function play (episode:Episode){
      setEspisodeList([episode]);
      setCurrentEdpisodeIndex(0);
      setIsPlaying(true);
    }

    function clearPlayerState(){
      setEspisodeList([]);
      setCurrentEdpisodeIndex(0);
      setIsPlaying(false);
    }

    function toggleShuffle(){
      setIsShuffling(!isShuffling)
    }

    const hasNext = (currentEdpisodeIndex + 1) < espisodeList.length; 
    const hasPrevious = currentEdpisodeIndex  > 0; 

    function playNext (){
      if(isShuffling){
        const randomEpisodeIndex = Math.floor(Math.random() * espisodeList.length);
        setCurrentEdpisodeIndex(randomEpisodeIndex)
      }else if(hasNext)
        setCurrentEdpisodeIndex(currentEdpisodeIndex +1);
    }

    function playPrevious (){
      if(hasPrevious)
        setCurrentEdpisodeIndex(currentEdpisodeIndex -1);
    }
   
    function togglePlay( ){
      setIsPlaying(!isPlaying)
    }
    
    function toggleLoop( ){
      setIsLooping(!isLooping)
    }

    function setPlayingState(state:boolean){
      setIsPlaying(state)
    }

    function playlist(list:Episode[],index:number){
      setEspisodeList(list);
      setCurrentEdpisodeIndex(index)
    }


    return(
        <PlayerContext.Provider value={{
          espisodeList,
          currentEdpisodeIndex,
          play,
          isPlaying,
          togglePlay,
          setPlayingState,
          playlist,
          playPrevious,
          playNext,
          hasNext,
          hasPrevious,
          isLooping,
          toggleLoop,
          isShuffling,
          toggleShuffle,
          clearPlayerState
        }}>
             {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}