import h from 'virtual-dom/h';
import exp from '../exp';
import { isContentCached } from '../helpers';

export default (posts) => {
    const articleLINodesPromise = Promise.all(posts.map(([ postSlug, post ]) => {
        const apiUrl = `/api/${postSlug}`;
        const siteUrl = `/${postSlug}`;
        return isContentCached(apiUrl).then(isCached => (
            h('li', [
                h('h2', h('a', { href: siteUrl }, post.title)),
                exp(isCached) && h('p', h('strong', 'Available offline')),
                h('p', new Date(post.date).toDateString())
            ])
        ));
    }));
    return articleLINodesPromise.then(articleLINodes => (
        h('ul', articleLINodes)
    ));
};
