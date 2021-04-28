import {GetStaticProps} from 'next'
import Image from 'next/image'
import Head from 'next/head'
import { api } from '../services/api'
import {format,parseISO} from 'date-fns'
import ptBr from 'date-fns/locale/pt-BR'
import { covertDurationToTimeString } from '../utils/covertDurationToTimeString'
import styles from './home.module.scss'
import Link  from 'next/Link'
import { usePlayer } from '../contexts/PlayerContext'
import Header from '../components/Header'

type Episode = {
    id:string;
    title:string;
    members:string;
    thumbnail:string;
    published_at:string;
    publishedAt:string,
    duration:number,
    durationAsString:string,
    url:string
}

type Homeprops ={
  episodes: Episode[]
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({latestEpisodes,allEpisodes,episodes}:Homeprops) {

  const {playlist} = usePlayer();

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home - Podcastr</title>
      </Head>
       <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode, index) => (
            <li key={episode.id}>
              <Image 
                width={192}
                height={192}
                src={episode.thumbnail} 
                alt={episode.title}
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <Link href={"/episodes/"+episode.id} >
                  {episode.title}
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button type="button" onClick={() => playlist(episodes,index)}>
                <img src="/play-green.svg" alt="Tocar episódio"/>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
            <h2 > Todos os episódios</h2>

            <table cellSpacing={0}> 
              <thead>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </thead>

              <tbody>
                {
                  allEpisodes.map((episode,index )=> {
                      return (
                        <tr key={episode.id}>
                          <td style={{width:120}}>
                            <Image 
                              width={192}
                              height={142}
                              src={episode.thumbnail} 
                              alt={episode.title}
                              objectFit="cover"
                            />
                          </td>
                          <td>
                            <Link href={"/episodes/"+episode.id} >
                              {episode.title}
                            </Link>
                          </td>
                          <td>
                            {episode.members}
                          </td>
                          <td style={{width:100}}>
                            {episode.publishedAt}
                          </td>
                          <td>
                            {episode.durationAsString}
                          </td>
                          <td> 
                            <button type="button" onClick={() => playlist(episodes,index + latestEpisodes.length)}>
                              <img src="/play-green.svg" alt="Tocar episódio"/>
                            </button>
                          </td>
                        </tr> 
                      )
                  })
                }
              </tbody>

            </table>
      </section>

      
    </div>
  )
}


export const getStaticProps:GetStaticProps = async () => {
  const {data} =  await api("episodes",{
    params:{
      _limit:"12",
      _sort:"published_at",
      _order:"desc"
    }
  });

  const episodes = data.map(episode => {
    return {
      ...episode,
      publishedAt:format(parseISO(episode.published_at),"d MMM yy",{locale:ptBr}),
      duration:episode.file.duration,
      durationAsString:covertDurationToTimeString(Number(episode.file.duration)),
      url:episode.file.url,

    }
  })

  return {
    props:{
      episodes,
      latestEpisodes:episodes.slice(0,2),
      allEpisodes:episodes.slice(2,episodes.lenght),
      
    },
    revalidate:60*60*8
  }
}
