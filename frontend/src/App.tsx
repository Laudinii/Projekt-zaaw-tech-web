import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  CssBaseline,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { z } from "zod";
import "./App.css";

type Book = {
  key: string;
  title: string;
  author: string;
  firstPublishYear: number | string;
  coverUrl: string | null;
};

type AccessFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type AccessFormErrors = Partial<Record<keyof AccessFormData, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const accessSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Nazwa użytkownika musi mieć minimum 3 znaki.")
      .max(20, "Nazwa użytkownika może mieć maksymalnie 20 znaków."),
    email: z.string().trim().regex(emailRegex, "Podaj poprawny adres email."),
    password: z
      .string()
      .min(8, "Hasło musi mieć minimum 8 znaków.")  
      .regex(/[A-Za-z]/, "Hasło musi zawierać co najmniej jedną literę.")
      .regex(/\d/, "Hasło musi zawierać co najmniej jedną cyfrę.")
      .regex(
        /[^A-Za-z0-9]/,
        "Hasło musi zawierać minimum jeden znak specjalny.",
      ),
    confirmPassword: z.string().min(1, "Powtórz hasło."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być identyczne.",
    path: ["confirmPassword"],
  });

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#8c3b2a",
    },
    secondary: {
      main: "#c8894f",
    },
    background: {
      default: "#f5ecdf",
      paper: "#fffaf3",
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 56,
          minWidth: 152,
          paddingInline: 26,
          borderRadius: 5,
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 700,
          letterSpacing: "0.01em",
          background: "linear-gradient(135deg, #a84b31 0%, #7f2f1d 100%)",
        },
        contained: {
          "&:hover": {
            boxShadow: "0 18px 36px rgba(140, 59, 42, 0.3)",
            transform: "translateY(-1px)",
            filter: "brightness(1.03)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 56,
          borderRadius: 5,
        },
      },
    },
  },
  typography: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    h1: {
      fontWeight: 700,
      lineHeight: 0.96,
    },
  },
});

function App() {
  const [hasAccess, setHasAccess] = useState(false);
  const [accessForm, setAccessForm] = useState<AccessFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [accessErrors, setAccessErrors] = useState<AccessFormErrors>({});
  const [query, setQuery] = useState("hobbit");
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAccessFieldChange = (
    field: keyof AccessFormData,
    value: string,
  ) => {
    setAccessForm((current) => ({
      ...current,
      [field]: value,
    }));

    setAccessErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const handleAccessSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResult = accessSchema.safeParse(accessForm);

    if (!validationResult.success) {
      const nextErrors: AccessFormErrors = {};

      for (const issue of validationResult.error.issues) {
        const field = issue.path[0] as keyof AccessFormData | undefined;

        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }

      setAccessErrors(nextErrors);
      return;
    }

    setAccessErrors({});
    setHasAccess(true);
  };

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setError("Enter a title or author first.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/books?q=${encodeURIComponent(normalizedQuery)}`,
      );

      if (!response.ok) {
        throw new Error("Request failed.");
      }

      const data = await response.json();
      setBooks(data.books);
    } catch {
      setBooks([]);
      setError(
        "The frontend could not reach the backend. Start the Node.js API on port 3001.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-shell">
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
          {!hasAccess ? (
            <Paper elevation={0} className="panel">
              <Stack spacing={3}>
                <Box>
                  <Typography className="panel-title">
                    Dostęp do wyszukiwarki
                  </Typography>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: "2.6rem", md: "4rem" },
                      maxWidth: { xs: "12ch", md: "13ch" },
                    }}
                  >
                    Wprowadź swoje dane aby móc korzystać z wyszukiwarki
                  </Typography>
                </Box>

                <Typography color="text.secondary" sx={{ maxWidth: "62ch" }}>
                  To nie jest prawdziwa rejestracja. Po prostu poprawnie
                  wypełnij formularz, aby odblokować dostęp do wyszukiwarki.
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleAccessSubmit}
                  className="access-form"
                >
                  <Box className="access-grid">
                    <TextField
                      label="Nazwa użytkownika"
                      value={accessForm.username}
                      onChange={(event) =>
                        handleAccessFieldChange("username", event.target.value)
                      }
                      error={Boolean(accessErrors.username)}
                      helperText={accessErrors.username || "3-20 znaków"}
                    />
                    <TextField
                      label="Adres email"
                      value={accessForm.email}
                      onChange={(event) =>
                        handleAccessFieldChange("email", event.target.value)
                      }
                      error={Boolean(accessErrors.email)}
                      helperText={accessErrors.email || "Np. user@example.com"}
                    />
                    <TextField
                      label="Hasło"
                      type="password"
                      value={accessForm.password}
                      onChange={(event) =>
                        handleAccessFieldChange("password", event.target.value)
                      }
                      error={Boolean(accessErrors.password)}
                      helperText={
                        accessErrors.password ||
                        "Min. 8 znaków, litera, cyfra i znak specjalny"
                      }
                    />
                    <TextField
                      label="Powtórz hasło"
                      type="password"
                      value={accessForm.confirmPassword}
                      onChange={(event) =>
                        handleAccessFieldChange(
                          "confirmPassword",
                          event.target.value,
                        )
                      }
                      error={Boolean(accessErrors.confirmPassword)}
                      helperText={
                        accessErrors.confirmPassword ||
                        "Hasła muszą być identyczne"
                      }
                    />
                  </Box>

                  <Box className="access-actions">
                    <Button type="submit" variant="contained" size="large">
                      Wejdź do wyszukiwarki
                    </Button>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          ) : (
            <>
              <Paper elevation={0} className="panel">
                <Stack spacing={3}>
                  <Box>
                    <Typography className="panel-title">
                      Szukaj książki
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { xs: "3rem", md: "4rem" },
                        maxWidth: "15ch",
                      }}
                    >
                      Znajdź książkę po tytule lub autorze
                    </Typography>
                  </Box>

                  <Box
                    component="form"
                    onSubmit={handleSearch}
                    className="search-form"
                  >
                    <TextField
                      label="Tytuł książki lub autor"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Spróbuj Hobbit, Orwell, Sapkowski..."
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isLoading}
                    >
                      {isLoading ? "Wyszukiwanie..." : "Szukaj"}
                    </Button>
                  </Box>

                  {error ? <Alert severity="error">{error}</Alert> : null}
                </Stack>
              </Paper>

              <Box sx={{ mt: 3 }}>
                {isLoading ? (
                  <Box className="loading-box">
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box className="results-grid">
                    {books.length > 0 ? (
                      books.map((book) => (
                        <Card
                          key={book.key}
                          className="book-card"
                          elevation={0}
                        >
                          {book.coverUrl ? (
                            <CardMedia
                              component="img"
                              image={book.coverUrl}
                              alt={book.title}
                              className="book-cover"
                            />
                          ) : (
                            <Box className="book-cover book-cover--empty">
                              <Typography variant="body2">
                                Brak okładki
                              </Typography>
                            </Box>
                          )}
                          <CardContent className="book-card__content">
                            <Box className="book-card__stack">
                              <Stack spacing={1.5}>
                                <Typography variant="h5">
                                  {book.title}
                                </Typography>
                                <Typography color="text.secondary">
                                  {book.author}
                                </Typography>
                              </Stack>
                              <Chip
                                label={`Pierwsza publikacja: ${book.firstPublishYear}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ width: "fit-content", mt: "auto" }}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Paper elevation={0} className="empty-panel">
                        <Typography variant="h5" sx={{ mb: 1 }}>
                          Brak wyników
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                )}
              </Box>
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
