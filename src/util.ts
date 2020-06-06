import {Tabs} from 'webextension-polyfill-ts';

export const toId: (item: Tabs.Tab) => number = item => item.id!;
