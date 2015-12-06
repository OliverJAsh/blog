import h from 'virtual-dom/h';
import exp from '../exp';
import { isContentCached } from '../helpers';

export default (posts) => {
    const articleLINodesPromise = Promise.all(posts.map(([ postSlug, post ]) => {
        const url = `/${postSlug}`;
        return isContentCached(url).then(isCached => (
            h('li', [
                h('h2', h('a', { href: url }, post.title)),
                exp(isCached) && h('p', h('strong', 'Available offline')),
                h('p', new Date(post.date).toDateString()),
                h('div', { innerHTML: post.body })
            ])
        ));
    }));
    return articleLINodesPromise.then(articleLINodes => (
        h('ul', articleLINodes)
    ));
};
