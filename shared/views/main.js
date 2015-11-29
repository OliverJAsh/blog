import h from 'virtual-dom/h';
import exp from '../exp';
import { getAssetMap, getAssetFilename } from '../helpers';

// TODO: Is there a better way to uglify?
// This is the only way to reliably download async, run ASAP, but
// run in order
// http://www.html5rocks.com/en/tutorials/speed/script-loading/
const getDownloadScriptsScript = () => (
`['${getAssetFilename('js/vendor-bundle.js')}', '${getAssetFilename('js/main-bundle.js')}'].forEach(function (src) {
    var script = document.createElement('script');
    script.src = src;
    script.async = false;
    document.head.appendChild(script);
});`

// body may or may not be a promise
export default ({ title, body, templateData }={}) => (
    Promise.resolve(body).then(resolvedBody => (
        h('html', [
            h('head', [
                h('title', [ `${title ? (title + ' – ') : ''} Blog` ]),
                h('meta', { name: 'viewport', content: 'width=device-width' }),
                // Execute JS async which fetches model data then renders when
                // DOMContentLoaded
                h('script', { innerHTML: getDownloadScriptsScript() })
            ]),
            h('body', [
                h('h1',
                    h('a', { href: '/' }, 'Blog')
                ),
                resolvedBody,
                exp(templateData) && h(
                    'script',
                    { id: 'template-data', type: 'application/json' },
                    JSON.stringify(templateData)
                ),
                h('script', `window.assetMap = ${JSON.stringify(getAssetMap())}`)
            ])
        ])
    ))
);
