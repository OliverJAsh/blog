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
        const assetMapPath = `${__dirname}/../rev-manifest.json`;
        // Babel doesn't polyfill System.import, so use CJS
        const fs = require('fs');
        // We always want the latest, so don't use require
        const revManifest = JSON.parse(fs.readFileSync(assetMapPath).toString());
        return revManifest;
    }
};

export const getAssetFilename = assetName => `/${getAssetMap()[assetName]}`;
