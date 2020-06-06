import {browser, Menus, Tabs} from 'webextension-polyfill-ts';

export class Lifecycle {
  init(onclick: (info: Menus.OnClickData, target: Tabs.Tab) => void): number | string {
    return browser.menus.create(
      {
        id: 'tab-close-to-left',
        type: 'normal',
        contexts: ['tab'],
        title: 'Close Tabs to the Left',
        onclick: onclick,
      },
      this.onCreated,
    );
  }

  onCreated(): void {
    if (browser.runtime.lastError) {
      console.error(`Error: ${browser.runtime.lastError}`);
    } else {
      console.debug('Item created successfully');
    }
  }
}
