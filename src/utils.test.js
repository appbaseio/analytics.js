import { getURL } from './utils';

describe('getURL', () => {
  test('default URL', () => {
    try {
      /* eslint-disable-next-line */
      expect(getURL('')).toBe('https://scalr.api.appbase.io');
    } catch (e) {
      expect(e.message).toEqual('Please provide a valid index.');
    }
  });

  test('with custom URL', () => {
    try {
      /* eslint-disable-next-line */
      expect(getURL('https://abc.com')).toBe('https://abc.com');
    } catch (e) {
      expect(e.message).toEqual('Please provide a valid index.');
    }
  });
});
