import {Listeners} from './listeners';
import {Menus, Tabs} from 'webextension-polyfill-ts';
import arrayContaining = jasmine.arrayContaining;

describe('Listeners', () => {
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

  const tab1: Tabs.Tab = tabStub('tab1', 10, 1);
  const tab2: Tabs.Tab = tabStub('tab2', 20, 2);
  const tab3: Tabs.Tab = tabStub('tab3', 30, 3);
  const tab4: Tabs.Tab = tabStub('tab4', 40, 4);
  const windowTabs: Tabs.Tab[] = [tab1, tab2, tab3, tab4];

  describe('closeTabsToLeft', () => {
    it('should close tabs to the left', async () => {
      const tabTarget = tab4;
      const tabIdsLeftOfTarget: number[] = [tab1.id!, tab2.id!, tab3.id!];

      mockBrowser.tabs.query.expect({currentWindow: true}).andResolve(windowTabs).times(1);
      mockBrowser.tabs.remove.expect(tabIdsLeftOfTarget).andResolve().times(1);

      await Listeners.closeTabsToLeft(dummyOnClickData, tabTarget);
    });

    it('should only close tabs to the left', () => {
      const tabTarget = tab3;
      const removeSpy: (tabIds: number | number[]) => Promise<void> = jest.fn(() => Promise.resolve());

      mockBrowser.tabs.query.expect({currentWindow: true}).andResolve(windowTabs).times(1);
      mockBrowser.tabs.remove.spy(removeSpy);

      expect.assertions(5);
      return Listeners.closeTabsToLeft(dummyOnClickData, tabTarget).then(() => {
        expect(removeSpy).toHaveBeenCalledWith(arrayContaining([tab1.id!]));
        expect(removeSpy).toHaveBeenCalledWith(arrayContaining([tab2.id!]));
        expect(removeSpy).not.toHaveBeenCalledWith(arrayContaining([tab3.id!]));
        expect(removeSpy).not.toHaveBeenCalledWith(arrayContaining([tab4.id!]));
        expect(removeSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('updateEnabledState', () => {
    let menuUpdateSpy: (id: string | number, updateProperties: Menus.UpdateUpdatePropertiesType) => Promise<void>;
    let menuRefreshSpy: () => Promise<void>;
    let tabQuerySpy: (queryInfo: Tabs.QueryQueryInfoType) => Promise<Tabs.Tab[]>;

    beforeEach(() => {
      menuUpdateSpy = jest.fn(() => Promise.resolve());
      menuRefreshSpy = jest.fn(() => Promise.resolve());
      tabQuerySpy = jest.fn(() => Promise.resolve(windowTabs));

      mockBrowser.tabs.query.mock(queryInfo => tabQuerySpy(queryInfo));
      mockBrowser.menus.update.mock((id, updateProperties) => menuUpdateSpy(id, updateProperties));
      mockBrowser.menus.refresh.mock(() => menuRefreshSpy());
    });

    it('should noop if menu is not a tab menu', async () => {
      await Listeners.updateEnabledState(dummyOnShownInfoType, undefined);

      expect(tabQuerySpy).not.toHaveBeenCalled();
      expect(menuUpdateSpy).not.toHaveBeenCalled();
      expect(menuRefreshSpy).not.toHaveBeenCalled();
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
