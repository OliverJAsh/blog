import { h } from 'virtual-dom';
import mainView from './main';
import { groupBy, toPairs } from 'lodash';
import dateFormat = require('dateformat');

import { PostPreview, Project, Talk } from '../models';

const createPost = (post: PostPreview) => (
    h('li', [
        h('h3', [ h('a', { href: post.href }, post.title) ])
    ])
);

export default (projects: Project[], talks: Talk[], posts: Array<PostPreview>) => {
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
            h('ul', projects.map(({ title, href }) => h('li', [ h('a', { href }, title) ]))),
            h('p', [ h('a', { href: 'https://github.com/OliverJAsh' }, 'See more on GitHub.') ]),
            h('h2', 'Talks'),
            h('ul', talks.map(({ title, href, description }) => (
                h('li', [
                    h('h3', [ h('a', { href }, title) ]),
                    h('p', description)
                ])
            ))),
            h('h2', 'Posts'),
            h('ul', (
                toPairs(groupBy(posts, post => post.date.getFullYear()))
                    .reverse()
                    .map(
                        ([ year, posts ]) => (
                            h('li', [
                                h('h3', year),
                                h('ul', posts.map(createPost))
                            ])
                        )
                    )
            ))
        ]);

    return mainView({ title: '', body });
};
