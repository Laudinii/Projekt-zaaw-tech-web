# Projekt Zaawansowane Technologie Web

Projekt sklada sie z dwoch czesci:

- `backend` - API w Node.js i Express,
- `frontend` - aplikacja React + Vite.

## Wymagania

- Node.js 18 lub nowszy
- npm

## Instalacja lokalna

Najpierw zainstaluj zaleznosci osobno dla backendu i frontendu.
Instrukcja poniżej.

### Backend

Przejdz do folderu `backend` i uruchom:

```bash
npm install
```

### Frontend

Przejdz do folderu `frontend` i uruchom:

```bash
npm install
```

## Uruchomienie lokalne

Najpierw uruchom backend:

```bash
cd backend
npm run dev
```

Backend domyslnie dziala na `http://localhost:3001`.

Nastepnie w drugim terminalu uruchom frontend:

```bash
cd frontend
npm run dev
```

Frontend korzysta lokalnie z backendu, wiec backend musi byc wlaczony przed wyszukiwaniem ksiazek.

## Dodatkowe informacje

- nie uruchamiaj `npm run dev` w katalogu glownym projektu, bo nie ma tam `package.json`,
- frontend ma podstawowe wsparcie PWA,
- backend udostepnia endpointy `GET /api/health` oraz `GET /api/books?q=fraza`.
