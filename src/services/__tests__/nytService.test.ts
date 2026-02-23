describe('nytService', () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env;

  beforeEach(() => {
    global.fetch = jest.fn();
    process.env = { ...originalEnv };
    delete process.env.EXPO_PUBLIC_NYT_API_KEY;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env = originalEnv;
  });

  describe('getBookBestsellerStatus', () => {
    it('returns null when no API key', async () => {
      const { getBookBestsellerStatus } = await import('../nytService');
      const result = await getBookBestsellerStatus({
        title: 'Test',
        authors: ['Author'],
      });
      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns bestseller info when book is on list', async () => {
      process.env.EXPO_PUBLIC_NYT_API_KEY = 'test-key';
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'OK',
          results: {
            lists: [
              {
                list_name: 'Hardcover Fiction',
                books: [
                  {
                    rank: 1,
                    title: 'Test Book',
                    author: 'Test Author',
                    weeks_on_list: 5,
                  },
                ],
              },
            ],
          },
        }),
      });
      const { getBookBestsellerStatus } = await import('../nytService');
      const result = await getBookBestsellerStatus({
        title: 'Test Book',
        authors: ['Test Author'],
      });
      expect(result).toEqual({
        listName: 'Hardcover Fiction',
        rank: 1,
        weeksOnList: 5,
      });
    });

    it('returns null when book not on list', async () => {
      process.env.EXPO_PUBLIC_NYT_API_KEY = 'test-key';
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          status: 'OK',
          results: {
            lists: [
              {
                list_name: 'Hardcover Fiction',
                books: [
                  {
                    rank: 1,
                    title: 'Other Book',
                    author: 'Other Author',
                  },
                ],
              },
            ],
          },
        }),
      });
      const { getBookBestsellerStatus } = await import('../nytService');
      const result = await getBookBestsellerStatus({
        title: 'Unknown Book',
        authors: ['Unknown'],
      });
      expect(result).toBeNull();
    });

    it('returns null on API error', async () => {
      process.env.EXPO_PUBLIC_NYT_API_KEY = 'test-key';
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
      const { getBookBestsellerStatus } = await import('../nytService');
      const result = await getBookBestsellerStatus({
        title: 'Test',
        authors: [],
      });
      expect(result).toBeNull();
    });
  });
});
