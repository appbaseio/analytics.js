const AppbaseAnalytics = require('../dist/@appbaseio/analytics.cjs');

const index = 'gitxplore-latest-app';
const credentials = 'LsxvulCKp:a500b460-73ff-4882-8d34-9df8064b3b38';

describe('registerClick', () => {
  test('throw error if empty index', () => {
    try {
      /* eslint-disable-next-line */
      AppbaseAnalytics().registerClick(2);
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual(
        'appbase-analytics: A valid index must be present to record an event.'
      );
    }
  });

  test('throw error if empty credentials', () => {
    try {
      /* eslint-disable-next-line */
      AppbaseAnalytics()
        .setIndex(index)
        .registerClick(2);
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual(
        'appbase-analytics: Auth credentials is missing.'
      );
    }
  });

  test('throw error if click position is missing', () => {
    try {
      /* eslint-disable-next-line */
      AppbaseAnalytics()
        .setIndex(index)
        .registerClick();
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual(
        'appbase-analytics: click position must be an integer.'
      );
    }
  });

  test('throw error if search ID is missing', () => {
    try {
      /* eslint-disable-next-line */
      AppbaseAnalytics()
        .setIndex(index)
        .setCredentials(credentials)
        .registerClick(2);
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual(
        'appbase-analytics: searchID must be present to record an event.'
      );
    }
  });
});

describe('registerConversion', () => {
  test('throw error if empty index', () => {
    try {
      /* eslint-disable-next-line */
      AppbaseAnalytics().registerConversion();
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual(
        'appbase-analytics: A valid index must be present to record an event.'
      );
    }
  });

  test('throw error if empty credentials', () => {
    try {
      /* eslint-disable-next-line */
      AppbaseAnalytics()
        .setIndex(index)
        .registerConversion();
      expect(true).toBe(false);
    } catch (e) {
      expect(e.message).toEqual(
        'appbase-analytics: Auth credentials is missing.'
      );
    }
  });
});

describe('getAnalyticsHeaders', () => {
  test('with search query', () => {
    /* eslint-disable-next-line */
    expect(
      AppbaseAnalytics()
        .setSearchQuery('harry')
        .getAnalyticsHeaders()
    ).toEqual({
      'X-Search-Query': 'harry'
    });
  });
  test('with search ID', () => {
    /* eslint-disable-next-line */
    expect(
      AppbaseAnalytics()
        .setSearchID('xyz')
        .getAnalyticsHeaders()
    ).toEqual({
      'X-Search-Id': 'xyz'
    });
  });
  test('with search state', () => {
    /* eslint-disable-next-line */
    expect(
      AppbaseAnalytics()
        .setSearchState({
          foo: 'bar'
        })
        .getAnalyticsHeaders()
    ).toEqual({
      'X-Search-State': JSON.stringify({
        foo: 'bar'
      })
    });
  });
  test('with user ID', () => {
    /* eslint-disable-next-line */
    expect(
      AppbaseAnalytics()
        .setUserID('harry')
        .getAnalyticsHeaders()
    ).toEqual({
      'X-User-Id': 'harry'
    });
  });
  test('with custom event', () => {
    /* eslint-disable-next-line */
    expect(
      AppbaseAnalytics()
        .setCustomEvents({
          key1: 'value1',
          key2: 'value2'
        })
        .getAnalyticsHeaders()
    ).toEqual({
      'X-Search-CustomEvent': 'key1=value1,key2=value2'
    });
  });
  test('with search filters', () => {
    /* eslint-disable-next-line */
    expect(
      AppbaseAnalytics()
        .setFilters({
          key1: 'value1',
          key2: 'value2'
        })
        .getAnalyticsHeaders()
    ).toEqual({
      'X-Search-Filters': 'key1=value1,key2=value2'
    });
  });
  test('with all', () => {
    const searchState = {
      foo: 'bar'
    };
    /* eslint-disable-next-line */
    expect(
      AppbaseAnalytics()
        .setSearchQuery('harry')
        .setSearchID('x-y-z')
        .setSearchState(searchState)
        .setUserID('test@appbase.io')
        .setCustomEvents({
          key1: 'value1',
          key2: 'value2'
        })
        .setFilters({
          key1: 'value1',
          key2: 'value2'
        })
        .getAnalyticsHeaders()
    ).toEqual({
      'X-Search-Query': 'harry',
      'X-Search-Id': 'x-y-z',
      'X-Search-State': JSON.stringify(searchState),
      'X-User-Id': 'test@appbase.io',
      'X-Search-CustomEvent': 'key1=value1,key2=value2',
      'X-Search-Filters': 'key1=value1,key2=value2'
    });
  });
});
