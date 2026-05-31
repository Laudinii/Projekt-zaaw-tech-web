const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;
const openLibraryBaseUrl = 'https://openlibrary.org/search.json';

app.use(cors());

app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});

app.get('/api/books', async (req, res) => {
    const query = `${req.query.q || ''}`.trim();

    if (!query) {
        return res.status(400).json({ message: 'Query parameter q is required.' });
    }

    try {
        const params = new URLSearchParams({
            q: query,
            limit: '12',
            language: 'pl'
        });

        const response = await fetch(`${openLibraryBaseUrl}?${params.toString()}`);

        if (!response.ok) {
            return res.status(502).json({ message: 'Book service is unavailable.' });
        }

        const data = await response.json();
        const books = (data.docs || []).map((book) => ({
            key: book.key,
            title: book.title,
            author: Array.isArray(book.author_name) ? book.author_name.join(', ') : 'Unknown author',
            firstPublishYear: book.first_publish_year || 'No data',
            coverUrl: book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : null
        }));

        return res.json({
            query,
            count: books.length,
            books
        });
    } catch (error) {
        return res.status(500).json({ message: 'Unexpected server error.' });
    }
});

app.listen(port, () => {
    console.log(`Book API listening on http://localhost:${port}`);
});