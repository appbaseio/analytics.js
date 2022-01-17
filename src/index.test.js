const AppbaseAnalytics = require('../dist/@appbaseio/analytics.cjs');

const index = '.analytics-js-test';
const credentials = 'be8a0649fdf2:61fdfec3-d5d2-43c9-9506-8857ec3136ac';
const URL = 'https://appbase-demo-ansible-abxiydt-arc.searchbase.io';

test('registerSearch', done => {
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
      if (err) {
        console.error(err);
        expect(true).toBe(false);
        done();
      } else if (res && res.status === 200) {
        expect(true).toBe(true);
        done();
      }
    }
  );
});

describe('registerClick', () => {
  test('with query', done => {
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
        if (err) {
          console.error(err);
          expect(true).toBe(false);
          done();
        } else if (res && res.status === 200) {
          expect(true).toBe(true);
          done();
        }
      }
    );
  });
  test('with query_id', () => {});
});

describe('registerConversion', () => {
  test('with query', done => {
    var aa = AppbaseAnalytics.init({
      index,
      credentials,
      url: URL
    });
    // perform search
    aa.search(
      {
        query: 'iphone'
      },
      (err, res) => {
        if (err) {
          console.error(err);
          expect(true).toBe(false);
          done();
        } else if (res && res.status === 200) {
          // record conversion
          aa.conversion(
            {
              queryID: aa.getQueryID(),
              objects: ['iphone_12345']
            },
            (err2, res2) => {
              if (err2) {
                console.error(err2);
                expect(true).toBe(false);
                done();
              } else if (res2 && res2.status === 200) {
                expect(true).toBe(true);
                done();
              }
            }
          );
        }
      }
    );
  });
});
