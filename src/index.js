import http from 'http';
import https from 'https';
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
// We do this on the server-side to reduce client-side JS
const zipPostsWithSlugs = posts => posts.map(post => [getPostSlug(post), post]);

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
            // Trim state to reduce page size
            zipPostsWithSlugs(
                sortPostsByDateDesc(posts).map(post => pick(post, 'title', 'date', 'showcase'))
            )
        ))
        .then(posts => {
            const response = stringifyTree(homeView(posts));
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

const isDev = app.settings.env === 'development';
const onListen = server => {
    const { port } = server.address();

    log(`Server running on port ${port}`);
};

if (isDev) {
    const httpServer = http.createServer(app);
    httpServer.listen(8080, () => onListen(httpServer));
} else {
    const path = '/etc/letsencrypt/live/oliverjash.me';
    const key = fs.readFileSync(`${path}/privkey.pem`);
    const cert = fs.readFileSync(`${path}/fullchain.pem`);
    const ca = fs.readFileSync(`${path}/chain.pem`);
    const credentials = { key, cert, ca };

    const httpServer = http.createServer(app);
    httpServer.listen(80, () => onListen(httpServer));
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443, () => onListen(httpsServer));
}
