import {Listeners} from './listeners';
import {Menus, Tabs} from 'webextension-polyfill-ts';
import {MENU_ITEM_ID} from './util';

const tabStub: (title: string, id: number, index: number) => Tabs.Tab = (title, id, index) => {
  return {
    title: title,
    id: id,
    index: index,
    highlighted: false,
    active: false,
    pinned: false,
    incognito: false,
  };
};

describe('Listeners', () => {
  const tabQueryFake = (queryInfo: Tabs.QueryQueryInfoType): Promise<Tabs.Tab[]> => {
    return Promise.resolve(windowTabs.filter(tab => tab.pinned === queryInfo.pinned));
  };
  const queryUnpinnedInCurrentWindow: Tabs.QueryQueryInfoType = Object.freeze({currentWindow: true, pinned: false});

  let tab1: Tabs.Tab;
  let tab2: Tabs.Tab;
  let tab3: Tabs.Tab;
  let tab4: Tabs.Tab;
  let windowTabs: Tabs.Tab[];

  beforeEach(() => {
    tab1 = tabStub('tab1', 10, 1);
    tab2 = tabStub('tab2', 20, 2);
    tab3 = tabStub('tab3', 30, 3);
    tab4 = tabStub('tab4', 40, 4);
    windowTabs = [tab1, tab2, tab3, tab4];
  });

  describe('closeTabsToLeft', () => {
    it('should close tabs to the left', async () => {
      const tabTarget = tab2;
      const tabIdsLeftOfTarget: number[] = [tab1.id!];

      mockBrowser.tabs.query.expect(queryUnpinnedInCurrentWindow).andResolve(windowTabs).times(1);
      mockBrowser.tabs.remove.expect(tabIdsLeftOfTarget).andResolve().times(1);

      await Listeners.closeTabsToLeft(dummyOnClickData, tabTarget);
    });

    it('should close all tabs to the left', async () => {
      const tabTarget = tab4;
      const tabIdsLeftOfTarget: number[] = [tab1.id!, tab2.id!, tab3.id!];

      mockBrowser.tabs.query.expect(queryUnpinnedInCurrentWindow).andResolve(windowTabs).times(1);
      mockBrowser.tabs.remove.expect(tabIdsLeftOfTarget).andResolve().times(1);

      await Listeners.closeTabsToLeft(dummyOnClickData, tabTarget);
    });

    it('should close nothing but tabs to the left', () => {
      const tabTarget = tab3;
      const removeSpy: (tabIds: number | number[]) => Promise<void> = jest.fn(() => Promise.resolve());

      mockBrowser.tabs.query.expect(queryUnpinnedInCurrentWindow).andResolve(windowTabs).times(1);
      mockBrowser.tabs.remove.spy(removeSpy);

      expect.assertions(2);
      return Listeners.closeTabsToLeft(dummyOnClickData, tabTarget).then(() => {
        expect(removeSpy).toHaveBeenCalledWith([tab1.id!, tab2.id!]);
        expect(removeSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Button enabled listener', () => {
    let menuUpdateSpy: (id: string | number, updateProperties: Menus.UpdateUpdatePropertiesType) => Promise<void>;
    let menuRefreshSpy: () => Promise<void>;

    beforeEach(() => {
      menuUpdateSpy = jest.fn(() => Promise.resolve());
      menuRefreshSpy = jest.fn(() => Promise.resolve());

      mockBrowser.tabs.query.mock(tabQueryFake);
      mockBrowser.menus.update.mock((id, updateProperties) => menuUpdateSpy(id, updateProperties));
      mockBrowser.menus.refresh.mock(() => menuRefreshSpy());
    });

    describe('should disable button', () => {
      afterEach(() => {
        expect(menuUpdateSpy).toHaveBeenCalledWith(MENU_ITEM_ID, {enabled: false});
        expect(menuRefreshSpy).toHaveBeenCalled();
      });

      it('when there are no tabs to the left', async () => {
        return Listeners.updateEnabledState(dummyOnShownInfoType, tab1);
      });

      it('when all tabs to the left are pinned', async () => {
        [tab1.pinned, tab2.pinned, tab3.pinned] = [true, true, true];

        return Listeners.updateEnabledState(dummyOnShownInfoType, tab4);
      });

      it('when target tab is pinned', async () => {
        tab4.pinned = true;

        return Listeners.updateEnabledState(dummyOnShownInfoType, tab4);
      });
    });

    describe('should enable button', () => {
      afterEach(() => {
        expect(menuUpdateSpy).toHaveBeenCalledWith(MENU_ITEM_ID, {enabled: true});
        expect(menuRefreshSpy).toHaveBeenCalled();
      });

      it('when there are tabs to the left', async () => {
        return Listeners.updateEnabledState(dummyOnShownInfoType, tab2);
      });

      it('when there are unpinned tabs to the left', async () => {
        [tab1.pinned, tab2.pinned, tab3.pinned] = [true, false, false];

        return Listeners.updateEnabledState(dummyOnShownInfoType, tab4);
      });
    });

    describe('should noop', () => {
      afterEach(() => {
        expect(menuUpdateSpy).not.toHaveBeenCalled();
        expect(menuRefreshSpy).not.toHaveBeenCalled();
      });

      it('when menu is not a tab menu', async () => {
        return Listeners.updateEnabledState(dummyOnShownInfoType, undefined);
      });

      it('when menu instance is reset during async query', async () => {
        Listeners.updateEnabledState(dummyOnShownInfoType, tab2);
        return Listeners.resetMenuInstanceState();
      });
    });
  });

  const dummyOnClickData: Menus.OnClickData = {
    bookmarkId: '',
    editable: false,
    menuItemId: 1,
    modifiers: [],
  };

  const dummyOnShownInfoType = {contexts: [], editable: false, menuIds: []};
});
