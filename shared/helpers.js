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
        const publicDir = `${__dirname}/../public`;
        const assetMapPath = `${publicDir}/js/rev-manifest.json`;
        // Babel doesn't polyfill System.import, so use CJS
        return require(assetMapPath);
    }
};

export const getAssetFilename = assetName => `/js/${getAssetMap()[assetName]}`;
