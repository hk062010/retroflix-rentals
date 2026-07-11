import { createServerFn } from "@tanstack/react-start";

export type TmdbMovie = {
  id: string;
  title: string;
  year: number;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  rating: number;
  genre: string;
  runtime?: string;
  certification?: string;
};

const IMG = (size: string, path?: string | null) =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

function tmdbFetch(token: string) {
  const isBearer = token.length > 60; // v4 read-access tokens are long JWTs
  return async (path: string) => {
    const sep = path.includes("?") ? "&" : "?";
    const url = `https://api.themoviedb.org/3${path}${isBearer ? "" : `${sep}api_key=${token}`}`;
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        ...(isBearer ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error(`TMDb ${res.status}: ${await res.text()}`);
    return res.json() as Promise<any>;
  };
}

export const getHomeSections = createServerFn({ method: "GET" }).handler(async () => {
  const token = process.env.TMDB_API_TOKEN;
  if (!token) throw new Error("TMDB_API_TOKEN is not configured");
  const get = tmdbFetch(token);

  const [now, top, popular, genresRes] = await Promise.all([
    get("/movie/now_playing?language=en-US&page=1&region=US"),
    get("/movie/top_rated?language=en-US&page=1"),
    get("/movie/popular?language=en-US&page=1"),
    get("/genre/movie/list?language=en"),
  ]);

  const genreMap = new Map<number, string>();
  for (const g of genresRes.genres ?? []) genreMap.set(g.id, g.name);

  const map = (m: any): TmdbMovie => ({
    id: String(m.id),
    title: m.title ?? m.name ?? "Untitled",
    year: m.release_date ? Number(String(m.release_date).slice(0, 4)) : 0,
    overview: m.overview ?? "",
    poster: IMG("w342", m.poster_path),
    backdrop: IMG("w780", m.backdrop_path),
    rating: Number(m.vote_average ?? 0),
    genre: (m.genre_ids ?? []).map((id: number) => genreMap.get(id)).filter(Boolean)[0] ?? "Movie",
  });

  const featuredSrc = (now.results ?? []).find((m: any) => m.backdrop_path) ?? now.results?.[0];
  return {
    featured: map(featuredSrc),
    newReleases: (now.results ?? []).slice(1, 7).map(map) as TmdbMovie[],
    topRentals: (top.results ?? []).slice(0, 6).map(map) as TmdbMovie[],
    recommended: (popular.results ?? []).slice(0, 6).map(map) as TmdbMovie[],
  };
});

export const getTmdbMovie = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => ({ id: String(data.id) }))
  .handler(async ({ data }) => {
    const token = process.env.TMDB_API_TOKEN;
    if (!token) throw new Error("TMDB_API_TOKEN is not configured");
    const get = tmdbFetch(token);
    const m = await get(`/movie/${data.id}?language=en-US&append_to_response=release_dates`);
    const usRelease = (m.release_dates?.results ?? []).find((r: any) => r.iso_3166_1 === "US");
    const cert = (usRelease?.release_dates ?? []).map((r: any) => r.certification).find((c: string) => c) ?? "";
    const movie: TmdbMovie = {
      id: String(m.id),
      title: m.title,
      year: m.release_date ? Number(String(m.release_date).slice(0, 4)) : 0,
      overview: m.overview ?? "",
      poster: IMG("w500", m.poster_path),
      backdrop: IMG("w1280", m.backdrop_path),
      rating: Number(m.vote_average ?? 0),
      genre: (m.genres ?? []).map((g: any) => g.name)[0] ?? "Movie",
      runtime: m.runtime ? `${m.runtime} min` : undefined,
      certification: cert || undefined,
    };
    return movie;
  });
