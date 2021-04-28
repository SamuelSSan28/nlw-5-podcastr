import Image from 'next/image';
import { useContext,useRef,useEffect, useState } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'
import { faIR } from 'date-fns/locale';
import { covertDurationToTimeString } from '../../utils/covertDurationToTimeString';


export default function Player(){
    const { espisodeList, 
            currentEdpisodeIndex,
            isPlaying,
            togglePlay,
            setPlayingState ,
            playNext,
            playPrevious,
            hasPrevious,
            hasNext,
            isLooping,
            toggleLoop,
            isShuffling,
            toggleShuffle,
            clearPlayerState
        } = useContext(PlayerContext); 

    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
      if(audioRef.current){
          if(isPlaying){
            audioRef.current.play()
          }else{
            audioRef.current.pause()
          }
      }else 
        return;

    }, [isPlaying])

    const episode = espisodeList[currentEdpisodeIndex];

    function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate',() => setProgress(Math.floor(audioRef.current.currentTime)))
    }

    function handleSeek(amount:number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleShuffle(amount:number){
        if(hasNext && isShuffling)
            playNext()
        else{
            clearPlayerState()
        }
    }

    return(
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora {episode?.title}</strong>
            </header>

            {episode ? 
                <div className={styles.currentEpisode}> 
                    <Image  
                        width={592} 
                        height={592}  
                        src={episode.thumbnail} 
                        objectFit="cover"
                    />

                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
                :
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcas para ouvir</strong>
                </div>
            }

            <footer className={episode ? '':styles.empty}>
                <div className={styles.progress}> 
                    <span>
                    {covertDurationToTimeString(progress)}
                    </span>

                    <div className={styles.slider}> 
                        {episode ?
                            <Slider 
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{backgroundColor:'#04d361'}}
                                railStyle={{backgroundColor:'#9f75ff'}}
                                handleStyle={{borderColor:'#04d361',borderWidth:4 }}
                            />
                            :
                            <div className={styles.emptySlider} /> 
                        } 
                    </div>
                    
                    <span>
                        {covertDurationToTimeString(episode?.duration ?? 0 )}
                    </span>
                </div>
 
                {episode && (
                    <audio 
                        autoPlay 
                        src={episode.url} 
                        ref={audioRef} 
                        loop={isLooping}
                        onEnded={playNext}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    />
                )}

                <div className={styles.buttons}>  
                    <button 
                        type="button" 
                        disabled={!episode || espisodeList.length == 1}
                        onClick={toggleShuffle}
                        className={isShuffling?styles.isActive : ""}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>

                    <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
                        <img src="/play-previous.svg" alt="Tocar Anterior"/>
                    </button>

                    <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
                        { isPlaying?
                            <img src="/pause.svg" alt="Pausar"/>
                            :
                            <img src="/play.svg" alt="Tocar"/>
                        }
                    </button>

                    <button type="button" disabled={!episode || !hasNext} onClick={playNext} >
                        <img src="/play-next.svg" alt="Tocar Próxima" />
                    </button>

                    <button 
                        type= "button" 
                        disabled={!episode } 
                        onClick={toggleLoop}
                        className={isLooping?styles.isActive : ""}
                    >
                        <img src="/repeat.svg" alt="Repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    )

}