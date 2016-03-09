import h from 'virtual-dom/h';
import mainView from './main';

export default ([ postSlug, post ]) => {
    const siteUrl = `/${postSlug}`;
    const body = h('article', [
        h('header', [
            h('h2', h('a', { href: siteUrl }, post.title)),
            h('p', new Date(post.date).toDateString())
        ]),
        h('div', { innerHTML: post.body })
    ]);
    return mainView({ title: post.title, body });
};
