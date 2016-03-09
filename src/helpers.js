export const log = message => {
    console.log(`${new Date().toISOString()} ${message}`);
};

// Used in hyperscript because children cannot be booleans
// https://github.com/Matt-Esch/virtual-dom/issues/326
export const exp = (condition) => condition ? true : undefined;

