import { h } from 'virtual-dom';
import mainView from './main';
import dateFormat = require('dateformat');
import intro from '../fragments/intro';

import { Post } from '../models';

export default () => {
    const body = h('div', [
        h('header', [
            intro,
            h('p', [
                `I am most experienced developing large web applications
                alongside a Node.js or Scala back-end. My aim is always to
                encompass the full stack. I'm a fast learner, and I'm always
                learning. I have `,
                h('strong', `expertise in JavaScript, functional reactive
                programming, and front-end performance`),
                `.`,
            ])
        ]),
        h('main', [
            h('section', [
                h('h2', `Experience`),
                h('div.time-entry', [
                    h('h3', `Software Engineer at Cubik`),
                    h('div', [
                        h('time', `May 2016`),
                        ` – `,
                        h('time', `Present`)
                    ])
                ]),
                h('p', [ `I currently work at a small startup aiming to build
                accessible, web based tools for data visualisation.`, ]),
                h('p', [ `My work involves tools such as TypeScript,
                Immutable.js, Redux, RxJS, virtual DOM (React), and D3.`, ]),
                h('div.time-entry', [
                    h('h3', `Software Engineer at the Guardian`),
                    h('div', [
                        h('time', `March 2013`),
                        ` – `,
                        h('time', `May 2016`)
                    ])
                ]),
                h('p', [
                    `I worked on the team behind `,
                    h('strong', [ h('a', { href: 'http://www.theguardian.com/' }, `theguardian.com`) ]),
                    ` as a full-stack software engineer. During this time I
                    worked extensively to improve the `,
                    h('strong', `front-end performance`),
                    ` of the site. I also worked across various `,
                    h('strong', `objective focussed teams`),
                    ` to design, build, and `,
                    h('strong', `A/B test`),
                    ` new features. My work involved various new technologies,
                    including Scala, Play, service workers, functional reactive
                    programming (RxJS), and TypeScript. `,
                    h('a', { href: 'https://www.youtube.com/watch?v=hx1fqAXXViA' }, 'See my talk at JSConf Budapest'),
                    '.',
                ]),
                h('p', [
                    `Previously, I helped `,
                    h('strong', [
                        `prototype, design, and build `,
                        h('a', {
                            href: 'http://www.theguardian.com/info/developer-blog/2014/mar/20/inside-the-guardians-cms-meet-scribe-an-extensible-rich-text-editor',
                            title: 'See article about Composer'
                        }, `the Guardian’s web based content management system —
                        “Composer”`)
                    ]),
                    `. My work was primarily front-end based, helping to
                    architect the AngularJS application and improve performance.
                    I worked directly with journalists and editors to conceive,
                    test, and iteratively build new features. `,
                    h('strong', [ h('a', { href: 'https://www.youtube.com/watch?v=31EpyxcmBeU' }, `See my talk at Front-end London`) ]),
                    `.`
                ]),
                h('p', [
                    `Whilst working on Composer, I was `,
                    h('strong', [
                        `the lead developer for the `,
                        h('abbr', { title: 'Content Management System' }, `CMS`),
                        `’ rich text editor, `,
                        h('a', {
                            href: 'https://github.com/guardian/scribe',
                            title: 'View project on GitHub'
                        }, `Scribe (open source)`)
                    ]),
                    `, which is now heavily used by the open source community,
                    including BBC.`
                ]),
                h('p', [
                    `During a hack day I built the `,
                    h('a', { href: 'http://developers.theguardian.com' }, `Guardian’s responsive Developers site`),
                    ` (`,
                    h('a', {
                        href: 'https://github.com/guardian/developers-site',
                        title: 'View project on GitHub'
                    }, `open source`),
                    `).`
                ]),
                h('div.time-entry', [
                    h('h3', `Freelance Front-end Engineer`),
                    h('div', [
                        h('time', `August 2014`),
                        ` – March 2015`
                    ])
                ]),
                h('p', [
                    `Whilst `,
                    h('a', {
                        href: 'https://samefourchords.com',
                        title: 'See my photo blog'
                    }, `travelling Europe`),
                    `, I worked remotely for various clients in London, for whom
                    I built new websites.`
                ]),
                h('div.time-entry', [
                    h('h3', `Teaching Assistant at University of Leeds`),
                    h('div', [
                        h('time', `September 2011`),
                        ` – `,
                        h('time', `May 2013`)
                    ])
                ]),
                h('p', [
                    `During my studies, I worked as a teaching assistant for web
                    development studies and participated in research with the
                    university for `,
                    h('abbr', { title: 'The World Wide Web Consortium' }, `W3C`),
                    `.`
                ]),
                h('div.time-entry', [
                    h('h3', `Front-end Engineer at Clock`),
                    h('div', [
                        h('time', `May 2012`),
                        ` – `,
                        h('time', `September 2012`)
                    ])
                ]),
                h('p', `I worked on creative web projects for clients, and took
                the role of lead front-end engineer for various projects
                including building a responsive newspaper website.`),
                h('div.time-entry', [
                    h('h3', `Teacher at EBP Children’s University, Bedford College`),
                    h('div', [
                        h('time', `August 2009`),
                        `, `,
                        h('time', `August 2010`),
                        `, `,
                        h('time', `August 2011`)
                    ])
                ]),
                h('p', `I taught the basics of web design and development to a
                class of 20 children aged 8–13 years.`)
            ]),
            h('section', [
                h('h2', `Education`),
                h('div.time-entry', [
                    h('h3', `BA (Hons) in New Media at University of Leeds`),
                    h('div', [
                        h('time', `2010`),
                        ` – `,
                        h('time', `2013`)
                    ])
                ]),
                h('p.grade', `Grade: First`),
                h('p', [
                    `In my second year `,
                    h('strong', `I won an award for “Best Year Two Performance
                    Award in ICS”`),
                    `. For my final year project I built `,
                    h('a', { href: 'https://vimeo.com/69376016' }, [
                        h('strong', `Sbscribe`),
                        `, a social feed reader`
                    ]),
                    ` (`,
                    h('a', {
                        href: 'https://github.com/OliverJAsh/sbscribe',
                        title: 'View project on GitHub'
                    }, `open source`),
                    `). `,
                    h('strong', `I won an award for “Best Individual Final Year Project in ICS”`),
                    `. I studied modules in journalism, internet policy, web
                    design and development, motion graphics, and gaming.`
                ]),
                h('div.time-entry', [
                    h('h3', `BTEC National Diploma, Computing (Software Development) at Bedford College`),
                    h('div', [
                        h('time', `2008`),
                        ` – `,
                        h('time', `2010`)
                    ])
                ]),
                h('p.grade', `Grade: 3 distinctions`),
                h('div.time-entry', [
                    h('h3', `GCSEs at Redborne Upper School`),
                    h('div', [
                        h('time', `2005`),
                        ` – `,
                        h('time', `2008`)
                    ])
                ]),
                h('p.grade', `Grades: 7 As and 6 Bs`)
            ]),
            h('section', [
                h('h2', `Personal details`),
                h('div', [
                    h('dl', [
                        h('dt', `Twitter`),
                        h('dd', [
                            h('a', { href: 'https://twitter.com/OliverJAsh' }, `https://twitter.com/OliverJAsh`)
                        ]),
                        h('dt', `GitHub`),
                        h('dd', [
                            h('a', { href: 'https://github.com/OliverJAsh' }, `https://github.com/OliverJAsh`)
                        ]),
                        h('dt', `Technical blogs`),
                        h('dd', [
                            h('a', { href: 'https://oliverjash.me/' }, `https://oliverjash.me/`)
                        ]),
                        h('dd', [
                            h('a', { href: 'http://www.theguardian.com/profile/oliver-joseph-ash' }, `http://www.theguardian.com/profile/oliver-joseph-ash`)
                        ]),
                        h('dt', `Photography blog`),
                        h('dd', [
                            h('a', { href: 'https://samefourchords.com/' }, `https://samefourchords.com/`)
                        ]),
                        h('dt', `Birth`),
                        h('dd', [
                            h('time', `1992-08-29T22:00:00Z`)
                        ]),
                        h('dt', `Email address`),
                        h('dd', [
                            h('span', [
                                h('a', { href: 'mailto:oliverjash@gmail.com' }, `oliverjash@gmail.com`)
                            ])
                        ]),
                        h('dt', `Phone number`),
                        h('dd', [
                            h('span', [
                                h('a', { href: 'tel:+447545968290' }, `+44 7545 968290`)
                            ])
                        ]),
                        h('dt', `Location`),
                        h('dd', [
                            h('address', `London, England`)
                        ])
                    ])
                ])
            ]),
            h('section', [
                h('h2', `References`),
                h('dl', [
                    h('dt', `Sébastien Cevey`),
                    h('dd', `Senior Software Engineer and Tech Lead at the Guardian (now located at Google)`),
                    h('dd', [
                        h('a', { href: 'mailto:seb@cine7.net' }, `seb@cine7.net`)
                    ]),
                    h('dt', `Dominic Kendrick`),
                    h('dd', `Developer Manager at the Guardian`),
                    h('dd', [
                        h('a', { href: 'mailto:dominic.kendrick@theguardian.com' }, `dominic.kendrick@theguardian.com`)
                    ])
                ])
            ])
        ])
    ]);
    return mainView({ title: 'CV', body });
};
