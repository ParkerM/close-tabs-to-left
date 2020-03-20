function onCreated() {
  if (browser.runtime.lastError) {
    this.console.error(`Error: ${browser.runtime.lastError}`);
  } else {
    this.console.debug("Item created successfully");
  }
}

/**
 * @param {number} tabIdx
 */
function closeTabsWithIdxLessThan(tabIdx) {
  for (let i = 0; i < tabIdx; i++) {
    browser.tabs.query({index: i, currentWindow: true})
        .then(tabs => browser.tabs.remove(tabs[0].id));
  }
}

/**
 * @param {browser.menus.OnClickData} info
 * @param {browser.tabs.Tab} tab
 */
function closeTabsToLeft(info, tab) {
  closeTabsWithIdxLessThan(tab.index);
}

browser.menus.create({
  id: "tab-close-to-left",
  type: "normal",
  contexts: ["tab"],
  title: "Close Tabs to the Left",
  onclick: closeTabsToLeft,
}, onCreated);
