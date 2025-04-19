export interface Film {
  id: string;
  poster: string; // URL to poster image. You can use local images from /public/posters/ or external URLs
  title: {
    en: string;
    ua: string;
  };
  genres: string[];
  description: {
    en: string;
    ua: string;
  };
  rating: number;
  releaseDate: string;
  trailer: string; // URL to YouTube trailer
  actors: string[]; // List of actors in the cast
  isNew?: boolean;
};
