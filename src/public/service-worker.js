/* eslint-env serviceworker */

import { map, mapKeys, contains } from '../utils';
import { getAssetFilename } from '../helpers';
import { homeRegExp, postRegExp } from '../shared/routing-reg-exps';

const staticCacheName = 'static';
const contentCacheName = 'content';

const shellUrl = `${location.origin}${getAssetFilename('shell.html')}`;
const shellAssetUrls = [
    `${location.origin}${getAssetFilename('js/main-bundle.js')}`,
    `${location.origin}${getAssetFilename('js/vendor-bundle.js')}`
];
const cacheUrls = shellAssetUrls.concat(shellUrl);

const expectedCaches = [
    staticCacheName,
    contentCacheName
];

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

const doesRequestAcceptHtml = request => (
    request.headers.get('Accept')
        .split(',')
        .some(type => type === 'text/html')
);

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const requestURL = new URL(request.url);

    // Serve shell if root request and pathname is / or /posts/:postId
    const isRootRequest = requestURL.origin === location.origin;
    const shouldServeShell =
        isRootRequest
        && doesRequestAcceptHtml(request)
        && (homeRegExp.test(requestURL.pathname)
            || postRegExp.test(requestURL.pathname));
    if (shouldServeShell) {
        event.respondWith(
            caches.match(shellUrl).then(response => (
                // Fallback to network in case the cache was deleted
                response || fetch(request)
            ))
        );
    } else {
        event.respondWith(
            caches.match(request).then((response) => (
                response || fetch(request)
            ))
        );
    }
});
