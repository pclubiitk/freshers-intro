export type Image = { image_url: string };
export type Image_Obj = { file: File; preview: string };
export interface ImagesInputProps{
    images: Image_Obj[];
    setImages: React.Dispatch<React.SetStateAction<Image_Obj[]>>;
}
export type User = {
  username: string;
  email: string;
  id: number;
  is_verified: boolean;
  images: Image[];
};

export type Socials = {
    discord: string;
    instagram: string;
    linkedin: string;
    github: string;
    codeforces: string;
    leetcode: string;
    hackerrank: string;
    atcoder: string
}

export type Profile = {
  user: User;
  bio?: string;
  branch?: string;
  batch?: string;
  hostel?: string;
  hobbies?: string[];
  interests?: string[];
  socials?: Socials;
};

export type User_Profile_Form =  {
  bio: string;
  branch: string;
  batch: string;
  interests: string[];
  hostel: string;
  socials: Record<string, string>;
};
