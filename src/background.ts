import {Lifecycle} from './lifecycle';
import {Listeners} from './listeners';

const lifecycle = new Lifecycle();
lifecycle.init(Listeners.closeTabsToLeft);
