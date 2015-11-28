const domContentLoaded = 'DOMContentLoaded';

const promise = new Promise((resolve, reject) => {
    let loaded = /^loaded|^i|^c/.test(document.readyState);
    if (loaded) {
        resolve();
    } else {
        const listener = () => {
            // If an async error occurs we want to push it to the promise
            try {
                document.removeEventListener(domContentLoaded, listener);
                resolve();
            } catch (error) {
                reject(error);
            }
        };
        document.addEventListener(domContentLoaded, listener);
    }
});

const waitForDomReady = fn => promise.then(fn);

export default waitForDomReady;
