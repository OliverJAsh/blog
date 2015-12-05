/* eslint-env serviceworker */

import { getAssetFilename } from '../helpers';

const staticCacheName = 'static';
const contentCacheName = 'content';

const shellUrl = `${location.origin}/${getAssetFilename('shell.html')}`;
const shellAssetUrls = [
    `${location.origin}/${getAssetFilename('js/main-bundle.js')}`,
    `${location.origin}/${getAssetFilename('js/vendor-bundle.js')}`
];
const cacheUrls = shellAssetUrls.concat(shellUrl);

const expectedCaches = [
    staticCacheName,
    contentCacheName
];

const map = (collection, mapFn) => (
    Object.keys(collection).map(key => mapFn(collection[key], key))
);
const reduce = (collection, reduceFn, seed) => (
    Object.keys(collection).reduce((acc, key) => {
        const value = collection[key];
        return reduceFn(acc, value, key);
    }, seed)
);
const mapKeys = (collection, mapFn) => (
    reduce(collection, (acc, value, key) => {
        acc[mapFn(value, key)] = value;
        return acc;
    }, {})
);
const contains = (array, itemToFind) => array.some(item => item === itemToFind);

const fetchAll = inputs => Promise.all(inputs.map(input => fetch(input)));

const addResponsesToCache = (cacheName, requestUrlToResponseMap) => (
    caches.open(cacheName).then((cache) => (
        map(requestUrlToResponseMap, (response, request) => cache.put(new Request(request), response))
    ))
);

const updateCache = () => {
    return fetchAll(cacheUrls).then(assetResponses => {
        const allAssetResponsesOk = assetResponses.every(response => response.ok);

        if (allAssetResponsesOk) {
            const assetRequestUrlToResponseMap = mapKeys(assetResponses, (response, index) => cacheUrls[index]);
            return addResponsesToCache(staticCacheName, assetRequestUrlToResponseMap);
        }
    });
};

self.addEventListener('install', (event) => {
    console.log('Install');
    // Cache the shell
    event.waitUntil(updateCache());
});

self.addEventListener('activate', (event) => {
    console.log('Activate');

    const flushOldCaches = () => {
        const keysToDeletePromise = caches.keys().then(cacheNames => (
            cacheNames.filter(cacheName => !contains(expectedCaches, cacheName))
        ));

        return keysToDeletePromise.then(keysToDelete => {
            console.log('Flushing old caches: ' + keysToDelete);
            return Promise.all(keysToDelete.map(key => caches.delete(key)));
        });
    };

    const flushOldStaticCacheItems = () => {
        return caches.open(staticCacheName).then(cache => {
            const staticKeysToDeletePromise = cache.keys().then(requests => (
                requests.filter(request => !contains(cacheUrls, request.url))
            ));

            return staticKeysToDeletePromise.then(staticKeysToDelete => {
                console.log('Flushing old cache items: ' + staticKeysToDelete.map(request => request.url));
                return Promise.all(staticKeysToDelete.map(key => cache.delete(key)));
            });
        });
    };

    event.waitUntil(
        Promise.all([
            flushOldCaches(),
            flushOldStaticCacheItems()
        ])
    );
});

self.addEventListener('fetch', (event) => {
    const requestURL = new URL(event.request.url);

    // Serve shell if root request and pathname is / or /posts/:postId
    const isRootRequest = requestURL.origin === location.origin;
    const homeOrArticlePageRegExp = new RegExp('^/(posts/.+)?$');
    const shouldServeShell = isRootRequest && homeOrArticlePageRegExp.test(requestURL.pathname);
    if (shouldServeShell) {
        event.respondWith(
            caches.match(shellUrl).then(response => (
                // Fallback to network in case the cache was deleted
                response || fetch(event.request)
            ))
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => (
                response || fetch(event.request)
            ))
        );
    }
});
