import http from 'http';
import express from 'express';
import compression from 'compression';
import treeToHTML from 'vdom-to-html';

import mainView from './main';

import { getPageTemplate, getErrorPageTemplate } from './shared/helpers';

const posts = [
    { id: 'my-first-article', title: 'My First Article', body: '<p>Hello, World!</p>', date: new Date(2015, 0, 1) },
    { id: 'my-second-article', title: 'My Second Article', body: '<p>Goodbye, World!</p>', date: new Date(2015, 0, 2) }
];

const postIdToPostMap = posts.reduce((accumulator, post) => {
    accumulator[post.id] = post;
    return accumulator;
}, {});

const app = express();

app.use(compression());

// Order matters
const secondsInAYear = 365 * 24 * 60 * 60;
app.use('/js', express.static(`${__dirname}/public/js`, { maxAge: secondsInAYear * 1000 }));
// We don't want the service worker to have a cache max age
app.use('/', express.static(`${__dirname}/public`));

const sortPostsByDateDesc = a => a.sort((postA, postB) => postA.date < postB.date);

//
// Content API
//
var apiRouter = express.Router();

apiRouter.get('/posts', (req, res) => (
    res.send(sortPostsByDateDesc(posts))
));

apiRouter.get('/posts/:postId', (req, res, next) => {
    const post = postIdToPostMap[req.params.postId];
    if (post) {
        res.send(post);
    } else {
        next();
    }
});

apiRouter.use((req, res) => (
    res.status(404).send({ message: http.STATUS_CODES[404] })
));

//
// Site
//
var siteRouter = express.Router();

const render = (page, state) => (
    page.getTree(state)
        .then(node => mainView({ title: page.getTitle(state), state, body: node }))
        .then(treeToHTML)
);

siteRouter.get('/', (req, res, next) => {
    const state = sortPostsByDateDesc(posts);
    const page = getPageTemplate(req.path);
    render(page, state)
        .then(html => res.send(html))
        .catch(next);
});

siteRouter.get('/posts/:postId', (req, res, next) => {
    const state = postIdToPostMap[req.params.postId];
    if (state) {
        const page = getPageTemplate(req.path);
        render(page, state)
            .then(html => res.send(html))
            .catch(next);
    } else {
        next();
    }
});

siteRouter.use((req, res, next) => {
    const state = { statusCode: 404, message: http.STATUS_CODES[404] };
    render(getErrorPageTemplate(), state)
        .then(html => res.status(404).send(html))
        .catch(next);
});

// Order matters
app.use('/api', apiRouter);
app.use('/', siteRouter);

const server = app.listen(process.env.PORT || 8080, () => {
    const { port } = server.address();

    console.log(`Server running on port ${port}`);
});
