import {browser, Menus, Tabs} from 'webextension-polyfill-ts';

function closeTabsToLeft(info: Menus.OnClickData, target: Tabs.Tab) {
  return browser.tabs
    .query({currentWindow: true})
    .then(tabs => tabs.filter(tab => tab.index < target.index).map(toId))
    .then(browser.tabs.remove);
}

/*
 * Lil helpers
 */
const toId = (item: Tabs.Tab) => item.id!;
