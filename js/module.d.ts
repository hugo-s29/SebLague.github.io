export interface Video {
  id: string;
  thumbnail: string;
  displayName: string;
  url: string;
}

export interface Page {
  id: string;
  file: string;
  displayName: string;
}

export interface Tutorial {
  id: string;
  displayName: string;
  description: string;
  playlist: string;
  videoCount: number;
  duration: number;
}
