import { useRouter } from "next/router";
import styles from "./episode.module.scss";
import { GetStaticProps } from "next";
import { GetStaticPaths } from "next";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import { api } from "../../services/api";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "../../../contexts/PlayerContexts";
import Head from "next/head";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: Number;
  durationAsString: string;
  url: string;
  description: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();

  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title}</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <button type="button">
          <Link href="/">
            <img src="/arrow-left.svg" alt="Voltar" />
            <img src="/arrow-left.svg" alt="Voltar" />
          </Link>
        </button>

        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          style={{ objectFit: "cover" }}
          alt="Imagem thumbnail"
        />
        <button
          className="playGreen"
          type="button"
          onClick={() => play(episode)}
        >
          <img src="/play.svg" alt="Tocar Episodio" />
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
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
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
