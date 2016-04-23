import http from 'http';
import fs from 'fs';
import express from 'express';
import compression from 'compression';
import treeToHTML from 'vdom-to-html';
import dateFormat from 'dateformat';
import slug from 'slug';
import fsP from 'promised-io/fs';
import sortBy from 'lodash/collection/sortBy';
import pick from 'lodash/object/pick';

import postView from './views/post';
import homeView from './views/home';
import errorView from './views/error';
import { log } from './helpers';

const homeRegExp = /^\/$/;
const postPrefixRegExp = /^\/(\d{4})\/(\d{2})\/(\d{2})\/([a-z0-9-]*)/;
const postRegExp = new RegExp(postPrefixRegExp.source + /$/.source);

process.on('uncaughtException', error => {
    log(error.stack);
    process.exit(1);
});

const postsDir = `${__dirname}/posts`;
const getPosts = () => (
    fsP.readdir(postsDir)
        .then(fileNames => fileNames.map(fileName => require(`${postsDir}/${fileName}`).default))
);
const getPost = (year, month, date, title) => {
    let post;
    const fileName = `${year}-${month}-${date}-${title}`;
    try {
        post = require(`${postsDir}/${fileName}`);
    } catch(error) {
        log(`Post not found: ${fileName}`);
    }
    return post && post.default;
};

const getPostSlug = post => (
    `${dateFormat(post.date, 'yyyy/mm/dd')}/${slug(post.title, { lower: true })}`
);

const built = [
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

const app = express();

// Remember: order matters!

app.use(compression());

const secondsInAYear = 365 * 24 * 60 * 60;
const publicDir = `${__dirname}/public`;
app.use('/', express.static(publicDir, { maxAge: secondsInAYear * 1000 }));

const sortPostsByDateDesc = posts => sortBy(posts, post => post.date).reverse();

const docType = '<!DOCTYPE html>';
const stringifyTree = (x) => (
    docType + treeToHTML(x)
);

const siteRouter = express.Router();

//
// Site
//

// We cache pages but we must ensure old assets are available

siteRouter.use((req, res, next) => {
    if (req.accepts('html')) {
        next();
    } else {
        res.sendStatus(400);
    }
});

siteRouter.get(homeRegExp, (req, res) => {
    getPosts()
        .then(posts => (
            sortPostsByDateDesc(
                posts
                    .map(post => Object.assign({}, post, { href: getPostSlug(post) }))
                    .concat(externalArticles)
                    // Trim state to reduce page size
                    .map(post => pick(post, 'title', 'href', 'date', 'showcase'))
            )
        ))
        .then(posts => {
            const response = stringifyTree(homeView(built, talks, posts));
            res
                .set('Cache-Control', 'public, max-age=60')
                .send(response);
        });
});

siteRouter.get(postRegExp, (req, res, next) => {
    const { 0: year, 1: month, 2: date, 3: title } = req.params;
    const post = getPost(year, month, date, title);
    if (post) {
        const response = stringifyTree(postView([ req.path.replace(/^\//, ''), post ]));
        res
            .set('Cache-Control', 'public, max-age=60')
            .send(response);
    } else {
        next();
    }
});

siteRouter.get(new RegExp(postPrefixRegExp.source + /\.html$/.source), (req, res) => {
    const newPath = req.path.replace(/\.html$/, '');
    res.redirect(301, newPath);
});

siteRouter.use((req, res) => {
    const state = { statusCode: 404, message: http.STATUS_CODES[404] };
    const response = stringifyTree(errorView(state));
    res.status(404).send(response);
});

app.use('/', siteRouter);

app.use((req, res) => res.status(404).send());

app.use((error, req, res, next) => {
    log(error.stack);
    res.sendStatus(500);
});

const onListen = server => {
    const { port } = server.address();

    log(`Server running on port ${port}`);
};

const httpServer = http.createServer(app);
httpServer.listen(8080, () => onListen(httpServer));
