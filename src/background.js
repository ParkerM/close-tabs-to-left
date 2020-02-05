function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

function closeTabsWithIdxLessThan(tabIdx) {
  for (let i = 0; i < tabIdx; i++) {
    browser.tabs.query({index: i, currentWindow: true})
        .then(tabs => browser.tabs.remove(tabs[0].id))
  }
}

function closeTabsToLeft(info, tab) {
  closeTabsWithIdxLessThan(tab.index);
}

browser.menus.create({
  id: "tab-close-to-left",
  type: "normal",
  contexts: ["tab"],
  title: "Close Tabs to the Left",
  onclick: closeTabsToLeft
}, onCreated);
