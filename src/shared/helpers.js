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

export const homeRegExp = /^\/$/;
export const postRegExp = /^\/(\d{4})\/(\d{2})\/(\d{2})\/(.[^/]*)$/;

const getHomePageTemplate = (path) => ({
    url: path,
    shouldCache: true,
    getTree: homeView,
    getTitle: () => ''
});

const getPostPageTemplate = (path) => ({
    url: path,
    getTree: postView,
    // https://github.com/eslint/eslint/issues/4620
    getTitle: ([ postSlug, post ]) => post.title
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
