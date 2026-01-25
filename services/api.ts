import * as Localization from "expo-localization";

export const API_MISSING_ERROR_MESSAGE =
  "API configuration is missing. Please check your .env file and ensure all required API keys are set.";

const API_KEY = process.env.EXPO_PUBLIC_MOVIE_API_KEY;

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

/**
 * Checks if the API key is configured
 * @throws Error if API key is missing
 */
const validateApiKey = (): void => {
  if (!API_KEY || API_KEY.trim() === "") {
    throw new Error(API_MISSING_ERROR_MESSAGE);
  }
};

// Cihazın dil ayarını al (örn: en, tr)
const getDeviceLanguage = (): string => {
  const locales = Localization.getLocales();
  const languageCode = locales[0]?.languageCode || "en";
  return languageCode.toLowerCase();
};

/**
 * TMDB API için genel fetch fonksiyonu
 * @param endpointPath - API endpoint path'i (örn: "trending/movie/week", "discover/movie")
 * @param options - Opsiyonel parametreler
 * @param options.queryParams - URL query parametreleri (key-value çiftleri)
 * @param options.includeLanguage - Dil parametresini otomatik ekle (varsayılan: true)
 * @param options.responseKey - Response'dan dönecek data key'i (varsayılan: "results")
 * @returns Promise<T> - API'den dönen veri
 */
export const fetchTMDB = async <T = any>(
  endpointPath: string,
  options: {
    queryParams?: Record<string, string | number | boolean>;
    includeLanguage?: boolean;
    responseKey?: string;
  } = {},
): Promise<T> => {
  // Validate API key before making any request
  validateApiKey();

  const {
    queryParams = {},
    includeLanguage = true,
    responseKey = "results",
  } = options;

  // Endpoint path'inden başında varsa "/" karakterini temizle
  const cleanPath = endpointPath.startsWith("/")
    ? endpointPath.slice(1)
    : endpointPath;

  // Query parametrelerini oluştur
  const params = new URLSearchParams();

  // Dil parametresini ekle (eğer isteniyorsa)
  if (includeLanguage) {
    const language = getDeviceLanguage();
    params.append("language", language);
  }

  // Diğer query parametrelerini ekle
  Object.entries(queryParams).forEach(([key, value]) => {
    params.append(key, String(value));
  });

  // URL'i oluştur
  const queryString = params.toString();
  const endpoint = `${TMDB_CONFIG.BASE_URL}/${cleanPath}${
    queryString ? `?${queryString}` : ""
  }`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      // 401 Unauthorized means API key is missing or invalid
      if (response.status === 401) {
        throw new Error(API_MISSING_ERROR_MESSAGE);
      }
      throw new Error(
        `TMDB API Error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Eğer responseKey belirtilmişse, o key'den veriyi döndür
    // Aksi halde tüm response'u döndür
    return responseKey && data[responseKey] !== undefined
      ? data[responseKey]
      : data;
  } catch (error) {
    console.error(`Error fetching from TMDB (${endpointPath}):`, error);
    throw error;
  }
};

export const fetchMovies = async ({
  query,
}: {
  query: string;
}): Promise<Movie[]> => {
  // Validate API key before making any request
  validateApiKey();

  const language = getDeviceLanguage();
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/multi?query=${encodeURIComponent(
        query,
      )}&language=${language}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&language=${language}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    // 401 Unauthorized means API key is missing or invalid
    if (response.status === 401) {
      throw new Error(API_MISSING_ERROR_MESSAGE);
    }
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
};

export const fetchMovieDetails = async (
  movieId: string,
): Promise<MovieDetails> => {
  // Validate API key before making any request
  validateApiKey();

  try {
    const language = getDeviceLanguage();
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}&language=${language}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      },
    );

    if (!response.ok) {
      // 401 Unauthorized means API key is missing or invalid
      if (response.status === 401) {
        throw new Error(API_MISSING_ERROR_MESSAGE);
      }
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};
