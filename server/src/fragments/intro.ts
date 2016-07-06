import { h } from 'virtual-dom';

export default h('p', [
    'I’m a software engineer working on the team behind',
    ' ',
    h('a', { href: 'http://www.theguardian.com/' }, 'theguardian.com'),
    '.',
    ' ',
    'Being passionate about the open web, I aim to work on software that exploits the decentralised nature of the web to solve non-trivial, critical problems.',
    ' ',
    'With a strong background in arts as well as engineering, I approach web development in its entirety: UX, performance, and functional programming are some of the things I enjoy most.',
    ' ',
    h('a', { href: 'https://samefourchords.com/' }, 'See my photography blog'),
    ' or ',
    h('a', { href: 'https://www.instagram.com/oliverjash', rel: 'me' }, 'my Instagram'),
    '.'
]);
