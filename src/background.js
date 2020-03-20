function onCreated() {
  if (browser.runtime.lastError) {
    this.console.error(`Error: ${browser.runtime.lastError}`);
  } else {
    this.console.debug("Item created successfully");
  }
}

/**
 * @param {browser.menus.OnClickData} info
 * @param {browser.tabs.Tab} target
 */
function closeTabsToLeft(info, target) {
  return browser.tabs.query({currentWindow: true})
      .then(tabs => tabs.filter(tab => tab.index < target.index).map(toId))
      .then(browser.tabs.remove);
}

browser.menus.create({
  id: "tab-close-to-left",
  type: "normal",
  contexts: ["tab"],
  title: "Close Tabs to the Left",
  onclick: closeTabsToLeft,
}, onCreated);

/*
 * Lil helpers
 */
const toId = (item) => item.id;
