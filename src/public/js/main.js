import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import domToVdom from 'vdom-virtualize';

import { isContentCached, getPageTemplate, getErrorPageTemplate, getPageTitle, canCache } from '../../shared/helpers';

import waitForDomReady from './wait-for-dom-ready';

const navigator = window.navigator;
if (navigator && navigator.serviceWorker) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => {
            console.log('Service worker registered');
        });
}

let rootNode = document.querySelector('#root');
let currentTree;

const updateContent = ({ source, page: { tree: newTreePromise, title } }) => (
    waitForDomReady().then(() => {
        return newTreePromise.then(newTree => {
            if (!currentTree) {
                currentTree = domToVdom(rootNode);
            }
            console.log(`Render: from ${source}`);
            console.timeStamp(`Render: from ${source}`);
            const patches = diff(currentTree, newTree);
            rootNode = patch(rootNode, patches);
            currentTree = newTree;

            document.title = getPageTitle(title);
        });
    })
);

const createPage = (pageTemplate, state) => ({
    tree: pageTemplate.getTree(state),
    title: pageTemplate.getTitle(state)
});

// Serve from cache or else network. When serving from cache,
// fetch the newest content from the network to update the
// content on screen and then revalidate the cache.
// This function has side effects.
const handlePageState = (pageTemplate) => {
    const url = pageTemplate.url;
    const networkPromise = fetch(url, { headers: { 'Accept': 'application/json' } });
    const cachePromise = Promise.resolve(canCache && caches.match(url));

    // Cache or else network
    const initialRender = () => (
        cachePromise
            .then(cacheResponse => {
                if (cacheResponse) {
                    return cacheResponse.clone().json()
                        .then(state => ({ source: 'cache', page: createPage(pageTemplate, state) }));
                } else {
                    return networkPromise
                        .then(networkResponse => {
                            if (networkResponse.ok) {
                                return networkResponse.clone().json()
                                    .then(state => createPage(pageTemplate, state));
                            } else {
                                return networkResponse.clone().json()
                                    .then(error => createPage(getErrorPageTemplate(), error));
                            }
                        }, error => createPage(getErrorPageTemplate(), error))
                        .then(page => ({ source: 'network', page }));
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
                        .then(state => ({ source: 'network', page: createPage(pageTemplate, state) }))
                        .then(updateContent);
                }
            })
        )
    );

    const renders = () => {
        const stateNode = document.querySelector('#state');
        const currentState = stateNode && JSON.parse(stateNode.text);
        if (currentState) {
            // Re-render to enhance
            // Duck type error page
            const page = currentState.statusCode && currentState.statusCode !== 200
                ? createPage(getErrorPageTemplate(), currentState)
                : createPage(pageTemplate, currentState);
            return updateContent({ source: 'current-state', page });
        } else {
            return initialRender().then(conditionalNetworkRender);
        }
    };

    const shouldCachePromise = Promise.resolve(
        canCache &&
        (pageTemplate.shouldCache || isContentCached(pageTemplate.url))
    );

    return renders().then(() => {
        shouldCachePromise.then(shouldCache => {
            if (shouldCache) {
                networkPromise.then(networkResponse => {
                    if (networkResponse.ok) {
                        console.log('Cache: update');
                        return caches.open('content').then(cache => cache.put(url, networkResponse.clone()));
                    }
                });
            }
        });
    });
};

//
// Routing
//

const page = getPageTemplate(location.pathname);
handlePageState(page);
