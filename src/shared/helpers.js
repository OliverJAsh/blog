import homeView from './views/home';
import postView from './views/post';
import errorView from './views/error';

export const isBrowserWindow = typeof window !== 'undefined';

const isDev = isBrowserWindow && window.location.hostname === 'localhost';
export const canCache = isBrowserWindow && !!window.caches && (window.location.protocol === 'https:' || isDev);
export const isContentCached = (url) =>
    isBrowserWindow
        ? Promise.resolve(
            canCache
            && caches.open('content').then(cache => (
                cache.match(url).then(response => !!response)
            ))
        )
        : Promise.resolve(false);

export const getHomePageTemplate = (path) => ({
    url: path,
    shouldCache: true,
    getTree: homeView,
    getTitle: () => ''
});

export const getPostPageTemplate = (path) => ({
    url: path,
    getTree: post => postView([ path.replace(/^\//, ''), post ]),
    // https://github.com/eslint/eslint/issues/4620
    getTitle: post => post.title
});

export const getErrorPageTemplate = () => ({
    getTree: errorView,
    getTitle: state => state.message
});

export const getPageTitle = (title) => `${title ? (title + ' – ') : ''}Blog`;
