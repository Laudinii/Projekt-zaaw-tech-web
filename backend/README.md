# Backend

Prosty serwer API oparty o Node.js i Express.

## Wymagania

- Node.js 18 lub nowszy
- npm

## Instalacja

W katalogu `backend` uruchom:

```bash
npm install
```

## Uruchomienie

Tryb developerski:

```bash
npm run dev
```

Domyslnie backend startuje pod adresem `http://localhost:3001`.

## Dostepne endpointy

- `GET /api/health`
- `GET /api/books?q=fraza`
