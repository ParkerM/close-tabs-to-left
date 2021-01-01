import {Lifecycle} from './lifecycle';
import {Listeners} from './listeners';

describe('Lifecycle', () => {
  let lifecycle: Lifecycle;

  beforeEach(() => {
    lifecycle = new Lifecycle();
  });

  describe('init', () => {
    it('should add "Close Tabs to the Left" button to tab menu', () => {
      const onclickFn = jest.fn();
      const expectedMenuItemLabel = 'Close Tabs to the Left';
      const expectedCreateCb = lifecycle.onCreated;

      mockBrowser.i18n.getMessage.expect('labelCloseTabsToLeft').andReturn(expectedMenuItemLabel);
      mockBrowser.menus.create.expect(
        {
          id: 'tab-close-to-left',
          type: 'normal',
          contexts: ['tab'],
          title: expectedMenuItemLabel,
          onclick: onclickFn,
        },
        expectedCreateCb,
      );

      lifecycle.init(onclickFn);
    });
  });

  describe('onCreated', () => {
    it('should add onShown and onHidden menu listeners', () => {
      mockBrowser.menus.onShown.addListener.expect(Listeners.updateEnabledState);
      mockBrowser.menus.onHidden.addListener.expect(Listeners.resetMenuInstanceState);

      lifecycle.onCreated();
    });
  });
});
