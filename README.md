### Appbase Analytics

A universal analytics library that allows you to register click, conversion and custom events for appbase.io apps.

## Table of Contents

- [Getting started](#getting-started)
  - [Browser](#browser)
  - [Node.js](#nodejs)
- [Use cases](#use-cases)
  - [Initialize search](#initialize-search)
  - [Register click events](#register-click-events)
  - [Register conversions](#register-conversions)
  - [Set user](#set-user)
  - [Set custom events](#set-custom-events)
  - [Set search state](#set-search-state)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Getting started

### Browser

#### 1. Load the library

The analytics library can be either loaded via [jsDelivr CDN](https://www.jsdelivr.com/) or directly bundled with your application.

You can use the UMD build in browsers by following the below snippet:

<!-- prettier-ignore-start -->
```html
<script defer src="https://cdn.jsdelivr.net/npm/@appbaseio/analytics@1.0.0-alpha.1/dist/@appbaseio/analytics.umd.min.js"
></script>
```
<!-- prettier-ignore-end -->

#### 2. Initialization

```js
aa({
  index: 'APP_NAME',
  credentials: 'APP_CREDENTIALS'
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

aa({
  index: 'APP_NAME',
  credentials: 'APP_CREDENTIALS'
});
```

## Use cases

The analytics library provides the utility methods to implement the appbase.io search analytics, the common use-cases are to record the clicks, conversions and apply the search headers to create a search session.

### Initialize search

To register the click events you just need to create a search session and get the search id, a search session can be initialized bypassing the `x-search-query` header in the `_msearch` or `_search` request.

We recommend to use `getAnalyticsHeaders` method to attach the analytics headers in search requests. For example:

```js
const aa = require('@appbaseio/analytics');

aa({
  index: 'APP_NAME',
  credentials: 'APP_CREDENTIALS'
});

const analyticsHeaders = aa.setSearchQuery('harry').getAnalyticsHeaders();

fetch(`https://scalr.api.appbse.io/${APP_NAME}/_search`, {
  headers: analyticsHeaders
})
  .then(res => {
    const searchID = res.headers.get('X-Search-Id');
    // Set the search id back to the analytics instance
    if (searchID) {
      aa.setSearchID(searchID);
    }
  })
  .catch(err => {
    console.error(err);
  });
```

Once you get the `searchID` back you need to use it to record the analytics events.

### Register click events

Click events can be registered with the help of `registerClick` method which has the following signature:

```ts
registerClick(
    clickPosition: number, // position of the item in the list
    isSuggestion?: boolean // whether a click is of type suggestion or results
  ): Promise<any>
```

#### Register a result click

```js
aa()
  .setIndex('APP_NAME') // If index is not set during initialization
  .setCredentials('APP_CREDENTIALS') // If credentials is not set during initialization
  .setSearchID('SEARCH_ID') // SEARCH_ID must be present otherwise the function will throw an error
  .registerClick(`CLICK_POSITION`);
```

#### Register a suggestion click

```js
aa()
  .setIndex('APP_NAME') // If index is not set during initialization
  .setCredentials('APP_CREDENTIALS') // If credentials is not set during initialization
  .setSearchID('SEARCH_ID') // SEARCH_ID must be present otherwise the function will throw an error
  .registerClick(`CLICK_POSITION`, true);
```

### Register conversions

```js
aa()
  .setIndex('APP_NAME') // If index is not set during initialization
  .setCredentials('APP_CREDENTIALS') // If credentials is not set during initialization
  .setSearchID('SEARCH_ID') // SEARCH_ID must be present otherwise the function will throw an error
  .registerConversion();
```

### Set user

```js
aa().setUserID('harry');
```

### Set custom events

```js
aa().setCustomEvents({
  key1: 'value1',
  key2: 'value2'
});
```

### Set search state

```js
aa().setSearchState({
  BookSensor: {
    dataField: 'original_title',
    value: 'harry',
    queryFormat: 'or'
  }
});
```

## API Reference

### Initialization

Although this library supports chaining i.e you can set and clear anything whenever you want but you can initialize it at once with some common properties to avoid the duplication.

```js
const aa = require('@appbaseio/analytics');

aa({
  index: 'APP_NAME',
  credentials: 'APP_CREDENTIALS'
});
```

Optional configuration options:

| Option            | Type      | Default                        | Description                                                                         |
| ----------------- | --------- | ------------------------------ | ----------------------------------------------------------------------------------- |
| **`index`**       | `string`  | None (required)                | App name for appbase.io apps or index name in case of `Arc` or `clusters`.          |
| **`credentials`** | `string`  | None (required)                | API key for appbase.io hosted application.                                          |
| `url`             | `string`  | `https://scalr.api.appbase.io` | Not needed for appbase.io apps but in case of `Arc` you need to define the arc URL. |
| `userID`          | `string`  | null                           | Sets the userID to be recorded.                                                     |
| `customEvents`    | `object`  | null                           | To set the custom events                                                            |
| `headers`         | `object`  | null                           | To set the custom headers                                                           |
| `emptyQuery`      | `boolean` | true                           | To define whether to record the empty queries or not                                |

### Methods

##

```ts
setIndex(index: string)
```

To set the index or app name.

##

```ts
setCredentials(credentials: string)
```

To set the application auth credentials.

##

```ts
setURL(url: string)
```

To set the URL, required when you use the appbase.io clusters or `Arc`.

##

```ts
setHeaders(headers: Object)
```

It allows you to set the custom headers in analytics endpoints.

##

```ts
setSearchQuery(searchQuery: string)
```

Sets the search query which is needed to retrieve the search headers.

##

```ts
clearSearchQuery();
```

Clears the search query

##

```ts
setSearchID(searchID: string)
```

Sets the search ID which is required to register the analytics events.

##

```ts
clearSearchID();
```

Clears the `searchID`

##

```ts
setSearchState(searchState: string)
```

Sets the search state which will be used to retrieve the search headers.

##

```ts
clearSearchState();
```

Clears the saved search state.

##

```ts
setUserID(userID: string)
```

Sets the user ID which will be used to retrieve the search headers.

##

```ts
clearUserID();
```

Clears the userID

##

```ts
setCustomEvents(customEvents: Object)
```

Sets the custom events which will override the existing custom events and will be used further in the analytics headers.
For example:

```js
aa.setCustomEvents({
  platform: 'mac',
  user_segment: 'free'
});
```

##

```ts
clearCustomEvents();
```

Clears the existing custom events

##

```ts
addCustomEvent(customEvent: Object)
```

Add a particular custom event in the existing custom events.

```js
aa.addCustomEvent({
  platform: 'mac'
});
```

##

```ts
removeCustomEvent(eventKey: string)
```

Remove a custom event by key

```js
aa.removeCustomEvent('platform');
```

##

```ts
setFilters(filters: Object)
```

Set the filters which will be used to retrieve the search headers.

```js
aa.setFilters({
  brand: 'Adidas',
  category: 'shoes'
});
```

````

##

```ts
clearFilters();
````

Clear the filters

##

```ts
addFilter(filter: Object)
```

Adds a filter in the existing filters.

##

```ts
removeFilter(filterKey: string)
```

Removes a filter by key

##

```ts
enableEmptyQuery();
```

Enables the recording of empty queries i.e create a search session even if the search query is empty.

##

```ts
disableEmptyQuery();
```

Disables the recording of empty queries.

##

```ts
registerClick(
clickPosition: number,
isSuggestion?: boolean
): Promise<any>
```

Registers a click event

##

```ts
registerConversion(): Promise<any>
```

Registers a search conversion

##

```ts
getAnalyticsHeaders(): Object
```

Returns a list of search headers based on the analytics state which needs to be applied to the `_search` & `_msearch` request to create a search session.

## Contributing

Fork the repo and run the following command to run & test locally.

```bash
yarn && yarn test
```

## License

This library is [MIT licensed](LICENSE.md).
