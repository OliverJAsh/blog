import * as fs from 'fs';
import * as pathHelpers from 'path';
import * as mkdirP from 'mkdirp';
import treeToHTML = require('vdom-to-html');
import dateFormat = require('dateformat');
import slug = require('slug');
import { sortBy } from 'lodash';
import * as denodeify from 'denodeify';

import postView from './views/post';
import homeView from './views/home';
import cvView from './views/cv';

import { Post, PostJson, PostPreview, Talk, Project } from './models';

const log = (message: string) => {
    console.log(`${new Date().toISOString()} ${message}`);
};

process.on('uncaughtException', (error: Error) => {
    log(error.stack as string);
    process.exit(1);
});

const readFile = denodeify(fs.readFile);
const loadFile = (path: string): Promise<string> => readFile(path).then(buffer => buffer.toString());
const loadJsonFile = <A>(path: string): Promise<A> => loadFile(path).then(jsonString => JSON.parse(jsonString));
const postsDir = `${__dirname}/posts`;
const loadPost = (fileName: string): Promise<PostJson> => loadJsonFile<PostJson>(`${postsDir}/${fileName}`);

const readdir = denodeify(fs.readdir);
const postsPromise: Promise<Array<PostJson>> = (
    readdir(postsDir).then(((fileNames: string[]) => Promise.all(fileNames.map(loadPost))))
);


const getPostSlug = (postJson: PostJson): string => (
    `${dateFormat(new Date(postJson.date), 'yyyy/mm/dd')}/${slug(postJson.title, { lower: true })}`
);

// // Remember: order matters!

const sortPostsByDateDesc = (posts: Array<PostPreview>) => sortBy(posts, post => post.date).reverse();

const docType = '<!DOCTYPE html>';
const stringifyTree = (tree: VirtualDOM.VNode) => docType + treeToHTML(tree);

const postJsonToPost = (postJson: PostJson): Post => (
    {
        showcase: postJson.showcase,
        title: postJson.title,
        description: postJson.description,
        date: new Date(postJson.date),
        body: postJson.body,
        href: `/${getPostSlug(postJson)}`
    }
);

const projects: Array<Project> = [
    { title: 'Scribe, a web rich text editor, built for the Guardian\'s CMS', href: 'https://github.com/guardian/scribe' },
    { title: 'Sbscribe, a social news and feed reader. ', href: 'https://vimeo.com/69376016' },
    { title: 'the Guardian’s offline page', href: 'https://www.theguardian.com/info/developer-blog/2015/nov/04/building-an-offline-page-for-theguardiancom' },
    { title: 'Chrome extension for editing URL query parameters, written in Elm', href: 'https://github.com/OliverJAsh/query-params-chrome' },
    { title: 'Chrome extension for easily viewing and switching A/B tests on theguardian.com, written in Cycle.js', href: 'https://github.com/OliverJAsh/guardian-ab-tests-chrome' },
    { title: 'a seed project for creating a blog using TypeScript', href: 'https://github.com/OliverJAsh/simple-typescript-blog' },
    { title: 'a simple offline blog to demonstrate service worker capabitilies', href: 'https://github.com/OliverJAsh/simple-offline-blog' },
    { title: 'a dashboard to easily view deploys of theguardian.com, written in TypeScript', href: 'https://github.com/guardian/frontend/pull/11356' },
    { title: 'the Guardian’s developer site', href: 'http://developers.theguardian.com/' },
];

const talks: Array<Talk> = [
    { title: 'Building an offline page for theguardian.com', href: 'https://www.youtube.com/watch?v=hx1fqAXXViA', description: 'Native apps have long had tools to give users good experiences when they have poor internet connectivity or none at all. With service workers, the web is catching up. This talk demonstrates how I built the Guardian’s offline page.' },
    { title: 'Building a CMS for the responsive web', href: 'https://www.youtube.com/watch?v=31EpyxcmBeU', description: 'In light of responsive web design, people often focus heavily on how content should be rendered, but how it is produced is usually overlooked. This talk reviews how the challenges of responsive web design can bleed into issues of content production, and how the Guardian solves these issues with Composer – our web-based, digital content-management system.' }
];
const externalPosts: Array<PostPreview> = [
    { title: 'How we gradually migrated to TypeScript at Unsplash', href: 'https://medium.com/unsplash/how-we-gradually-migrated-to-typescript-at-unsplash-7a34caa24ef1', date: new Date(2018, 2, 14) },
    { title: 'Avoiding CSS overrides in responsive components', href: 'https://gist.github.com/OliverJAsh/1ebecee004e1bbc816e0b65086c7abee', date: new Date(2017, 11, 8) },
    { title: 'express-fp: an Express wrapper for type safe request handlers', href: 'https://medium.com/@oliverjash_42600/express-fp-an-express-wrapper-for-type-safe-request-handlers-f8c411cc4a7b', date: new Date(2017, 10, 12) },
    { title: 'Building an offline page for theguardian.com', href: 'https://www.theguardian.com/info/developer-blog/2015/nov/04/building-an-offline-page-for-theguardiancom', date: new Date(2015, 10, 4) },
    { title: 'Introducing the new Guardian Developers Site', href: 'https://www.theguardian.com/info/developer-blog/2014/jul/22/introducing-the-new-guardian-developers-site', date: new Date(2014, 6, 22) },
    { title: 'Inside the Guardian’s CMS: meet Scribe, an extensible rich text editor', href: 'https://www.theguardian.com/info/developer-blog/2014/mar/20/inside-the-guardians-cms-meet-scribe-an-extensible-rich-text-editor', date: new Date(2014, 2, 20) }
];

//
// Site
//

const GENERATED_DIR = pathHelpers.join(__dirname, '..', '..', 'generated');

postsPromise
    .then(posts => (
        sortPostsByDateDesc(
            posts
                .map(postJsonToPost)
                .filter(post => (post.date.getFullYear() > 2013) || post.showcase)
                .map((post): PostPreview => post)
                .concat(externalPosts)
        )
    ))
    .then(posts => {
        const html = stringifyTree(homeView(projects, talks, posts));
        fs.writeFileSync(pathHelpers.join(GENERATED_DIR, 'index.html'), html);
    })

postsPromise
    .then(posts => {
        posts.forEach(postJson => {
            const post = postJsonToPost(postJson)
            const html = stringifyTree(postView(post));
            const path = `${getPostSlug(postJson)}.html`;
            const fullPath = pathHelpers.join(GENERATED_DIR, path);
            const fullPathDir = pathHelpers.dirname(fullPath);

            mkdirP.sync(fullPathDir)
            fs.writeFileSync(fullPath, html)
        })
    });

(() => {
    const html = stringifyTree(cvView())
    fs.writeFileSync(pathHelpers.join(GENERATED_DIR, 'cv.html'), html);
})();
