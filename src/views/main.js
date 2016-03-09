import h from 'virtual-dom/h';

export default ({ title, body }) => (
    h('html', [
        h('head', [
            h('title', `${title ? (title + ' – ') : ''}Blog`),
            h('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
            h('style', 'body { max-width: 34rem; } pre { overflow-x: auto; } img { max-width: 100%; }'),
            h('script', `window.navigator.serviceWorker.getRegistration().then(registration => { if (registration) { registration.unregister(); } })`)
        ]),
        h('body', [
            h('h1', [
                h('a', { href: '/' }, 'Blog')
            ]),
            h('div', [ body ])
        ])
    ])
);
