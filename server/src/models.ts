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
