describe('bookService', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('searchBooks', () => {
    it('returns empty array for empty query', async () => {
      const { searchBooks } = await import('../bookService');
      const result = await searchBooks('');
      expect(result).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns empty array for whitespace-only query', async () => {
      const { searchBooks } = await import('../bookService');
      const result = await searchBooks('   ');
      expect(result).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns empty array when API returns no items', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ items: [] }),
      });
      const { searchBooks } = await import('../bookService');
      const result = await searchBooks('test');
      expect(result).toEqual([]);
    });

    it('throws on network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network failed'));
      const { searchBooks } = await import('../bookService');
      await expect(searchBooks('test')).rejects.toThrow(
        'Network error. Please check your connection'
      );
    });

    it('throws on 429 rate limit', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 429,
      });
      const { searchBooks } = await import('../bookService');
      await expect(searchBooks('test')).rejects.toThrow('Too many requests');
    });

    it('maps API response to Book format', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'abc123',
              volumeInfo: {
                title: 'Test Book',
                authors: ['John Doe'],
                publishedDate: '2020-05-15',
                imageLinks: { thumbnail: 'http://example.com/cover.jpg' },
                averageRating: 4.5,
                ratingsCount: 100,
                description: 'A test book',
                industryIdentifiers: [
                  { type: 'ISBN_13', identifier: '9780123456789' },
                ],
              },
            },
          ],
        }),
      });
      const { searchBooks } = await import('../bookService');
      const result = await searchBooks('test');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'abc123',
        title: 'Test Book',
        authors: ['John Doe'],
        publishedYear: '2020',
        thumbnail: 'https://example.com/cover.jpg',
        averageRating: 4.5,
        ratingsCount: 100,
        description: 'A test book',
        isbn: '9780123456789',
      });
    });
  });

  describe('getBookById', () => {
    it('returns null for invalid response', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
      const { getBookById } = await import('../bookService');
      const result = await getBookById('invalid');
      expect(result).toBeNull();
    });

    it('returns null on fetch error', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Failed'));
      const { getBookById } = await import('../bookService');
      const result = await getBookById('abc');
      expect(result).toBeNull();
    });
  });
});
