import { h } from 'virtual-dom';

const midhurstLink = 'https://www.google.co.uk/maps/place/Midhurst/@50.9817809,-0.7522787,15z/data=!3m1!4b1!4m5!3m4!1s0x4874353f6541d8ed:0xad2789872322f14d!8m2!3d50.9868979!4d-0.737274';
export default h('div', [
    h('p', [
        `I’m a software engineer residing in `,
        h('a', { href: midhurstLink }, 'Midhurst'),
        `, the heart of the South Downs. With an umbilical cord to London, I
        currently work on data visualisation tools, and previously worked on the
        team behind `,
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
