import { h } from 'virtual-dom';

export default h('div', [
    h('p', [
        `I’m a software engineer residing in Yorkshire, England. I currently work at `,
        h('a', { href: 'https://unsplash.com/' }, 'Unsplash'),
        `, and previously worked on the team behind `,
        h('a', { href: 'http://www.theguardian.com/' }, 'theguardian.com'),
        ` and the Guardian's web based content management system, `,
        h('a', { href: 'https://www.youtube.com/watch?v=31EpyxcmBeU' }, 'Composer'),
        `.`,
    ]),
    h('p', [
        `Being passionate about the open web, I aim to work on software that
        exploits the decentralised nature of the web to solve non-trivial,
        critical problems. With a strong background in arts as well as
        engineering, I approach web development in its entirety: UX,
        performance, and functional programming are some of the things I enjoy
        most. I also `,
        h('a', { href: 'https://samefourchords.com/', title: 'See my photography blog' },
            `love the art of photography as a tool for life documentation`
        ),
        `.`,
    ])
]);
