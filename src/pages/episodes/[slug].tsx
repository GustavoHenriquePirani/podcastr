import { useRouter } from "next/router";
import styles from "./episode.module.scss";
import { GetStaticProps } from "next";
import {format, parseISO} from 'date-fns';
import { ptBR } from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  pusblishedAt: string;
  duration: Number;
  durationAsString: string;
  url: string;
  description: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }): EpisodeProps {
  return(
    <h1>{episode.title}</h1>
  )
} 

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: episode.members,
    pusblishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {
        episode,
    },
    revalidate: 60 * 60 * 24, //24 horas
  };
};
