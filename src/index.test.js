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
      customEvents: {
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

describe('saved search', () => {
  test('should record saved search', done => {
    var aa = AppbaseAnalytics.init({
      index,
      credentials,
      url: URL
    });
    // perform search
    aa.saveSearch(
      {
        queryID: 'cf600405-d4ed-42b0-8b09-08b594fa88d2',
        saveSearchID: 'analytics-js-test',
        saveSearchMeta: {
          key1: 'value1'
        },
        userID: 'john@appbase.io',
        customEvents: { platform: 'mac' }
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
  test('get saved searched', done => {
    var aa = AppbaseAnalytics.init({
      index,
      credentials,
      url: URL
    });
    // perform search
    aa.getSavedSearches(
      {
        user_id: 'john@appbase.io'
      },
      (err, res) => {
        if (err) {
          console.error(err);
          expect(true).toBe(false);
          done();
        } else if (res && res.status === 200) {
          res
            .json()
            .then(response => {
              const savedSearch = response.find(
                r => r.save_search_id === 'analytics-js-test'
              );
              expect(savedSearch).toMatchObject({
                query_id: 'cf600405-d4ed-42b0-8b09-08b594fa88d2',
                save_search_id: 'analytics-js-test',
                save_search_meta: { key1: 'value1' },
                user_id: 'john@appbase.io',
                custom_events: { platform: 'mac' },
                search_state: { body: '' },
                search_query: 'iphone',
                search_characters_length: 6
              });
              done();
            })
            .catch(err2 => {
              console.error(err2);
              expect(true).toBe(false);
              done();
            });
        }
      }
    );
  });
});

describe('favorite', () => {
  test('should record favorite', done => {
    var aa = AppbaseAnalytics.init({
      index,
      credentials,
      url: URL
    });
    // perform search
    aa.favorite(
      {
        favoriteOn: '1jftXXEBdEU4aeo6Gdqs',
        queryID: 'cf600405-d4ed-42b0-8b09-08b594fa88d2',
        source: {
          authors: 'John Milton, John Leonard',
          average_rating: 3.8,
          average_rating_rounded: 4,
          books_count: 819,
          id: 984,
          image: 'https://images.gr-assets.com/books/1455618673l/15997.jpg',
          image_medium:
            'https://images.gr-assets.com/books/1455618673m/15997.jpg',
          isbn: '140424393',
          language_code: 'eng',
          original_publication_year: 1667,
          original_series: '',
          original_title: 'Paradise Lost',
          ratings_count: 96316,
          title: 'Paradise Lost'
        },
        id: 'analytics-js-test',
        userID: 'john@appbase.io',
        customEvents: { platform: 'mac' },
        meta: {
          key1: 'value1'
        }
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
  test('get favorites', done => {
    var aa = AppbaseAnalytics.init({
      index,
      credentials,
      url: URL
    });
    // perform search
    aa.getFavorites(
      {
        user_id: 'john@appbase.io'
      },
      (err, res) => {
        if (err) {
          console.error(err);
          expect(true).toBe(false);
          done();
        } else if (res && res.status === 200) {
          res
            .json()
            .then(response => {
              const favorite = response.find(r => r.id === 'analytics-js-test');
              expect(favorite).toMatchObject({
                id: 'analytics-js-test',
                query_id: 'cf600405-d4ed-42b0-8b09-08b594fa88d2',
                favorite_on: '1jftXXEBdEU4aeo6Gdqs',
                source: {
                  authors: 'John Milton, John Leonard',
                  average_rating: 3.8,
                  average_rating_rounded: 4,
                  books_count: 819,
                  id: 984,
                  image:
                    'https://images.gr-assets.com/books/1455618673l/15997.jpg',
                  image_medium:
                    'https://images.gr-assets.com/books/1455618673m/15997.jpg',
                  isbn: '140424393',
                  language_code: 'eng',
                  original_publication_year: 1667,
                  original_series: '',
                  original_title: 'Paradise Lost',
                  ratings_count: 96316,
                  title: 'Paradise Lost'
                },
                user_id: 'john@appbase.io',
                custom_events: { platform: 'mac' },
                search_query: 'iphone',
                search_characters_length: 6,
                meta: { key1: 'value1' }
              });
              done();
            })
            .catch(err2 => {
              console.error(err2);
              expect(true).toBe(false);
              done();
            });
        }
      }
    );
  });
});
