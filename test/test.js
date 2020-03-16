const path = require('path');
const sinonChai = require('sinon-chai');
const chai = require('chai');
const expect = chai.expect;
chai.use(sinonChai);

const webExtensionsJSDOM = require('webextensions-jsdom');
const manifestPath = path.resolve(path.join(__dirname, '../src/manifest.json'));

describe('Close Tabs to the Left', () => {
    let webExtension;

    beforeEach(async () => {
        webExtension = await webExtensionsJSDOM.fromManifest(manifestPath, {
            apiFake: true,
            wiring: true,
            popup: false,
            pageActionPopup: false,
            sidebar: false,
        });
    });

    describe('Clicking "Close Tabs to the Left"', () => {
        const tabsCreateProperties = [
            {title: 'tab1', index: 1},
            {title: 'tab2', index: 2},
            {title: 'tab3', index: 3},
            {title: 'tab4', index: 4},
        ];
        let createdTabs;
        let closeTabsToTheLeft;

        beforeEach(async () => {
            const tabPromises = tabsCreateProperties
                .map(props => webExtension.background.browser.tabs.create({title: props.title, index: props.index}));

            // sanity check for getCurrentWindowTabs
            createdTabs = await Promise.all(tabPromises);
            const foundTabs = await getCurrentWindowTabs();
            expect(foundTabs).to.contain.members(createdTabs);

            // Snatch the closeTabs function
            closeTabsToTheLeft = await webExtension.background.browser.menus.create.lastCall.firstArg.onclick;
        });

        it('should create menu element with expected configuration', async () => {
            const menuCreateArgs = await webExtension.background.browser.menus.create.lastCall.args;

            const createProperties = menuCreateArgs[0];
            expect(createProperties.id).to.equal('tab-close-to-left');
            expect(createProperties.type).to.equal('normal');
            expect(createProperties.title).to.equal('Close Tabs to the Left');
            expect(createProperties.contexts).to.have.length(1).and.contain('tab');
            expect(createProperties.onclick).to.equal(closeTabsToTheLeft);

            const callback = menuCreateArgs[1];
            return expect(callback.prototype.constructor.name).to.equal('onCreated');
        });

        it('should close tabs to the left', async () => {
            const actualTabs = await getCurrentWindowTabs();
            expect(actualTabs).has.length(4);
            expect(actualTabs).contains.all.members(createdTabs);

            const rightmostTab = actualTabs.find(tab => tab.id === 4);
            expect(rightmostTab.title).to.equal('tab4');

            closeTabsToTheLeft({menuItemId: 'tab-close-to-left'}, rightmostTab);
            await webExtension.background.browser.menus.refresh();

            const remainingTabs = await getCurrentWindowTabs();
            return expect(remainingTabs).to.have.length(1).and.contain(rightmostTab);
        });

        it('should not close tabs to the right', async () => {
            const actualTabs = await getCurrentWindowTabs();
            expect(actualTabs).has.length(4).and.contains.all.members(createdTabs);

            const thirdTab = actualTabs.find(tab => tab.id === 3);
            const rightmostTab = actualTabs.find(tab => tab.id === 4);
            expect(thirdTab.title).to.equal('tab3');

            closeTabsToTheLeft({menuItemId: 'tab-close-to-left'}, thirdTab);
            await webExtension.background.browser.menus.refresh();

            const remainingTabs = await getCurrentWindowTabs();
            return expect(remainingTabs).to.have.length(2).and.contain.all.members([thirdTab, rightmostTab]);
        });
    });

    afterEach(async () => {
        await webExtension.destroy();
    });

    const getCurrentWindowTabs = () => webExtension.background.browser.tabs.query({currentWindow: true});
});
