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
    - [Record conversions for a particular search event](#record-conversions-for-a-particular-search-event)
    - [Record conversions with particular events](#record-conversions-with-particular-events)
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
  eventData: {
    click_source: 'promoted_collections'
  }
});
```

### Record conversions

To record a search conversion.

```ts
const aa = require('@appbaseio/analytics');

const aaInstance = aa.init({
  index: 'INDEX_NAME',
  credentials: 'AUTH_CREDENTIALS',
  url: 'CLUSTER_URL'
});

aaInstance.conversion({
  query: 'iphone',
  objects: ['iphoneX_19348', 'iphone7_19348']
});
```

#### Record conversions for a particular search event

Use `queryID` instead of `query` to record conversions for a particular search event.

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

#### Record conversions with particular events

Attach the custom events to distinguish the conversion events.

```ts
aaInstance.conversion({
  query: 'iphone',
  objects: ['iphoneX_19348', 'iphone7_19348'],
  eventData: {
    conversion_source: 'promoted_collections'
  }
});
```

### Set user

It sets the unique identification for each user to distinguish analytics events for users.

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

Sets the custom events which will be attached for each event.

For example:

```ts
const aa = require('@appbaseio/analytics');

const aaInstance = aa.init({
  index: 'INDEX_NAME',
  credentials: 'AUTH_CREDENTIALS',
  url: 'CLUSTER_URL'
});

// or set by using method
aaInstance.setGlobalEventData({
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
  globalEventData: 'GLOBAL_EVENT_DATA'
  headers?: 'CUSTOM_HEADERS'
});
```

Optional configuration options:

| Option            | Type     | Default         | Description                                |
| ----------------- | -------- | --------------- | ------------------------------------------ |
| **`index`**       | `string` | None (required) | Elasticsearch index name.                  |
| **`credentials`** | `string` | None (required) | API key for appbase.io hosted application. |
| **`url`**         | `string` | None (required) | Appbaseio cluster url.                     |
| `userID`          | `string` | null            | Sets the userID to be recorded.            |
| `globalEventData` | `object` | null            | To set the custom events                   |
| `headers`         | `object` | null            | To set the custom headers                  |

### Methods

#### Record Search

```ts

search(searchConfig: Object, callback: CallBack) => void

```

search configuration options:

| Option        | Type     | Default | Description                                                                            |
| ------------- | -------- | ------- | -------------------------------------------------------------------------------------- |
| **`query`**   | `string` | None    | Search query, set to empty string to register as an empty query search.                |
| **`queryID`** | `string` | None    | Search query ID returned from Appbase.                                                 |
| `eventData`   | `object` | null    | To set the search filters, for e.g `{ "year": 2018 }`                                  |
| `filters`     | `object` | null    | To set the custom events, for e.g `{ "platform": mac }`                                |
| `hits`        | `array`  | null    | To set the search hits, a hit object can have the `id`, `type` & `source` properties . |

An example with all possible options:

```ts
search(
  {
    query: 'iphone',
    // or
    queryID: 'cf827a07-60a6-43ef-ab93-e1f8e1e3e1a8',
    eventData: {
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
click(clickConfig: Object, callback: CallBack) => void
```

click configuration options:

| Option              | Type                      | Default         | Description                                                                                   |
| ------------------- | ------------------------- | --------------- | --------------------------------------------------------------------------------------------- |
| **`query`**         | `string`                  | None            | Search query, set to empty string to register as an empty query search.                       |
| **`queryID`**       | `string`                  | None            | Search query ID returned from Appbase.                                                        |
| **`objects`**       | `{[key: string]: number}` | None (required) | To set the click object ids followed by click positions, for example `{ "iphoneX_1234": 2 }`. |
| `isSuggestionClick` | `boolean`                 | `false`         | Set as `true` to register as a suggestion click.                                              |
| `eventData`         | `object`                  | null            | To set the custom events, for e.g `{ "platform": mac }`                                       |

<b>Note: </b>

`query` or `query_id` must be present.

An example with all possible options:

```ts
click(
  {
    query: 'iphone',
    // or
    queryID: 'cf827a07-60a6-43ef-ab93-e1f8e1e3e1a8',
    eventData: {
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
conversion(conversionConfig: Object, callback: CallBack) => void
```

conversion configuration options:

| Option        | Type            | Default         | Description                                                             |
| ------------- | --------------- | --------------- | ----------------------------------------------------------------------- |
| **`query`**   | `string`        | None            | Search query, set to empty string to register as an empty query search. |
| **`queryID`** | `string`        | None            | Search query ID returned from Appbase.                                  |
| **`objects`** | `Array<string>` | None (required) | To set the converted object ids, for example: `["iphoneX_1234"]`.       |
| `eventData`   | `object`        | null            | To set the custom events, for e.g `{ "platform": mac }`                 |

<b>Note: </b>

`query` or `query_id` must be present.

An example with all possible options:

```ts
conversion(
  {
    query: 'iphone',
    // or
    queryID: 'cf827a07-60a6-43ef-ab93-e1f8e1e3e1a8',
    eventData: {
      source: 'promoted_results'
    },
    objects: ['iphone_1234'],
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

#### Set headers

It allows you to set the custom headers in analytics endpoints.

```ts
setHeaders(headers: Object)
```

#### Set user

Sets the user ID which will be used to retrieve the search headers.

```ts
setUserID(userID: string)
```

#### Set global events

Sets the global events which will be added to all analytics requests.

```ts
setGlobalEventData(globalEvents: Object)
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
