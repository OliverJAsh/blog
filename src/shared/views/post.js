import h from 'virtual-dom/h';
import exp from '../exp';
import { isContentCached, canCache } from '../helpers';

export default ([ postSlug, post ]) => {
    const apiUrl = `/api/${postSlug}`;
    const siteUrl = `/${postSlug}`;
    return isContentCached(apiUrl).then(isCached => {
        const cacheOption = exp(canCache) && (
            h('label', [
                h('input', { type: 'checkbox', checked: isCached, onchange: (event) => (
                    caches.open('content').then((cache) => {
                        const shouldCache = event.target.checked;
                        if (shouldCache) {
                            fetch(apiUrl, { headers: { 'Accept': 'application/json' } }).then(response => (
                                cache.put(apiUrl, response)
                            ))
                                .catch(() => event.target.checked = false);
                        } else {
                            cache.delete(apiUrl);
                        }
                    })
                ) }),
                'Read offline'
            ])
        );

        return h('article', [
            h('header', [
                cacheOption,
                h('h2',
                    h('a', { href: siteUrl }, post.title)
                ),
                h('p', new Date(post.date).toDateString())
            ]),
            h('div', { innerHTML: post.body })
        ]);
    });
};
