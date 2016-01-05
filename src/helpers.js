export const getAssetMap = () => {
    // Babel doesn't polyfill System.import, so use CJS
    const revManifest = require('../target/rev-manifest.json');
    return revManifest;
};

export const getAssetFilename = assetName => `/${getAssetMap()[assetName]}`;

export const log = message => {
    console.log(`${new Date().toISOString()} ${message}`);
};
