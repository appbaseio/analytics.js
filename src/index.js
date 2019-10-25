// @flow
import { parseHeaders, getURL, btoa } from './utils';
import fetch from 'cross-fetch';

type AnalyticsConfig = {
  index: string,
  url: string,
  credentials: string,
  userID?: string,
  customEvents?: Object,
  headers?: Object
};

function AppbaseAnalytics(config: AnalyticsConfig = {}) {
  this.index = config.index;
  this.credentials = config.credentials;
  this.url = getURL(config.url);
  this.userID = config.userID;
  this.customEvents = config.customEvents;
  this.searchQuery = undefined;
  this.searchID = undefined;
  this.searchState = null;
  this.filters = null;
  // custom headers
  this.headers = null;
}

export default function(config: AnalyticsConfig = {}) {
  const client = new AppbaseAnalytics(config);

  AppbaseAnalytics.prototype.setIndex = function(index: string) {
    this.index = index;
    return this;
  };

  AppbaseAnalytics.prototype.setCredentials = function(credentials: string) {
    this.credentials = credentials;
    return this;
  };

  AppbaseAnalytics.prototype.setURL = function(url: string) {
    this.url = getURL(url);
    return this;
  };

  AppbaseAnalytics.prototype.setHeaders = function(headers: Object) {
    this.headers = headers;
    return this;
  };

  AppbaseAnalytics.prototype.setSearchQuery = function(searchQuery: string) {
    this.searchQuery = searchQuery;
    return this;
  };

  AppbaseAnalytics.prototype.clearSearchQuery = function() {
    this.searchQuery = undefined;
    return this;
  };

  AppbaseAnalytics.prototype.setSearchID = function(searchID: string) {
    this.searchID = searchID;
    return this;
  };

  AppbaseAnalytics.prototype.clearSearchID = function() {
    this.searchID = undefined;
    return this;
  };

  AppbaseAnalytics.prototype.setSearchState = function(searchState: string) {
    this.searchState = searchState;
    return this;
  };

  AppbaseAnalytics.prototype.clearSearchState = function() {
    this.searchState = null;
    return this;
  };

  AppbaseAnalytics.prototype.setUserID = function(userID: string) {
    this.userID = userID;
    return this;
  };

  AppbaseAnalytics.prototype.clearUserID = function() {
    this.userID = null;
    return this;
  };

  AppbaseAnalytics.prototype.setCustomEvents = function(customEvents: Object) {
    this.customEvents = customEvents;
    return this;
  };

  AppbaseAnalytics.prototype.clearCustomEvents = function() {
    this.customEvents = null;
    return this;
  };

  AppbaseAnalytics.prototype.addCustomEvent = function(customEvent: Object) {
    this.customEvents = { ...this.customEvents, customEvent };
    return this;
  };

  AppbaseAnalytics.prototype.removeCustomEvent = function(eventKey: string) {
    const { [eventKey]: del, ...rest } = this.customEvents;
    this.customEvents = rest;
    return this;
  };

  AppbaseAnalytics.prototype.setFilters = function(filters: Object) {
    this.filters = filters;
    return this;
  };

  AppbaseAnalytics.prototype.clearFilters = function() {
    this.filters = null;
    return this;
  };

  AppbaseAnalytics.prototype.addFilter = function(filter: Object) {
    this.filters = { ...this.filters, filter };
    return this;
  };

  AppbaseAnalytics.prototype.removeFilter = function(filterKey: string) {
    const { [filterKey]: del, ...rest } = this.filters;
    this.filters = rest;
    return this;
  };

  AppbaseAnalytics.prototype.registerClick = function(
    clickPosition: number,
    isSuggestion?: boolean
  ): Promise<any> {
    if (Number.isNaN(parseInt(clickPosition, 10))) {
      throw new Error('appbase-analytics: click position must be an integer.');
    }
    const commonHeaders = this._recordEventHeaders();
    return fetch(`${this.url}/${this.index}/_analytics`, {
      method: 'POST',
      headers: {
        ...commonHeaders,
        ...(isSuggestion
          ? {
              'X-Search-Suggestions-Click': true,
              'X-Search-Suggestions-ClickPosition': clickPosition
            }
          : {
              'X-Search-Click': true,
              'X-Search-ClickPosition': clickPosition
            })
      }
    });
  };

  AppbaseAnalytics.prototype.registerConversion = function(): Promise<any> {
    const commonHeaders = this._recordEventHeaders();
    return fetch(`${this.url}/${this.index}/_analytics`, {
      method: 'POST',
      headers: {
        ...commonHeaders,
        'X-Search-Conversion': true
      }
    });
  };

  // Headers value will be based on the analytics current state, may or may not present
  AppbaseAnalytics.prototype.getAnalyticsHeaders = function() {
    return {
      // Support empty query
      ...(this.searchQuery !== undefined
        ? {
            'X-Search-Query': this.searchQuery
          }
        : null),
      ...(this.searchID
        ? {
            'X-Search-Id': this.searchID
          }
        : null),
      ...(this.searchState
        ? {
            'X-Search-State': JSON.stringify(this.searchState)
          }
        : null),
      ...(this.userID
        ? {
            'X-User-Id': this.userID
          }
        : null),
      ...(this.customEvents
        ? {
            'X-Search-CustomEvent': parseHeaders(this.customEvents)
          }
        : null),
      ...(this.filters
        ? {
            'X-Search-Filters': parseHeaders(this.filters)
          }
        : null)
    };
  };

  AppbaseAnalytics.prototype._recordEventHeaders = function() {
    if (!this.index) {
      throw new Error(
        'appbase-analytics: A valid index must be present to record an event.'
      );
    }
    if (!this.credentials) {
      throw new Error('appbase-analytics: Auth credentials is missing.');
    }
    if (!this.searchID) {
      throw new Error(
        'appbase-analytics: searchID must be present to record an event.'
      );
    }
    return {
      ...this.headers,
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(this.credentials)}`,
      'X-Search-Id': this.searchID,
      ...(this.userID
        ? {
            'X-User-Id': this.userID
          }
        : null),
      ...(this.customEvents
        ? {
            'X-Search-CustomEvent': parseHeaders(this.customEvents)
          }
        : null)
    };
  };

  return client;
}
