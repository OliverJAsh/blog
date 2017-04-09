import { h } from 'virtual-dom';
import mainView from './main';
import { groupBy, toPairs } from 'lodash';
import intro from '../fragments/intro';

import { PostPreview, Project, Talk } from '../models';

const createPost = (post: PostPreview) => (
    h('li', [
        h('h4', [ h('a', { href: post.href }, post.title) ])
    ])
);

export default (projects: Project[], talks: Talk[], posts: Array<PostPreview>) => {
    const body =
        h('main', [
            intro,
            h('p', [ h('a', { href: '/cv' }, 'View my CV'), '.' ]),
            h('h2', 'Things I’ve built'),
            h('ul', projects.map(({ title, href }) => h('li', [ h('a', { href }, title) ]))),
            h('p', [ h('a', { href: 'https://github.com/OliverJAsh', rel: 'me' }, ['See more on GitHub', '.']) ]),
            h('h2', 'Talks'),
            h('ul', talks.map(({ title, href, description }) => (
                h('li', [
                    h('h3', [ h('a', { href }, title) ]),
                    h('p', description)
                ])
            ))),
            h('h2', 'Posts'),
            h('ul', (
                (<[ string, PostPreview[] ][]>toPairs(groupBy(posts, post => post.date.getFullYear())))
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
