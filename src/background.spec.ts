import {Lifecycle} from './lifecycle';
import {Listeners} from './listeners';

jest.mock('./lifecycle');

describe('Background', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load listeners', async () => {
    const initSpy = jest.spyOn(Lifecycle.prototype, 'init');

    expect.assertions(1);
    return import('./background').then(() => {
      expect(initSpy).toHaveBeenCalledWith(Listeners.closeTabsToLeft);
    });
  });
});
