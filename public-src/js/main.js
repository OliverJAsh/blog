import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import domToVdom from 'vdom-virtualize';

import errorView from '../../shared/views/error';
import homeView from '../../shared/views/home';
import postView from '../../shared/views/post';

import { isContentCached, getContentUrl } from '../../shared/helpers';

import waitForDomReady from './wait-for-dom-ready';

navigator.serviceWorker.register('/service-worker.js')
    .then(() => {
        console.log('Service worker registered');
    });

let rootNode = document.querySelector('html');
let currentTree;

const updateContent = ({ source, tree: newTree }) => (
    waitForDomReady().then(() => {
        if (!currentTree) {
            currentTree = domToVdom(rootNode);
        }
        console.log(`Render: from ${source}`);
        console.timeStamp(`Render: from ${source}`);
        const patches = diff(currentTree, newTree);
        rootNode = patch(rootNode, patches);
        currentTree = newTree;
    })
);

// Serve from cache or else network. When serving from cache,
// fetch the newest content from the network to update the
// content on screen and then revalidate the cache.
// This function has side effects.
const handlePageState = (contentId, { shouldCache, renderTemplate }) => {
    const url = getContentUrl(contentId);
    const networkPromise = fetch(url);
    const cachePromise = caches.match(url);

    // Cache or else network
    const initialRender = () => (
        cachePromise
            .then(cacheResponse => {
                if (cacheResponse) {
                    return cacheResponse.clone().json()
                        .then(renderTemplate)
                        .then(tree => ({ source: 'cache', tree }));
                } else {
                    return networkPromise
                        .then(networkResponse => {
                            if (networkResponse.ok) {
                                return networkResponse.clone().json()
                                    .then(renderTemplate);
                            } else {
                                return networkResponse.clone().json()
                                    .then(errorView);
                            }
                        }, error => errorView({ message: error.message }))
                        .then(tree => ({ source: 'network', tree }));
                }
            })
            .then(updateContent)
    );

    // If previously served from cache, update the content on screen from the
    // network (if response was OK)
    const conditionalNetworkRender = () => (
        cachePromise.then(cacheResponse =>
            networkPromise.then(networkResponse => {
                if (cacheResponse && networkResponse.ok) {
                    return networkResponse.clone().json()
                        .then(renderTemplate)
                        .then(tree => ({ source: 'network', tree }))
                        .then(updateContent);
                }
            })
        )
    );

    const renders = () => {
        const templateDataNode = document.querySelector('#template-data');
        const templateData = templateDataNode && JSON.parse(templateDataNode.text);
        if (templateData) {
            // Re-render to enhance
            // Duck type error page
            const renderFn = templateData.statusCode && templateData.statusCode !== 200
                ? errorView
                : renderTemplate;
            return renderFn(templateData).then(tree => updateContent({ source: 'template-data', tree }));
        } else {
            return initialRender().then(conditionalNetworkRender);
        }
    };

    return renders().then(() => {
        if (shouldCache) {
            networkPromise.then(networkResponse => {
                if (networkResponse.ok) {
                    console.log('Cache: update');
                    return caches.open('content').then(cache => cache.put(url, networkResponse.clone()));
                }
            });
        }
    });
};

//
// Routing
//

const homeRegExp = /^\/$/;
const postRegExp = /^\/posts\/(.*)$/;
if (homeRegExp.test(location.pathname)) {
    const contentId = 'posts';

    handlePageState(contentId, {
        shouldCache: true,
        renderTemplate: homeView
    });
}
else if (postRegExp.test(location.pathname)) {
    const contentId = 'posts/' + location.pathname.match(postRegExp)[1];

    isContentCached(contentId).then(isCached =>
        handlePageState(contentId, {
            shouldCache: isCached,
            renderTemplate: postView
        })
    );
}
