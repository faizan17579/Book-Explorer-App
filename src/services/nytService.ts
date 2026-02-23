import { BestsellerInfo } from '../types';

const BASE = 'https://api.nytimes.com/svc/books/v3';
const API_KEY = process.env.EXPO_PUBLIC_NYT_API_KEY;

function same(a: string, b: string) {
  const x = a.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
  const y = b.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
  return x === y || x.includes(y) || y.includes(x);
}

export async function getBookBestsellerStatus(book: {
  title: string;
  authors: string[];
  isbn?: string;
}): Promise<BestsellerInfo | null> {
  if (!API_KEY) return null;
  try {
    const res = await fetch(`${BASE}/lists/overview.json?api-key=${API_KEY}`);
    if (!res.ok) return null;
    const data = await res.json();
    const lists = data.results?.lists || [];
    const author = book.authors[0] || '';
    for (const list of lists) {
      for (const b of list.books || []) {
        const byIsbn = book.isbn && b.primary_isbn13 && book.isbn === b.primary_isbn13;
        const byTitle = same(book.title, b.title || '');
        const byAuthor = !author || same(author, b.author || '');
        if (byIsbn || (byTitle && byAuthor)) {
          return {
            listName: list.list_name || 'Bestseller',
            rank: b.rank || 0,
            weeksOnList: b.weeks_on_list || 0,
            description: b.description,
          };
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}
