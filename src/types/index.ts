export interface FullUser {
  name: string;
  email: string;
  createdAt: Date;
  playList: {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    songs: {
      name: string;
      id: string;
      createdAt: Date;
      artists: {
        name: string;
      }[];
    }[];
  }[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
