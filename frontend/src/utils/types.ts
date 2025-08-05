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
    instagram?: string;
    linkedin?: string;
    discord?: string;
    github?: string;
    codeforces?: string;
    leetcode?: string;
    atcoder?: string;
    hackerrank?: string;
  };
generated_art?: {
    has_art: boolean;
    s3_url?: string;
    bio_used?: string;
    created_at?: string;
  };
  background_image?: string;
};
