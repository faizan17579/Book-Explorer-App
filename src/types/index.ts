export interface Book {
  id: string;
  title: string;
  authors: string[];
  publishedYear: string;
  thumbnail: string | null;
  averageRating: number | null;
  ratingsCount?: number;
  description?: string;
  isbn?: string;
}

export interface BestsellerInfo {
  listName: string;
  rank: number;
  weeksOnList: number;
  description?: string;
}
