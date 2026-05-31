# Frontend

Jako, że na codzień pracuję z Reactem, użyłem znanych mi bibliotek do zrobienia tej aplikacji.
Szkielet kodu zbudowany przy pomocy template'a od vite REACT + TYPESCRIPT.
Do walidacji użyty ZOD.
Komponenty UI z MaterialUI.

Są dwa ekrany, w pierszym jest formularz, w drugim jest wyszukiwarka książek z rezultatami.
Wyszukiwanie odbywa się po stronie backendowej.

## Wymagania

- Node.js 18 lub nowszy
- npm

## Instalacja

W katalogu `frontend` uruchom:

```bash
npm install
```

## Uruchomienie

Tryb developerski:

```bash
npm run dev
```

WAŻNE !!!
Frontend zaklada, ze backend jest uruchomiony lokalnie, wiec przed startem aplikacji warto wlaczyc tez serwer z katalogu `backend`.

## PWA

Aplikacja ma podstawowe wsparcie PWA poprzez PLUGIN do VITE:

- manifest aplikacji,
- service worker generowany przy buildzie,
- mozliwosc instalacji aplikacji w zgodnych przegladarkach.

Aby przetestowac PWA lokalnie:

```bash
npm run build
npm run preview
```

Najlepiej sprawdzac instalacje w przegladarce po uruchomieniu wersji preview lub po wdrozeniu buildu produkcyjnego.
