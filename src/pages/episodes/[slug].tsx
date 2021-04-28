import {useRouter } from 'next/router'
import {GetStaticPaths, GetStaticProps} from 'next'
import Image from 'next/image'
import { api } from '../../services/api'
import {format,parseISO} from 'date-fns'
import ptBr from 'date-fns/locale/pt-BR'
import Head from "next/head";
import Link from "next/link";
import { covertDurationToTimeString } from '../../utils/covertDurationToTimeString'
import styles from './episode.module.scss'
import { usePlayer } from '../../contexts/PlayerContext'

type Episode = {
    id:string;
    title:string;
    members:string;
    thumbnail:string;
    published_at:string;
    description:string;
    publishedAt:string;
    duration:number;
    durationAsString:string;
    url:string;
}

type EpisodeProps ={
    episode:Episode;
}

export default function Episode({episode}:EpisodeProps) {
  const {play} = usePlayer();   

    return(
        <div className={styles.episode}>
          <Head>
        <title>{episode.title}</title>
      </Head>
        <Head>
          <title>{episode.title} | Podcastr</title>
        </Head>
  
        <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button>
              <img src="/arrow-left.svg" alt="Voltar"/>
            </button>
          </Link>

          <Image
            className="thumbnailImage"
            width={700}
            height={160}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <button onClick={() => play(episode)}>
            <img src="/play.svg" alt="Tocar episódio"/>
          </button>
        </div>
  
        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>
  
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{
            __html:
            episode.description
          }} 
        />
      </div>
    )

}

export const getStaticPaths:GetStaticPaths = async () => {

    return {
        paths:[],
        fallback:'blocking'
    }
}

export const getStaticProps:GetStaticProps = async (ctx) => {
    const {slug} = ctx.params;

    const {data} =  await api(`episodes/${slug}`);
  
    const episode = {
        ...data,
        publishedAt:format(parseISO(data.published_at),"d MMM yy",{locale:ptBr}),
        duration:data.file.duration,
        durationAsString:covertDurationToTimeString(Number(data.file.duration)),
        url:data.file.url, 
      }
  
    return {
      props:{
        episode
        
      },
      revalidate:60*60*24// 24 hours
    }
  }
  