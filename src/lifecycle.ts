import {browser, Menus, Tabs} from 'webextension-polyfill-ts';
import {MENU_ITEM_ID, minimizingIndex} from './util';
import Tab = Tabs.Tab;
import OnClickData = Menus.OnClickData;
import OnShownInfoType = Menus.OnShownInfoType;

export class Lifecycle {
  private static lastMenuInstanceId = 0;
  private static nextMenuInstanceId = 1;

  init(onclick: (info: OnClickData, target: Tab) => void): void {
    browser.menus.create(
      {
        id: MENU_ITEM_ID,
        type: 'normal',
        contexts: ['tab'],
        title: 'Close Tabs to the Left',
        onclick: onclick,
      },
      this.onCreated,
    );
  }

  onCreated(): void {
    browser.menus.onShown.addListener(Lifecycle.updateEnabledState);
    browser.menus.onHidden.addListener(Lifecycle.resetMenuInstanceState);
  }

  /**
   * Toggles the enabled state of the Close Tabs to the Left button.
   * If targetTab has the same index as the leftmost tab in the current window, the menu button is disabled.
   * Otherwise, the menu button is enabled.
   *
   * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/menus/onShown
   */
  private static updateEnabledState: (info: OnShownInfoType, targetTab: Tab | undefined) => void = async (
    info,
    targetTab,
  ) => {
    // If targetTab is undefined then this is not a tab menu
    if (!targetTab) return;

    const menuInstanceId = Lifecycle.nextMenuInstanceId++;
    Lifecycle.lastMenuInstanceId = menuInstanceId;

    const leftmostTabInCurrentWindow: Tab = await browser.tabs
      .query({currentWindow: true})
      .then(windowTabs => windowTabs.reduce(minimizingIndex));

    // Verify that menu was not closed and shown again during async operation
    if (menuInstanceId !== Lifecycle.lastMenuInstanceId) return;

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
  private static resetMenuInstanceState = () => (Lifecycle.lastMenuInstanceId = 0);
}
