import {browser, Menus, Tabs} from 'webextension-polyfill-ts';

function onCreated() {
  if (browser.runtime.lastError) {
    console.error(`Error: ${browser.runtime.lastError}`);
  } else {
    console.debug('Item created successfully');
  }
}

function closeTabsToLeft(info: Menus.OnClickData, target: Tabs.Tab) {
  return browser.tabs
    .query({currentWindow: true})
    .then(tabs => tabs.filter(tab => tab.index < target.index).map(toId))
    .then(browser.tabs.remove);
}

browser.menus.create(
  {
    id: 'tab-close-to-left',
    type: 'normal',
    contexts: ['tab'],
    title: 'Close Tabs to the Left',
    onclick: closeTabsToLeft,
  },
  onCreated,
);

/*
 * Lil helpers
 */
const toId = (item: Tabs.Tab) => item.id!;
