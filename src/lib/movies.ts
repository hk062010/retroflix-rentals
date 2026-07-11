export type Movie = {
  id: string;
  title: string;
  year: number;
  genre: string;
  rating: string;
  runtime: string;
  synopsis: string;
  color: string;
  emoji: string;
  featured?: boolean;
};

export const MOVIES: Movie[] = [
  { id: "1", title: "The Departed", year: 2006, genre: "Crime", rating: "R", runtime: "151 min", synopsis: "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in Boston.", color: "linear-gradient(135deg,#1a1a1a,#5a0000)", emoji: "🎬", featured: true },
  { id: "2", title: "Casino Royale", year: 2006, genre: "Action", rating: "PG-13", runtime: "144 min", synopsis: "James Bond's first mission as 007 leads him to Le Chiffre, banker to the world's terrorists.", color: "linear-gradient(135deg,#000428,#004e92)", emoji: "🎰" },
  { id: "3", title: "Pirates of the Caribbean: Dead Man's Chest", year: 2006, genre: "Adventure", rating: "PG-13", runtime: "151 min", synopsis: "Jack Sparrow races to recover the heart of Davy Jones to avoid enslaving his soul.", color: "linear-gradient(135deg,#4a3018,#8b6f47)", emoji: "🏴‍☠️" },
  { id: "4", title: "Shrek 2", year: 2004, genre: "Comedy", rating: "PG", runtime: "93 min", synopsis: "Shrek and Fiona travel to the Kingdom of Far Far Away to meet her parents.", color: "linear-gradient(135deg,#3a7a1a,#8bc34a)", emoji: "🧅" },
  { id: "5", title: "The Prestige", year: 2006, genre: "Drama", rating: "PG-13", runtime: "130 min", synopsis: "Two stage magicians engage in a bitter rivalry to create the ultimate stage illusion.", color: "linear-gradient(135deg,#2b0038,#7a4d99)", emoji: "🎩" },
  { id: "6", title: "Rush Hour", year: 1998, genre: "Comedy", rating: "PG-13", runtime: "98 min", synopsis: "A loyal Hong Kong detective teams up with a reckless LAPD detective to rescue a diplomat's daughter.", color: "linear-gradient(135deg,#c41e3a,#ff6b35)", emoji: "🚓" },
  { id: "7", title: "The Mask", year: 1994, genre: "Comedy", rating: "PG-13", runtime: "101 min", synopsis: "A timid bank clerk finds a magical mask that turns him into a mischievous superhero.", color: "linear-gradient(135deg,#2e7d32,#ffeb3b)", emoji: "🎭" },
  { id: "8", title: "Cars", year: 2006, genre: "Family", rating: "G", runtime: "117 min", synopsis: "A hotshot race car gets stranded in a forgotten town on Route 66.", color: "linear-gradient(135deg,#c62828,#ff9800)", emoji: "🏎️" },
  { id: "9", title: "Superman Returns", year: 2006, genre: "Action", rating: "PG-13", runtime: "154 min", synopsis: "After a long absence, Superman returns to a world that has learned to live without him.", color: "linear-gradient(135deg,#0d47a1,#d32f2f)", emoji: "🦸" },
  { id: "10", title: "Little Miss Sunshine", year: 2006, genre: "Drama", rating: "R", runtime: "101 min", synopsis: "A family drives to California in a VW bus so their daughter can compete in a beauty pageant.", color: "linear-gradient(135deg,#fbc02d,#ff6f00)", emoji: "🌻" },
  { id: "11", title: "Borat", year: 2006, genre: "Comedy", rating: "R", runtime: "84 min", synopsis: "Kazakh TV talking head Borat is sent to America to report on the greatest country in the world.", color: "linear-gradient(135deg,#1976d2,#ffc107)", emoji: "🎤" },
  { id: "12", title: "Happy Feet", year: 2006, genre: "Family", rating: "PG", runtime: "108 min", synopsis: "A penguin who cannot sing finds his voice through tap dancing.", color: "linear-gradient(135deg,#01579b,#b3e5fc)", emoji: "🐧" },
];

export const GENRES = ["All", "Action", "Adventure", "Comedy", "Crime", "Drama", "Family"];

export function findMovie(id: string) {
  return MOVIES.find((m) => m.id === id);
}
