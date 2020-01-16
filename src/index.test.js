const AppbaseAnalytics = require('../dist/@appbaseio/analytics.cjs');

const index = '.test';
const credentials = 'foo:bar';
const URL = 'http://localhost:8000';

test('registerSearch', () => {
  var aa = AppbaseAnalytics.init({
    index,
    credentials,
    url: URL
  });
  aa.search(
    {
      query: 'iphone',
      userID: 'jon_snow',
      eventData: {
        platform: 'mac'
      },
      filters: {
        year: '2018'
      },
      hits: [
        {
          id: '12345678',
          source: {
            title: 'iphoneX'
          },
          type: '_doc'
        }
      ]
    },
    (err, res) => {
      if (!err) {
        expect(true).toBe(false);
      } else if (res && res.status === 200) {
        expect(true).toBe(true);
      }
    }
  );
});

describe('registerClick', () => {
  test('with query', () => {
    var aa = AppbaseAnalytics.init({
      index,
      credentials,
      url: URL
    });
    aa.click(
      {
        query: 'iphone_X',
        objects: { iphone_12345: 1 }
      },
      (err, res) => {
        if (!err) {
          expect(true).toBe(false);
        } else if (res && res.status === 200) {
          console.log(res);
          expect(true).toBe(true);
        }
      }
    );
  });
  test('with query_id', () => {});
});

describe('registerConversion', () => {
  test('with query', () => {
    var aa = AppbaseAnalytics.init({
      index,
      credentials,
      url: URL
    });
    aa.conversion(
      {
        query: 'iphone_X',
        objects: ['iphone_12345']
      },
      (err, res) => {
        if (!err) {
          expect(true).toBe(false);
        } else if (res && res.status === 200) {
          console.log(res);
          expect(true).toBe(true);
        }
      }
    );
  });
  test('with query_id', () => {});
});
