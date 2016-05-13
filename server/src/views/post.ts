import { h } from 'virtual-dom';
import mainView from './main';

import { Post } from '../models';

export default (post: Post) => {
    const body = h('article', [
        h('header', [
            h('h2', [ h('a', { href: post.href }, post.title) ]),
            h('p', post.date.toDateString())
        ]),
        h('div', { innerHTML: post.body }, [])
    ]);
    return mainView({ title: post.title, body });
};
