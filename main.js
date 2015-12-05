import h from 'virtual-dom/h';
import exp from './shared/exp';
import { getAssetMap, getAssetFilename } from './helpers';
import { getPageTitle } from './shared/helpers';

// TODO: Is there a better way to uglify?
// This is the only way to reliably download async, run ASAP, but
// run in order
// http://www.html5rocks.com/en/tutorials/speed/script-loading/
// TODO: These injected sripts get removed by the client-side render. Is that OK?
const getDownloadScriptsScript = () => (
`['${getAssetFilename('js/vendor-bundle.js')}', '${getAssetFilename('js/main-bundle.js')}'].forEach(function (src) {
    var script = document.createElement('script');
    script.src = src;
    script.async = false;
    document.head.appendChild(script);
});`
);

// const downloadScriptsScript = (() => {
//     [
//         getAssetFilename('js/vendor-bundle.js'),
//         getAssetFilename('js/main-bundle.js')
//     ].forEach(function (src) {
//         var script = document.createElement('script');
//         script.src = src;
//         script.async = false;
//         document.head.appendChild(script);
//     });
// }).toString();

// console.log(downloadScriptsScript);

export default ({ title, state, body }) => (
    h('html', [
        h('head', [
            h('title', getPageTitle(title)),
            h('meta', { name: 'viewport', content: 'width=device-width' }),
            // TODO: uglify
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
