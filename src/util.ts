import {Tabs} from 'webextension-polyfill';

export const MENU_ITEM_ID = 'tab-close-to-left';

export const toId: (item: Tabs.Tab) => number = item => item.id!;
export const minimizingIndex: (max: Tabs.Tab, cur: Tabs.Tab) => Tabs.Tab = (max, cur) =>
  cur.index < max.index ? cur : max;
