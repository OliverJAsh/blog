import h from 'virtual-dom/h';
import exp from './shared/exp';
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

export default ({ title, state, body }) => (
    h('html', [
        h('head', [
            h('title', getPageTitle(title)),
            h('meta', { name: 'viewport', content: 'width=device-width' }),
            // Execute JS async which fetches model data then renders when
            // DOMContentLoaded
            h('script', { innerHTML: getDownloadScriptsScript() })
        ]),
        h('body', [
            h('h1',
                h('a', { href: '/' }, 'Blog')
            ),
            h('div#root', [ body ]),
            exp(state) && h(
                'script',
                { id: 'state', type: 'application/json' },
                JSON.stringify(state)
            ),
            h('script', `window.assetMap = ${JSON.stringify(getAssetMap())}`)
        ])
    ])
);