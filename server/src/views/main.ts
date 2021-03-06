import { h, VNode } from 'virtual-dom';
import css from '../css';
import * as fs from 'fs';

const clientMainJs = fs.readFileSync(`${__dirname}/../../../client/target/main.js`).toString();
const analyticsJs = fs.readFileSync(`${__dirname}/../../../client/target/analytics.js`).toString();

const siteTitle = 'Oliver Joseph Ash';

// Implicit any here, be careful
// https://github.com/Microsoft/TypeScript/issues/8667
export default ({ title, description, body }: { title: string, description?: string, body: VNode }) => (
    h('html', [
        h('head', [
            h('meta', { charset: 'utf-8' }, []),
            h('title', `${title ? (title + ' – ') : ''}${siteTitle}`),
            h('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }, []),
            description ? h('meta', { name: 'description', content: description }, []) : null as any,
            h('style', { innerHTML: css }, []),

            h('link', {
                attributes: {
                    rel: 'preload',
                    href: '/prism-theme.css',
                    as: 'style',
                    onload: 'this.rel="stylesheet"',
                }
            }, []),
            h('noscript', [
                h('link', { attributes: { rel: 'stylesheet', href: '/prism-theme.css' } }, [])
            ]),

        ]),
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
