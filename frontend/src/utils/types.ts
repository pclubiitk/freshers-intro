export type Image = { image_url: string };
export type Knowledge = { file: File; preview: string };
export type User = { username: string, email: string, id: number, is_verified: boolean, images: Image[] }

export type Profile = {
  user: {
    username: string;
    email: string;
    id: number;
    is_verified: boolean;
    images: Image[];
  };
  bio?: string;
  branch?: string;
  batch?: string;
  hostel?: string;
  hobbies?: string[];
  interests?: string[];
  socials?: {
    discord?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
};