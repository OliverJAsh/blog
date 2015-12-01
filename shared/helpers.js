export const getContentUrl = (contentId) => `/api/${contentId}`;

export const isClient = typeof window !== 'undefined';

export const isContentCached = (contentId) =>
    isClient
        ? caches.open('content').then((cache) =>
            cache.match(getContentUrl(contentId))
                .then(response => !! response)
        )
        : Promise.resolve(false);

export const getAssetMap = () => {
    if (isClient) {
        return window.assetMap;
    } else {
        // Babel doesn't polyfill System.import, so use CJS
        const revManifest = require('../rev-manifest.json');
        return revManifest;
    }
};

export const getAssetFilename = assetName => `/${getAssetMap()[assetName]}`;
