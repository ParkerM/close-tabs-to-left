import {browser, Menus, Tabs} from 'webextension-polyfill-ts';
import {MENU_ITEM_ID, minimizingIndex, toId} from './util';
import OnShownInfoType = Menus.OnShownInfoType;
import Tab = Tabs.Tab;

export abstract class Listeners {
  static lastMenuInstanceId = 0;
  static nextMenuInstanceId = 1;

  static closeTabsToLeft(info: Menus.OnClickData, target: Tabs.Tab): Promise<void> {
    return browser.tabs
      .query({currentWindow: true})
      .then(tabs => tabs.filter(tab => tab.index < target.index).map(toId))
      .then(browser.tabs.remove);
  }

  /**
   * Toggles the enabled state of the Close Tabs to the Left button.
   * If targetTab has the same index as the leftmost tab in the current window, the menu button is disabled.
   * Otherwise, the menu button is enabled.
   *
   * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus/onShown
   */
  static updateEnabledState: (info: OnShownInfoType, targetTab: Tab | undefined) => void = async (info, targetTab) => {
    // If targetTab is undefined then this is not a tab menu
    if (!targetTab) return;

    const menuInstanceId = Listeners.nextMenuInstanceId++;
    Listeners.lastMenuInstanceId = menuInstanceId;

    const leftmostTabInCurrentWindow: Tab = await browser.tabs
      .query({currentWindow: true})
      .then(windowTabs => windowTabs.reduce(minimizingIndex));

    // Verify that menu was not closed and shown again during async operation
    if (menuInstanceId !== Listeners.lastMenuInstanceId) return;

    // noinspection ES6MissingAwait
    browser.menus.update(MENU_ITEM_ID, {
      enabled: leftmostTabInCurrentWindow.index !== targetTab.index,
    });
    // noinspection ES6MissingAwait
    browser.menus.refresh();
  };

  /**
   * Reset the menu open/closed state used by the onShown handler.
   */
  static resetMenuInstanceState: () => void = () => (Listeners.lastMenuInstanceId = 0);
}
