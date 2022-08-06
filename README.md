[![NPM Version](https://img.shields.io/npm/v/@appbaseio/analytics.svg?style=flat)](https://www.npmjs.com/package/@appbaseio/analytics)

### Appbase Analytics

A universal analytics library that allows you to record search, click and conversion for appbase.io <b>clusters</b>.

## TOC

- [Getting started](#getting-started)
  - [Browser](#browser)
  - [Node.js](#nodejs)
- [Use cases](#use-cases)
  - [Record search](#record-search)
    - [Record empty query search](#record-empty-query-search)
  - [Record clicks](#record-clicks)
    - [Record suggestion clicks](#record-suggestion-clicks)
    - [Record clicks for a particular search event](#record-clicks-for-a-particular-search-event)
    - [Record clicks with particular events](#record-clicks-with-particular-events)
  - [Record conversions](#record-conversions)
  - [Save search](#save-search)
  - [Get Saved searches](#get-saved-searches)
  - [Favorite](#favorite)
  - [Get Favorites](#get-favorites)
  - [Set user](#set-user)
  - [Set global events](#set-global-events)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [Other Projects You Might Like](#other-projects-you-might-like)
- [License](#license)

## Getting started

### Browser

#### 1. Load the library

The analytics library can be either loaded via [jsDelivr CDN](https://www.jsdelivr.com/) or directly bundled with your application.

You can use the UMD build in browsers by following the below snippet:

<!-- prettier-ignore-start -->
```html
<script defer src="https://cdn.jsdelivr.net/npm/@appbaseio/analytics@2.0.0-beta.2/dist/@appbaseio/analytics.umd.min.js"
></script>
```
<!-- prettier-ignore-end -->

#### 2. Initialization

```js
const aaInstance = aa.init({
  index: 'INDEX_NAME',
  credentials: 'AUTH_CREDENTIALS',
  url: 'CLUSTER_URL'
});
```

### Node.js

#### 1. Install the library

Install the library by following the below command:

```bash
npm install @appbaseio/analytics
# or
yarn add @appbaseio/analytics
```

#### 2. Initialization

```js
const aa = require('@appbaseio/analytics');

const aaInstance = aa.init({
  index: 'INDEX_NAME',
  credentials: 'AUTH_CREDENTIALS',
  url: 'CLUSTER_URL'
});
```

[⬆ Back to Top](#appbase-analytics)

## Use cases

The analytics library provides the utility methods to integrate the appbase.io analytics in minutes, the common use-cases are to record the search, clicks and conversion events.

### Record search

It helps you to track the search for a particular query term. It returns the `queryID` back which can be used to record clicks and conversions for the same search event.

```js
const aa = require('@appbaseio/analytics');

const aaInstance = aa.init({
  index: 'INDEX_NAME',
  credentials: 'AUTH_CREDENTIALS',
  url: 'CLUSTER_URL'
});

aaInstance.search({
  query: 'iphone'
});
```

<b>Note:</b> `queryID` will be automatically set in the state and can be retrieved by using the `getQueryID` method once a search event has been registered successfully.

#### Record empty query search

`query` is the required key to record a search event however you can set it to empty string to register as an empty query search.

```js
aaInstance.search({
  query: ''
});
```

### Record clicks

Use the `click` method to record click events. The below example records the two clicks of the `result` type for a search query.

```ts
const aa = require('@appbaseio/analytics');

const aaInstance = aa.init({
  index: 'INDEX_NAME',
  credentials: 'AUTH_CREDENTIALS',
  url: 'CLUSTER_URL'
});

aaInstance.click({
  query: 'iphone',
  objects: {
    iphoneX_19348: 1,
    iphone7_19348: 3
  }
});
```

#### Record suggestion clicks

Set the `isSuggestionClick` property to `true` to record as suggestion click.

```ts
aaInstance.click({
  query: 'iphone',
  isSuggestionClick: true,
  objects: {
    iphoneX_19348: 1,
    iphone7_19348: 3
  }
});
```

#### Record clicks for a particular search event

Use `queryID` instead of `query` to record clicks for a particular search event.

```ts
// Record a search
aaInstance.search({
  query: 'iphone'
});

// Record a click for the last search made
aaInstance.click({
  queryID: aaInstance.getQueryID(),
  objects: {
    iphoneX_19348: 1,
    iphone7_19348: 3
  }
});
```

#### Record clicks with particular events

Attach the custom events to distinguish the click events.

```ts
aaInstance.click({
  query: 'iphone',
  objects: {
    iphoneX_19348: 1,
    iphone7_19348: 3
  },
  customEvents: {
    click_source: 'promoted_collections'
  }
});
```

### Record conversions

Conversions must be recorded for a particular search event so it is required to define a `queryID` to record conversion.

```ts
// Record a search
aaInstance.search({
  query: 'iphone'
});

// Record a conversion for the last search made
aaInstance.conversion({
  queryID: aaInstance.getQueryID(),
  objects: ['iphoneX_19348', 'iphone7_19348']
});
```

### Save search

To save a search state, `queryID` must be present.

```ts
// Save search state
aaInstance.saveSearch({
  queryID: 'cf600405-d4ed-42b0-8b09-08b594fa88d2',
  saveSearchID: 'analytics-js-test',
  saveSearchMeta: {
    key1: 'value1'
  },
  userID: 'john@appbase.io',
  customEvents: { platform: 'mac' }
});
```

### Get Saved searches

To retrieve saved searches, here we're fetching the saved searches for user with user id as `john@appbase.io`.

```ts
aa.getSavedSearches(
  {
    user_id: 'john@appbase.io'
  },
  (err, res) => {
    if (err) {
      console.error(err);
    } else {
      res
        .json()
        .then(savedSearches => {
          // saved searches list
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
);
```

### Favorite

To record a favorite document

```ts
aa.favorite({
  favoriteOn: '1jftXXEBdEU4aeo6Gdqs',
  queryID: 'cf600405-d4ed-42b0-8b09-08b594fa88d2',
  source: {
    authors: 'John Milton, John Leonard',
    average_rating: 3.8,
    average_rating_rounded: 4,
    books_count: 819,
    id: 984,
    image: 'https://images.gr-assets.com/books/1455618673l/15997.jpg',
    image_medium: 'https://images.gr-assets.com/books/1455618673m/15997.jpg',
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
});
```

### Get Favorites

To retrieve favorite documents, here we're fetching the favorites for user with user id as `john@appbase.io`.

```ts
aa.getFavorites(
  {
    user_id: 'john@appbase.io'
  },
  (err, res) => {
    if (err) {
      console.error(err);
    } else {
      res
        .json()
        .then(favorites => {
          // list of favorite document
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
);
```

### Set user

It allows you to set the `userID`.

```ts
const aa = require('@appbaseio/analytics');

// Set during initialization
const aaInstance = aa.init({
  index: 'INDEX_NAME',
  credentials: 'AUTH_CREDENTIALS',
  url: 'CLUSTER_URL',
  userID: 'jon@abc.com'
});

// or set by using method
aaInstance.setUserID('jon@abc.com');
```

### Set global events

To set the custom events which will be attached for each event recorded by the instance.

For example:

```ts
const aa = require('@appbaseio/analytics');

const aaInstance = aa.init({
  index: 'INDEX_NAME',
  credentials: 'AUTH_CREDENTIALS',
  url: 'CLUSTER_URL'
});

// or set by using method
aaInstance.setGlobalCustomEvents({
  platform: 'ios'
});
```

[⬆ Back to Top](#appbase-analytics)

## API Reference

### Initialization

```js
const aa = require('@appbaseio/analytics');

const aaInstance = aa.init({
  index: 'INDEX_NAME',
  credentials: 'AUTH_CREDENTIALS',
  url: 'CLUSTER_URL',
  userID: 'USER_ID',
  globalCustomEvents: 'GLOBAL_CUSTOM_EVENTS'
  headers?: 'CUSTOM_HEADERS'
});
```

Optional configuration options:

| Option               | Type                | Description                                                                                                                                                                                                                          |
| -------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`index`**          | `string` (required) | Elasticsearch index name.                                                                                                                                                                                                            |
| **`credentials`**    | `string` (required) | credentials as they appear on the Appbaseio dashboard. It should be a string of the format <b>username:password</b> and is used for authenticating the app.                                                                          |
| **`url`**            | `string` (required) | Appbaseio cluster URL.                                                                                                                                                                                                               |
| `userID`             | `string`            | UserID allows you to record events for a particular user. For example, you may want to know that how many different users are using the search.                                                                                      |
| `globalCustomEvents` | `Object`            | It allows you to set the <b>global</b> custom events which can be used to build your own analytics on top of the appbase.io analytics. [Read More](https://docs.appbase.io/docs/analytics/Implement/#how-to-implement-custom-events) |
| `headers`            | `Object`            | Sometimes it may require to set extra headers to the analytics API. For example, you're using proxy middleware which adds an additional security layer.                                                                              |

An example with all possible options:

```ts
const aa = require('@appbaseio/analytics');

const aaInstance = aa.init({
  index: 'books',
  credentials: 'foo:bar',
  url: 'http://localhost:8000',
  userID: 'jon@abc.com',
  globalCustomEvents: {
    platform: 'mac'
  },
  headers: {
    'X-auth-token': 'XYZ'
  }
});
```

### Instance Methods

#### Record Search

```ts

search(searchConfig: Object, callback: Function)

```

search configuration options:

| Option         | Type     | Description                                                                            |
| -------------- | -------- | -------------------------------------------------------------------------------------- |
| **`query`**    | `string` | Search query, set to empty string to register as an empty query search.                |
| **`queryID`**  | `string` | Search query ID returned from Appbase.                                                 |
| `customEvents` | `Object` | To set the custom events, for e.g `{ "platform": mac }`                                |
| `filters`      | `Object` | It allows to record the applied facets on the search query, for e.g `{ "year": 2018 }` |
| `hits`         | `Array`  | To set the search hits, a hit object can have the `id`, `type` & `source` properties . |

<b>Note: </b>

`query` or `queryID` must be present.

An example with all possible options:

```ts
search(
  {
    query: 'iphone',
    // or
    queryID: 'cf827a07-60a6-43ef-ab93-e1f8e1e3e1a8',
    customEvents: {
      source: 'promoted_results'
    },
    filters: {
      year: 2019
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
      // handle error
    } else if (res) {
      // handle response
    }
  }
);
```

#### Get queryID

The below method returns the `queryID` from the last search made.

```ts
getQueryID(): string
```

#### Record Click

To record a click event

```ts
click(clickConfig: Object, callback: Function)
```

click configuration options:

| Option              | Type                                 | Description                                                                                   |
| ------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------- |
| **`query`**         | `string`                             | Search query, set to empty string to register as an empty query search.                       |
| **`queryID`**       | `string`                             | Search query ID returned from Appbase.                                                        |
| **`objects`**       | `{[key: string]: number}` (required) | To set the click object ids followed by click positions, for example `{ "iphoneX_1234": 2 }`. |
| `isSuggestionClick` | `boolean`                            | Set as `true` to register as a suggestion click.                                              |
| `customEvents`      | `Object`                             | To set the custom events, for e.g `{ "platform": mac }`                                       |

<b>Note: </b>

`query` or `queryID` must be present.

An example with all possible options:

```ts
click(
  {
    query: 'iphone',
    // or
    queryID: 'cf827a07-60a6-43ef-ab93-e1f8e1e3e1a8',
    customEvents: {
      source: 'promoted_results'
    },
    objects: {
      iphone_1234: 2
    },
    isSuggestionClick: true
  },
  (err, res) => {
    if (err) {
      // handle error
    } else if (res) {
      // handle response
    }
  }
);
```

#### Record conversion

To record a conversion event

```ts
conversion(conversionConfig: Object, callback: Function)
```

conversion configuration options:

| Option        | Type                       | Description                                                       |
| ------------- | -------------------------- | ----------------------------------------------------------------- |
| **`queryID`** | `string` (required)        | Search query ID returned from Appbase.                            |
| **`objects`** | `Array<string>` (required) | To set the converted object ids, for example: `["iphoneX_1234"]`. |

<b>Note: </b>

`queryID` must be present.

An example with all possible options:

```ts
conversion(
  {
    queryID: 'cf827a07-60a6-43ef-ab93-e1f8e1e3e1a8',
    objects: ['iphone_1234']
  },
  (err, res) => {
    if (err) {
      // handle error
    } else if (res) {
      // handle response
    }
  }
);
```

#### Save search

To save search state

```ts
saveSearch(config: Object, callback: Function)
```

configuration options:

| Option               | Type                | Description                                             |
| -------------------- | ------------------- | ------------------------------------------------------- |
| **`queryID`**        | `string` (required) | Search query ID returned from Appbase.                  |
| **`saveSearchID`**   | `string`            | Saved search ID.                                        |
| **`saveSearchMeta`** | `Object`            | Meta data                                               |
| **`userID`**         | `string`            | User Id.                                                |
| `customEvents`       | `Object`            | To set the custom events, for e.g `{ "platform": mac }` |

<b>Note: </b>

`queryID` must be present.

An example with all possible options:

```ts
saveSearch(
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
      // handle error
    } else if (res) {
      // handle response
    }
  }
);
```

#### Get saved searches

To retrieve saved searches

```ts
getSavedSearches(queryParams: Object, callback: Function)
```

You can find the available query params at [here](https://api.reactivesearch.io/#3cbe91d1-64b9-4e2e-a929-0ee7e6a1acfc).

```ts
getSavedSearches(
  {
    user_id: 'john@appbase.io'
  },
  (err, res) => {
    if (err) {
      // handle error
    } else if (res) {
      res
        .json()
        .then(favorites => {
          // list of saved searches
        })
        .catch(err => {});
      // handle response
    }
  }
);
```

#### Favorite

To record a favorite document

```ts
favorite(config: Object, callback: Function)
```

configuration options:

| Option           | Type                | Description                                             |
| ---------------- | ------------------- | ------------------------------------------------------- |
| **`queryID`**    | `string` (required) | Search query ID returned from Appbase.                  |
| **`favoriteOn`** | `string` (required) | Favorite document ID.                                   |
| **`source`**     | `Object` (required) | Favorite document source object data                    |
| **`id`**         | `string`            | Favorite ID.                                            |
| **`meta`**       | `Object`            | Meta data                                               |
| **`userID`**     | `string`            | User Id.                                                |
| `customEvents`   | `Object`            | To set the custom events, for e.g `{ "platform": mac }` |

<b>Note: </b>

`queryID`, `favoriteOn` and `source` must be present.

An example with all possible options:

```ts
favorite(
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
      image_medium: 'https://images.gr-assets.com/books/1455618673m/15997.jpg',
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
      // handle error
    } else if (res) {
      // handle response
    }
  }
);
```

#### Get favorites

To retrieve saved favorites

```ts
getFavorites(queryParams: Object, callback: Function)
```

You can find the available query params at [here](https://api.reactivesearch.io/#11eda024-6b87-4921-8ed1-916483239087).

```ts
getFavorites(
  {
    user_id: 'john@appbase.io'
  },
  (err, res) => {
    if (err) {
      // handle error
    } else if (res) {
      res
        .json()
        .then(favorites => {
          // list of favorites
        })
        .catch(err => {});
      // handle response
    }
  }
);
```

#### Set headers

It allows you to set the custom headers in analytics endpoints.

```ts
setHeaders(headers: Object)
```

#### Set user

Sets the user ID. User ID helps to record an event for that particular user.

```ts
setUserID(userID: string)
```

#### Set global events

Sets the global event data. This will be added to all the analytics requests made by the instance.

```ts
setGlobalCustomEvents(globalEvents: Object)
```

##

[⬆ Back to Top](#appbase-analytics)

## Contributing

Fork the repo and run the following command to run & test locally.

```bash
yarn && yarn test
```

## Other Projects You Might Like

- [**Arc**](https://github.com/appbaseio/arc) API Gateway for ElasticSearch (Out of the box Security, Rate Limit Features, Record Analytics and Request Logs).

- [**ReactiveSearch**](https://github.com/appbaseio/reactivesearch) ReactiveSearch is an Elasticsearch UI components library for React, React Native and Vue. It has 25+ components consisting of Lists, Ranges, Search UIs, Result displays and a way to bring any existing UI component into the library.

- **searchbox** A lightweight and performance-focused search box UI libraries to query and display results from your ElasticSearch app (aka index).

  - [**Vanilla**](https://github.com/appbaseio/searchbox) - (~16kB Minified + Gzipped)
  - [**React**](https://github.com/appbaseio/react-searchbox) - (~30kB Minified + Gzipped)
  - [**Vue**](https://github.com/appbaseio/vue-searchbox) - (~22kB Minified + Gzipped)

- [**Dejavu**](https://github.com/appbaseio/dejavu) allows viewing raw data within an appbase.io (or Elasticsearch) app. **Soon to be released feature:** An ability to import custom data from CSV and JSON files, along with a guided walkthrough on applying data mappings.

- [**Mirage**](https://github.com/appbaseio/mirage) ReactiveSearch components can be extended using custom Elasticsearch queries. For those new to Elasticsearch, Mirage provides an intuitive GUI for composing queries.

- [**ReactiveMaps**](https://github.com/appbaseio/reactivesearch/tree/next/packages/maps) is a similar project to Reactive Search that allows building realtime maps easily.

- [**appbase-js**](https://github.com/appbaseio/appbase-js) While building search UIs is dandy with Reactive Search, you might also need to add some input forms. **appbase-js** comes in handy there.

## License

This library is [Apache licensed](LICENSE.md).

[⬆ Back to Top](#appbase-analytics)
