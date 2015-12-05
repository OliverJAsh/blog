import homeView from './views/home';
import postView from './views/post';
import errorView from './views/error';

export const getContentUrl = (contentId) => `/api/${contentId}`;

export const isBrowserWindow = typeof window !== 'undefined';

export const isContentCached = (contentId) =>
    isBrowserWindow
        ? caches.open('content').then((cache) =>
            cache.match(getContentUrl(contentId))
                .then(response => !! response)
        )
        : Promise.resolve(false);

const homeRegExp = /^\/$/;
const postRegExp = /^\/posts\/(.*)$/;

const getHomePageTemplate = () => ({
    contentId: 'posts',
    shouldCache: true,
    getTree: homeView,
    getTitle: () => ''
});

const getPostPageTemplate = (path) => ({
    contentId: 'posts/' + path.match(postRegExp)[1],
    getTree: postView,
    getTitle: post => post.title
});

export const getErrorPageTemplate = () => ({
    getTree: errorView,
    getTitle: state => state.message
});

export const getPageTemplate = (path) => {
    if (homeRegExp.test(path)) {
        return getHomePageTemplate(path);
    }
    else if (postRegExp.test(path)) {
        return getPostPageTemplate(path);
    }
};

export const getPageTitle = (title) => `${title ? (title + ' – ') : ''}Blog`;
