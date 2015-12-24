export const homeRegExp = /^\/$/;
export const postPrefixRegExp = /^\/(\d{4})\/(\d{2})\/(\d{2})\/([a-z0-9-]*)/;
export const postRegExp = new RegExp(postPrefixRegExp.source + /$/.source);
