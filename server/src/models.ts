export interface PostJson {
    showcase?: boolean;
    title: string;
    date: string;
    body: string;
}

export interface Post {
    showcase?: boolean;
    title: string;
    date: Date;
    body: string;
    href: string;
}

export interface PostPreview {
    title: string;
    date: Date;
    href: string;
}

export interface Project {
    title: string;
    href: string;
}

export interface Talk {
    title: string;
    href: string;
    description: string;
}
