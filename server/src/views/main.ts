import { h, VNode } from 'virtual-dom';
import css from '../css';
import * as fs from 'fs';

const clientMainJs = fs.readFileSync(`${__dirname}/../client/main.js`).toString();
const analyticsJs = fs.readFileSync(`${__dirname}/../client/analytics.js`).toString();

const renderNonBlockingCss = (href: string): Array<VNode> => [
    h('link', {
        rel: 'stylesheet',
        href,
        media: 'none',
        attributes: { onload: 'if(media!=\'all\')media=\'all\'' }
    }, []),
    h('noscript', [
        h('link', { rel: 'stylesheet', href }, [])
    ])
];

const siteTitle = 'Oliver Joseph Ash';

export default ({ title, body }) => (
    h('html', [
        h('head', [
            h('meta', { charset: 'utf-8' }, []),
            h('title', `${title ? (title + ' – ') : ''}${siteTitle}`),
            h('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }, []),
            h('style', { innerHTML: css }, [])
        ].concat(
            renderNonBlockingCss('https://fonts.googleapis.com/css?family=Lora:400,700')
        )),
        h('body', [
            h('h1', [
                h('a', { href: '/' }, siteTitle)
            ]),
            h('h3', 'Full-stack web developer'),
            h('div', [ body ]),
            h('script', { innerHTML: clientMainJs }, []),
            h('script', { innerHTML: analyticsJs }, [])
        ])
    ])
);
