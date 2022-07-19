import { useCallback, useEffect, useState } from "react";
import { MovieCard } from "./MovieCard";
import { api } from '../services/api';
import { GenreResponseProps } from "./SideBar";
import { Header } from "./Header";

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}


interface ContentProps {
  selectedGenreId: number

}
export function Content(props: ContentProps) {
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  const getGenres = useCallback(() => {
    api.get<GenreResponseProps>(`genres/${props.selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }, [props.selectedGenreId]);
  const getMovies = useCallback(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${props.selectedGenreId}`).then(response => {
      setMovies(response.data);
    });
  }, [props.selectedGenreId])

  useEffect(() => {
    getGenres();
    getMovies();
    return () => { setMovies([]); setSelectedGenre({} as GenreResponseProps) }
  }, [props.selectedGenreId]);

  return (
    <div className="container">
      <Header
        title={selectedGenre.title}
      />
      <main>
        <div className="movies-list">
          {movies.map(movie => (
            <MovieCard
              key={movie.imdbID}
              title={movie.Title}
              poster={movie.Poster}
              runtime={movie.Runtime}
              rating={movie.Ratings[0].Value}
            />
          ))}
        </div>
      </main>
    </div>
  )
}