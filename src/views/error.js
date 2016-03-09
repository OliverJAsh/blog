import h from 'virtual-dom/h';
import mainView from './main';

export default (state) => mainView({
    title: state.message,
    body: h('p', state.message)
});
