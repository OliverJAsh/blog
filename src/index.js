import http from 'http';
import https from 'https';
import fs from 'fs';
import express from 'express';
import compression from 'compression';
import treeToHTML from 'vdom-to-html';
import dateFormat from 'dateformat';
import slug from 'slug';
import fsP from 'promised-io/fs';

import mainView from './main';

import { getPageTemplate, getErrorPageTemplate } from './shared/helpers';
import { homeRegExp, postRegExp } from './shared/routing-reg-exps';

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
        console.info(`Post not found: ${fileName}`);
    }
    return post && post.default;
};

const getPostSlug = post => (
    `${dateFormat(post.date, 'yyyy/mm/dd')}/${slug(post.title, { lower: true })}`
);
// We do this on the server-side to reduce client-side JS
const zipPostsWithSlugs = posts => posts.map(post => [getPostSlug(post), post]);

const app = express();

app.use(compression());

// Order matters
const secondsInAYear = 365 * 24 * 60 * 60;
app.use('/js', express.static(`${__dirname}/public/js`, { maxAge: secondsInAYear * 1000 }));
// We don't want the service worker to have a cache max age
app.use('/', express.static(`${__dirname}/public`));

const sortPostsByDateDesc = a => a.sort((postA, postB) => postA.date < postB.date);

//
// Site
//
const siteRouter = express.Router();

const docType = '<!DOCTYPE html>';
const render = (page, state) => (
    page.getTree(state)
        .then(node => mainView({ title: page.getTitle(state), state, body: node }))
        .then(treeToHTML)
        .then(html => docType + html)
);

siteRouter.get(homeRegExp, (req, res, next) => {
    getPosts().then(posts => {
        const state = zipPostsWithSlugs(sortPostsByDateDesc(posts));
        if (req.accepts('html')) {
            const page = getPageTemplate(req.path);
            render(page, state)
                .then(html => res.send(html))
                .catch(next);
        } else if (req.accepts('json')) {
            res.send(state);
        } else {
            res.sendStatus(400);
        }
    });
});

siteRouter.get(postRegExp, (req, res, next) => {
    const { 0: year, 1: month, 2: date, 3: title } = req.params;
    const post = getPost(year, month, date, title);
    if (post) {
        if (req.accepts('html')) {
            const page = getPageTemplate(req.path);
            render(page, post)
                .then(html => res.send(html))
                .catch(next);
        } else if (req.accepts('json')) {
            res.send(post);
        } else {
            res.sendStatus(400);
        }
    } else {
        next();
    }
});

siteRouter.use((req, res, next) => {
    const state = { statusCode: 404, message: http.STATUS_CODES[404] };
    if (req.accepts('html')) {
        render(getErrorPageTemplate(), state)
            .then(html => res.status(404).send(html))
            .catch(next);
    } else if (req.accepts('json')) {
        res.status(404).send(state);
    } else {
        res.status(404).send();
    }
});

app.use('/', siteRouter);

const isDev = app.settings.env === 'development';
const onListen = server => {
    const { port } = server.address();

    console.log(`Server running on port ${port}`);
};

if (isDev) {
    const httpServer = http.createServer(app);
    httpServer.listen(8080, () => onListen(httpServer));
} else {
    const path = '/etc/letsencrypt/live/oliverjash.tk';
    const key = fs.readFileSync(`${path}/privkey.pem`);
    const cert = fs.readFileSync(`${path}/fullchain.pem`);
    const ca = fs.readFileSync(`${path}/chain.pem`);
    const credentials = { key, cert, ca };

    const redirectApp = express();
    redirectApp.use((req, res, next) => {
        if (req.secure) {
            next();
        } else {
            return res.redirect(`https://${req.get('host')}${req.url}`);
        }
    });

    const httpServer = http.createServer(redirectApp);
    httpServer.listen(80, () => onListen(httpServer));
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443, () => onListen(httpsServer));
}
