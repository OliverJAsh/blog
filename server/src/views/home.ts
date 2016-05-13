import { h } from 'virtual-dom';
import mainView from './main';

import { Post } from '../models';

const createPost = (post: Post) => (
    h('li', [
        h('h3', [ h('a', { href: post.href }, post.title) ]),
        h('p', post.date.toDateString())
    ])
);

export default (built: any, talks: any, posts: Array<Post>) => {
    const body =
        h('div', [
            h('p', [
                'I’m a software engineer working on the team behind',
                ' ',
                h('a', { href: 'http://www.theguardian.com/' }, 'theguardian.com'),
                '.',
                ' ',
                'Being passionate about the open web, I aim to work on software that exploits the decentralised nature of the web to solve non-trivial, critical problems.',
                ' ',
                'With a strong background in arts as well as engineering, I approach web development in its entirety: UX, performance, and functional programming are some of the things I enjoy most.',
                ' ',
                h('a', { href: 'http://samefourchords.com/' }, 'I also enjoy photography.'),
                ' ',
                h('a', { href: 'http://oliverjash.github.io/cv/' }, 'View my CV.')
            ]),
            h('h2', 'Things I’ve built'),
            h('ul', built.map(({ title, href }) => h('li', [ h('a', { href }, title) ]))),
            h('p', [ h('a', { href: 'https://github.com/OliverJAsh' }, 'See more on GitHub.') ]),
            h('h2', 'Talks I’ve given'),
            h('ul', talks.map(({ title, href, description }) => (
                h('li', [
                    h('h3', [ h('a', { href }, title) ]),
                    h('p', description)
                ])
            ))),
            h('h2', 'Thoughts I’ve published'),
            h('ul', (
                posts
                    .filter((post: Post) => (post.date.getFullYear() > 2013) || post.showcase)
                    .map(createPost)
            ))
        ]);

    return mainView({ title: '', body });
};
