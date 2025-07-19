export type Image = { image_url: string };

export type Profile = {
    user: { username: string, email: string, id: number, is_verified: boolean, images: Image[] };
    bio?: string;
    branch?: string;
    batch?: string;
    hostel?: string;
    hobbies?: string[];
    interests?: string[];
};
