import browser, {Menus, Tabs} from 'webextension-polyfill';
import {MENU_ITEM_ID, minimizingIndex, toId} from './util';
import OnShownInfoType = Menus.OnShownInfoType;
import Tab = Tabs.Tab;

export abstract class Listeners {
  private static lastMenuInstanceId = 0;
  private static nextMenuInstanceId = 1;

  static closeTabsToLeft(info: Menus.OnClickData, target: Tabs.Tab): Promise<void> {
    return browser.tabs
      .query({currentWindow: true, pinned: false})
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

    const leftmostTabInCurrentWindow: Tabs.Tab | null = await browser.tabs
      .query({currentWindow: true, pinned: false})
      .then(windowTabs => (windowTabs.length ? windowTabs.reduce(minimizingIndex) : null));

    // Verify that menu was not closed and shown again during async operation
    if (menuInstanceId !== Listeners.lastMenuInstanceId) return;

    // If targetTab is pinned, then there can only be pinned tabs to the left
    if (targetTab.pinned) {
      return Listeners.updateMenuItem({enabled: false});
    }
    return Listeners.updateMenuItem({enabled: leftmostTabInCurrentWindow?.index !== targetTab.index});
  };

  /**
   * Reset the menu open/closed state used by the onShown handler.
   */
  static resetMenuInstanceState: () => void = () => (Listeners.lastMenuInstanceId = 0);

  /**
   * Update the menu item with the provided properties, then refresh the extension items in the shown menu.
   */
  private static updateMenuItem = async (updateProperties: Menus.UpdateUpdatePropertiesType): Promise<void> => {
    return browser.menus.update(MENU_ITEM_ID, updateProperties).then(() => browser.menus.refresh());
  };
}
