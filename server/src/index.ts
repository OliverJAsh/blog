/// <reference path="../typings/main.d.ts" />
/// <reference path="../manual-typings/main.d.ts" />

// https://github.com/Microsoft/TypeScript/issues/3005
/// <reference path="../../node_modules/typescript/lib/lib.es6.d.ts" />

import * as http from 'http';
import * as fs from 'fs';
import * as express from 'express';
import * as compression from 'compression';
import treeToHTML = require('vdom-to-html');
import dateFormat = require('dateformat');
import slug = require('slug');
import { sortBy } from 'lodash';
import * as denodeify from 'denodeify';

import postView from './views/post';
import homeView from './views/home';
import errorView from './views/error';

import { Post, PostJson } from './models';

const homeRegExp = /^\/$/;
const postPrefixRegExp = /^\/(\d{4})\/(\d{2})\/(\d{2})\/([a-z0-9-]*)/;
const postRegExp = new RegExp(postPrefixRegExp.source + /$/.source);

const log = (message: string) => {
    console.log(`${new Date().toISOString()} ${message}`);
};

process.on('uncaughtException', (error: Error) => {
    log(error.stack);
    process.exit(1);
});

const readFile = denodeify(fs.readFile);
const loadFile = (path: string): Promise<string> => readFile(path).then(buffer => buffer.toString());
const loadJsonFile = <A>(path: string): Promise<A> => loadFile(path).then(jsonString => JSON.parse(jsonString));
const postsDir = `${__dirname}/posts`;
const loadPost = (fileName: string): Promise<PostJson> => loadJsonFile<PostJson>(`${postsDir}/${fileName}`);

const readdir = denodeify(fs.readdir);
const getPosts = (): Promise<Array<PostJson>> => (
    readdir(postsDir).then(fileNames => Promise.all(fileNames.map(fileName => loadPost(fileName))))
);
const getPost = (year: string, month: string, date: string, title: string): Promise<PostJson> => (
    loadPost(`${year}-${month}-${date}-${title}.json`)
);

const getPostSlug = (postJson: PostJson) => (
    `${dateFormat(new Date(postJson.date), 'yyyy/mm/dd')}/${slug(postJson.title, { lower: true })}`
);

const app = express();

// // Remember: order matters!

app.use(compression());

const secondsInAYear = 365 * 24 * 60 * 60;
const publicDir = `${__dirname}/client`;
app.use('/', express.static(publicDir, { maxAge: secondsInAYear * 1000 }));

const sortPostsByDateDesc = (posts: Array<Post>) => sortBy(posts, post => post.date).reverse();

const docType = '<!DOCTYPE html>';
const stringifyTree = (tree: VirtualDOM.VNode) => docType + treeToHTML(tree);

const siteRouter = express.Router();

const postJsonToPost = (postJson: PostJson): Post => (
    {
        showcase: postJson.showcase,
        title: postJson.title,
        date: new Date(postJson.date),
        body: postJson.body,
        href: `/${getPostSlug(postJson)}`
    }
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

siteRouter.get(homeRegExp, (req, res, next) => (
    getPosts()
        .then(posts => sortPostsByDateDesc(posts.map(postJsonToPost)))
        .then(posts => {
            const response = stringifyTree(homeView(built, talks, posts));
            res
                .set('Cache-Control', 'public, max-age=60')
                .send(response);
        })
        .catch(next)
));

siteRouter.get(postRegExp, (req, res, next) => {
    const { 0: year, 1: month, 2: date, 3: title } = req.params;
    getPost(year, month, date, title)
        .then(postJson => {
            if (postJson) {
                const post = postJsonToPost(postJson);
                const response = stringifyTree(postView(post));
                res
                    .set('Cache-Control', 'public, max-age=60')
                    .send(response);
            } else {
                next();
            }
        })
        .catch(next);
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

app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    log(error.stack);
    res.sendStatus(500);
});

const isDev = app.settings.env === 'development';
const onListen = (server: http.Server) => {
    const { port } = server.address();

    log(`Server running on port ${port}`);
};

const httpServer = http.createServer(app);
httpServer.listen(process.env.PORT || 8080, () => onListen(httpServer));