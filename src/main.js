import h from 'virtual-dom/h';
import { getAssetMap, getAssetFilename } from './helpers';
import { getPageTitle } from './shared/helpers';
import UglifyJS from 'uglify-js';

// This is the only way to reliably download async, run ASAP, but
// run in order
// http://www.html5rocks.com/en/tutorials/speed/script-loading/
const getDownloadScriptsScript = () => UglifyJS.minify(
    `['${getAssetFilename('js/vendor-bundle.js')}', '${getAssetFilename('js/main-bundle.js')}'].forEach(function (src) {
        var script = document.createElement('script');
        script.src = src;
        script.async = false;
        document.head.appendChild(script);
    });`,
    {
        fromString: true,
        mangle: { toplevel: true }
    }
).code;

export default ({ title, body }) => (
    h('html', [
        h('head', [
            h('title', getPageTitle(title)),
            h('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
            // Execute JS async which fetches model data then renders when
            // DOMContentLoaded
            h('script', { innerHTML: getDownloadScriptsScript() }),
            h('style', 'body { max-width: 34rem; } pre { overflow-x: auto; } img { max-width: 100%; }')
        ]),
        h('body', [
            h('h1', [
                h('a', { href: '/' }, 'Blog')
            ]),
            h('div#root', [ body ]),
            h('script', `window.assetMap = ${JSON.stringify(getAssetMap())}`)
        ])
    ])
);
