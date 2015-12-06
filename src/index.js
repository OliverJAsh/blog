import http from 'http';
import express from 'express';
import compression from 'compression';
import treeToHTML from 'vdom-to-html';
import dateFormat from 'dateformat';
import slug from 'slug';

import mainView from './main';

import { getPageTemplate, getErrorPageTemplate, postRegExp } from './shared/helpers';

const posts = [
    { title: 'My First Article', body: '<p>Hello, World!</p>', date: new Date(2015, 0, 1) },
    { title: 'My Second Article', body: '<p>Goodbye, World!</p>', date: new Date(2015, 0, 2) }
];

const getPostSlug = post => (
    `${dateFormat(post.date, 'yyyy/mm/dd')}/${slug(post.title, { lower: true })}`
);
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

siteRouter.get('/', (req, res, next) => {
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

siteRouter.get(postRegExp, (req, res, next) => {
    const slug = req.path.replace(/^\//, '');
    const state = zipPostsWithSlugs(posts).find(postWithSlug => postWithSlug[0] === slug);
    if (state) {
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

const server = app.listen(process.env.PORT || 8080, () => {
    const { port } = server.address();

    console.log(`Server running on port ${port}`);
});
