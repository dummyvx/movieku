import { useState, createContext, Context, ReactNode } from "react";
import { APIResponse, Movie } from "../types";

const initValue = { data: [], info: { allPage: 0, nextURL: "", page: 0 } };

type Response = APIResponse<Array<Movie>>;
const movieState = () => {
  const [movies] = useState<Response | undefined>(initValue);
  const [bluray] = useState<Response | undefined>(initValue);
  const [movie] = useState<Movie | null>();
  const [trendingMovies] = useState<Response | undefined>(undefined);

  const addMovies = (_newMovies: Array<Movie>): void => {};
  const addBluray = (_newMovies: Array<Movie>): void => {};
  const setCurrentMovie = (_newMovie: Movie): void => {};
  const addTrendingMovies = (_newMovies: Array<Movie>): void => {};

  return {
    movie,
    setCurrentMovie,
    movies,
    trendingMovies,
    addMovies,
    addTrendingMovies,
    bluray,
    addBluray,
  };
};
export type TypeMovieState = ReturnType<typeof movieState>;

export const MovieContext = createContext<TypeMovieState | null>(
  null
) as Context<TypeMovieState>;

const MovieContextProvider = ({
  children,
  movieResponse,
  trendingMovies,
  blurayMovies,
  movie,
}: {
  children: ReactNode;
  movieResponse?: Response;
  trendingMovies?: Response;
  blurayMovies?: Response;
  movie?: Movie;
}) => {
  const [movies, setMovies] = useState<Response | undefined>(movieResponse);
  const [bluray, setBluray] = useState<Response | undefined>(blurayMovies);
  const [_movie, set_Movie] = useState<Movie | undefined>(movie);
  const [_trendingMovies, setTrendingMovies] = useState<Response | undefined>(
    trendingMovies
  );

  const addMovies = (newMovies: Array<Movie>): void => {
    setMovies((prev) => ({
      ...(prev ?? initValue),
      data: [...(prev?.data ?? []), ...newMovies],
    }));
    return;
  };

  const setCurrentMovie = (newMovie: Movie): void => {
    set_Movie((prev) => ({ ...(prev ?? {}), ...newMovie }));
    return;
  };

  const addTrendingMovies = (newMovies: Array<Movie>): void => {
    setTrendingMovies((prev) => ({
      ...(prev ?? initValue),
      data: [...(prev?.data ?? []), ...newMovies],
    }));
    return;
  };

  const addBluray = (newMovies: Array<Movie>): void => {
    setBluray((prev) => ({
      ...(prev ?? initValue),
      data: [...(prev?.data ?? []), ...newMovies],
    }));
    return;
  };

  return (
    <MovieContext.Provider
      value={{
        movie,
        setCurrentMovie,
        movies,
        addMovies,
        trendingMovies: _trendingMovies,
        addTrendingMovies,
        bluray,
        addBluray,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export default MovieContextProvider;
