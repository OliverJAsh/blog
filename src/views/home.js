import h from 'virtual-dom/h';
import mainView from './main';

const about = h('p', [
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
]);
const built = [
    { title: 'my new offline-first blog', href: 'https://github.com/OliverJAsh/blog' },
    { title: 'a simple offline blog to demonstrate service worker capabitilies', href: 'https://github.com/OliverJAsh/simple-offline-blog' },
    { title: 'Chrome extension for editing URL query parameters, written in Elm', href: 'https://github.com/OliverJAsh/query-params-chrome' },
    { title: 'Chrome extension for easily viewing and switching A/B tests on theguardian.com, written in Cycle.js', href: 'https://github.com/OliverJAsh/guardian-ab-tests-chrome' },
    { title: 'a dashboard to easily view deploys of theguardian.com, written in TypeScript', href: 'https://github.com/guardian/frontend/tree/master/static/src/deploys-radiator' },
    { title: 'the Guardian’s offline page', href: 'https://www.theguardian.com/info/developer-blog/2015/nov/04/building-an-offline-page-for-theguardiancom' },
    { title: 'the Guardian’s developer site', href: 'http://developers.theguardian.com/' },
    { title: 'Scribe, a web rich text editor', href: 'https://github.com/guardian/scribe' },
    { title: 'Sbscribe, a social news and feed reader. ', href: 'https://vimeo.com/69376016' }
];
const talks = [
    { title: 'Building an offline page for theguardian.com', href: 'https://www.youtube.com/watch?v=dZU6_2xXeVk', description: 'Native apps have long had tools to give users good experiences when they have poor internet connectivity or none at all. With service workers, the web is catching up. This talk demonstrates how I built the Guardian’s offline page.' },
    { title: 'Building a CMS for the responsive web', href: 'https://www.youtube.com/watch?v=31EpyxcmBeU', description: 'In light of responsive web design, people often focus heavily on how content should be rendered, but how it is produced is usually overlooked. This talk reviews how the challenges of responsive web design can bleed into issues of content production, and how the Guardian solves these issues with Composer – our web-based, digital content-management system.' }
];
const externalArticles = [
    { title: 'Building an offline page for theguardian.com', href: 'https://www.theguardian.com/info/developer-blog/2015/nov/04/building-an-offline-page-for-theguardiancom', date: new Date(2015, 10, 4) },
    { title: 'Introducing the new Guardian Developers Site', href: 'https://www.theguardian.com/info/developer-blog/2014/jul/22/introducing-the-new-guardian-developers-site', date: new Date(2014, 6, 22) },
    { title: 'Inside the Guardian’s CMS: meet Scribe, an extensible rich text editor', href: 'https://www.theguardian.com/info/developer-blog/2014/mar/20/inside-the-guardians-cms-meet-scribe-an-extensible-rich-text-editor', date: new Date(2014, 2, 20) }
];

const createPost = (post, href) => (
    h('li', [
        h('h3', h('a', { href }, post.title)),
        h('p', new Date(post.date).toDateString())
    ])
);

export default (posts) => {
    const articleLINodes =
        posts
            .filter(([ , post ]) => (new Date(post.date).getFullYear() > 2013) || post.showcase)
            .map(([ postSlug, post ]) => [ post, createPost(post, `/${postSlug}`) ])
            .concat(externalArticles.map(post => [ post, createPost({ title: post.title, date: post.date }, post.href) ] ))
            .sort(([ postA ], [ postB ]) => new Date(postA.date) - new Date(postB.date))
            .reverse()
            .map(([ , tree ]) => tree);

    const body =
        h('div', [
            about,
            h('h2', 'Things I’ve built'),
            h('ul', built.map(({ title, href }) => h('li', h('a', { href }, title)))),
            h('p', h('a', { href: 'https://github.com/OliverJAsh' }, 'See more on GitHub.')),
            h('h2', 'Talks I’ve given'),
            h('ul', talks.map(({ title, href, description }) => (
                h('li', [
                    h('h3', h('a', { href }, title)),
                    h('p', description)
                ])
            ))),
            h('h2', 'Thoughts I’ve published'),
            h('ul', articleLINodes)
        ]);

    return mainView({ title: '', body });
};
