import {browser, Menus, Tabs} from 'webextension-polyfill-ts';
import {toId} from './util';

export class Listeners {
  static closeTabsToLeft(info: Menus.OnClickData, target: Tabs.Tab): Promise<void> {
    return browser.tabs
      .query({currentWindow: true})
      .then(tabs => tabs.filter(tab => tab.index < target.index).map(toId))
      .then(browser.tabs.remove);
  }
}
