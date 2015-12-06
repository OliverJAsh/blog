export const map = (collection, mapFn) => (
    Object.keys(collection).map(key => mapFn(collection[key], key))
);
export const reduce = (collection, reduceFn, seed) => (
    Object.keys(collection).reduce((acc, key) => {
        const value = collection[key];
        return reduceFn(acc, value, key);
    }, seed)
);
export const mapKeys = (collection, mapFn) => (
    reduce(collection, (acc, value, key) => {
        acc[mapFn(value, key)] = value;
        return acc;
    }, {})
);
export const contains = (array, itemToFind) => array.some(item => item === itemToFind);
