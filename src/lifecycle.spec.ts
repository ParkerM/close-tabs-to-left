import {Lifecycle} from './lifecycle';

describe('Lifecycle', () => {
  let lifecycle: Lifecycle;

  beforeEach(() => {
    lifecycle = new Lifecycle();
  });

  describe('init', () => {
    it('should add "Close Tabs to the Left" button to tab menu', () => {
      const onclickFn = jest.fn();
      const expectedCreateCb = lifecycle.onCreated;

      mockBrowser.menus.create
        .expect(
          {
            id: 'tab-close-to-left',
            type: 'normal',
            contexts: ['tab'],
            title: 'Close Tabs to the Left',
            onclick: onclickFn,
          },
          expectedCreateCb,
        )
        .andReturn(42);

      const initStatus = lifecycle.init(onclickFn);
      expect(initStatus).toEqual(42);
    });
  });
});
