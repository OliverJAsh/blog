import h from 'virtual-dom/h';

export default (data) => Promise.resolve(h('p', data.message));
