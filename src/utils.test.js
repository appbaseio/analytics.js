import { parseHeaders, getURL } from './utils';

test('parse headers', () => {
  try {
    /* eslint-disable-next-line */
    expect(
      parseHeaders({
        key1: 'value1',
        key2: 'value2'
      })
    ).toBe('key1=value1,key2=value2');
  } catch (e) {
    expect(e.message).toEqual('Please provide a valid index.');
  }
});

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
