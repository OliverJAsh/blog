import h from 'virtual-dom/h';
import css from '../css.js';

const siteTitle = 'Oliver Joseph Ash';
const fontsStylesheetUrl = 'https://fonts.googleapis.com/css?family=Lora:400,700';

export default ({ title, body }) => (
    h('html', [
        h('head', [
            h('meta', { charset: 'utf-8' }),
            h('title', `${title ? (title + ' – ') : ''}${siteTitle}`),
            h('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
            h('style', { innerHTML: css }),
            h('link', {
                rel: 'stylesheet',
                href: fontsStylesheetUrl,
                media: 'none',
                attributes: { onload: 'if(media!=\'all\')media=\'all\'' }
            }),
            h('noscript', h('link', {
                rel: 'stylesheet',
                href: fontsStylesheetUrl
            }))
        ]),
        h('body', [
            h('h1', [
                h('a', { href: '/' }, siteTitle)
            ]),
            h('h3', 'Full-stack web developer'),
            h('div', [ body ])
        ])
    ])
);
