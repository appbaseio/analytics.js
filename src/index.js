// @flow
import { btoa } from './utils';
import fetch from 'cross-fetch';
import {
  validateIndex,
  validateCredentials,
  validateURL,
  validateQuery,
  validateClickObjects,
  validateConversionObjects,
  validateQueryID
} from './validate';

type Hit = {
  id?: string,
  type?: string,
  source?: Object
};

type Impression = {
  id: string,
  index: 'good-books-ds'
};

type AnalyticsConfig = {
  index: string,
  url: string,
  credentials: string,
  userID?: string,
  globalCustomEvents?: { [key: string]: string },
  headers?: Object
};

type SearchConfig = {
  query?: string,
  queryID?: string,
  customEvents?: { [key: string]: string },
  filters?: { [key: string]: string },
  hits?: Array<Hit>,
  impressions?: Array<Impression>
};

type SearchRequestBody = {
  query?: string,
  query_id?: string,
  custom_events?: { [key: string]: string },
  filters?: { [key: string]: string },
  user_id?: string,
  hits?: Array<Hit>
};

type ClickConfig = {
  query?: string,
  queryID?: string,
  isSuggestionClick?: boolean,
  objects: { [key: string]: number },
  customEvents?: { [key: string]: string },
  meta?: Object
};

type ClickRequestBody = {
  click_on: { [key: string]: number },
  click_type?: 'result' | 'suggestion',
  query?: string,
  query_id?: string,
  custom_events?: { [key: string]: string },
  user_id?: string,
  meta?: Object
};

type ConversionConfig = {
  objects: Array<string>,
  queryID?: string,
  meta?: Object
};

type SaveSearchConfig = {
  queryID: string,
  saveSearchID?: string,
  saveSearchMeta?: Object,
  userID?: string,
  customEvents?: { [key: string]: string }
};

type SaveSearchRequestBody = {
  query_id: string,
  save_search_id?: string,
  save_search_meta?: Object,
  user_id?: string,
  custom_events?: { [key: string]: string }
};

type FavoriteConfigRequest = {
  favorite_on: string,
  source: Object,
  query_id: string,
  id?: string,
  custom_events?: { [key: string]: string },
  user_id?: string,
  meta?: Object
};

type FavoriteConfig = {
  favoriteOn: string,
  source: Object,
  queryID: string,
  id?: string,
  customEvents?: { [key: string]: string },
  userID?: string,
  meta?: Object
};

type ConversionRequestBody = {
  conversion_on: Array<string>,
  query_id?: string,
  meta?: Object
};

type UsefulnessConfig = {
  useful: boolean,
  reason?: string,
  userID?: string,
  meta?: Object
};

type CallBack = (err: any, res: any) => void;

type Metrics = {
  index: string,
  url: string,
  credentials: string,
  globalCustomEvents?: { [key: string]: string },
  userID?: string,
  queryID: string,
  headers?: Object,
  search?: (searchConfig: SearchConfig, callback: CallBack) => void,
  click?: (clickConfig: ClickConfig, callback: CallBack) => void,
  conversion?: (conversionConfig: ConversionConfig, callback: CallBack) => void,
  // To save search
  saveSearch?: (saveSearchConfig: SaveSearchConfig, callback: CallBack) => void,
  // To delete saved search
  deleteSavedSearch?: (saveSearchId: string, callback: CallBack) => void,
  // To retrieve saved searches
  getSavedSearches?: (filters?: Object, callback: CallBack) => void,
  // To record a favorite document
  favorite?: (favoriteConfig: FavoriteConfig, callback: CallBack) => void,
  // To retrieve favorites
  getFavorites?: (filters?: Object, callback: CallBack) => void,
  getQueryID?: () => string,
  setUserID?: (userID: string) => void,
  setGlobalCustomEvents?: (events: { [key: string]: string }) => void,
  setHeaders?: (headers: Object) => void,
  _request: (
    method: string,
    url: string,
    body?: Object,
    queryParams?: Object,
    callback?: CallBack
  ) => void,
  // Save session's usefulness
  saveSessionUsefulness?: (
    aiSessionId: string,
    usefulnessConfig: UsefulnessConfig,
    callback?: CallBack
  ) => void
};

function initClient(config: AnalyticsConfig = {}) {
  const metrics: Metrics = {
    credentials: config.credentials,
    index: config.index,
    url: config.url,
    userID: config.userID,
    globalCustomEvents: config.globalCustomEvents,
    queryID: '',
    headers: null,
    _request: (
      method: string,
      url: string,
      body?: Object,
      queryParams?: Object,
      callback?: CallBack
    ): void => {
      const finalBody = {
        user_id: metrics.userID,
        ...body,
        custom_events: {
          ...(body && body.custom_events),
          ...metrics.globalCustomEvents
        }
      };
      let queryParamsString = '';
      if (queryParams) {
        queryParamsString = Object.keys(queryParams)
          .map(param => `${param}=${queryParams[param]}`)
          .join('&');
      }
      return fetch(`${metrics.url}/${url}?${queryParamsString}`, {
        method: method,
        headers: {
          ...metrics.headers,
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(metrics.credentials)}`
        },
        body: method === 'GET' ? null : JSON.stringify(finalBody)
      })
        .then(response => {
          if (callback) {
            callback(null, response);
          }
        })
        .catch(err => {
          if (callback) {
            callback(err, null);
          }
        });
    }
  };

  validateIndex(metrics.index);
  validateCredentials(metrics.credentials);
  validateURL(metrics.url);

  // To register a search
  metrics.search = (searchConfig: SearchConfig, callback?: CallBack) => {
    validateQuery(searchConfig.query, searchConfig.queryID);
    const captureQueryID = (err: any, res: any) => {
      if (res) {
        res
          .json()
          .then(response => {
            if (response && response.query_id) {
              metrics.queryID = response.query_id;
            }
            if (callback) {
              callback(err, res);
            }
          })
          .catch(err2 => {
            if (callback) {
              callback(err2, res);
            }
          });
      } else if (callback) {
        callback(err, res);
      }
    };
    // just to avoid the flow type error
    if (metrics._request) {
      const requestBody: SearchRequestBody = {
        query: searchConfig.query,
        query_id: searchConfig.queryID,
        custom_events: searchConfig.customEvents,
        filters: searchConfig.filters,
        hits: searchConfig.hits,
        impressions: searchConfig.impressions
      };
      metrics._request(
        'PUT',
        `${metrics.index}/_analytics/search`,
        requestBody,
        null,
        captureQueryID
      );
    }
  };

  // To register a click
  metrics.click = (clickConfig: ClickConfig, callback?: CallBack) => {
    validateQuery(clickConfig.query, clickConfig.queryID);
    validateClickObjects(clickConfig.objects);
    // just to avoid the flow type error
    if (metrics._request) {
      const requestBody: ClickRequestBody = {
        click_on: clickConfig.objects,
        click_type: clickConfig.isSuggestionClick ? 'suggestion' : 'result',
        query: clickConfig.query,
        query_id: clickConfig.queryID,
        custom_events: clickConfig.customEvents,
        meta: clickConfig.meta
      };
      metrics._request(
        'PUT',
        `${metrics.index}/_analytics/click`,
        requestBody,
        null,
        callback
      );
    }
  };

  // To register a conversion
  metrics.conversion = (
    conversionConfig: ConversionConfig,
    callback?: CallBack
  ) => {
    validateQuery(null, conversionConfig.queryID);
    validateConversionObjects(conversionConfig.objects);
    // just to avoid the flow type error
    if (metrics._request) {
      const requestBody: ConversionRequestBody = {
        conversion_on: conversionConfig.objects,
        query_id: conversionConfig.queryID,
        meta: conversionConfig.meta
      };
      metrics._request(
        'PUT',
        `${metrics.index}/_analytics/conversion`,
        requestBody,
        null,
        callback
      );
    }
  };

  // To save search
  metrics.saveSearch = (
    saveSearchConfig: SaveSearchConfig,
    callback?: CallBack
  ) => {
    validateQueryID(saveSearchConfig.queryID);
    const requestBody: SaveSearchRequestBody = {
      query_id: saveSearchConfig.queryID,
      save_search_id: saveSearchConfig.saveSearchID,
      save_search_meta: saveSearchConfig.saveSearchMeta,
      user_id: saveSearchConfig.userID,
      custom_events: saveSearchConfig.customEvents
    };
    metrics._request(
      'PUT',
      '_analytics/save-search',
      requestBody,
      null,
      callback
    );
  };

  // To delete save search
  metrics.deleteSavedSearch = (saveSearchId: string, callback?: CallBack) => {
    metrics._request(
      'DELETE',
      '_analytics/save-search/' + saveSearchId,
      null,
      null,
      callback
    );
  };

  // To retrieve saved searches
  metrics.getSavedSearches = (filters?: Object, callback?: CallBack) => {
    // just to avoid the flow type error
    if (metrics._request) {
      metrics._request(
        'GET',
        '_analytics/saved-searches',
        null,
        filters,
        callback
      );
    }
  };

  // To record a favorite document
  metrics.favorite = (favoriteConfig: FavoriteConfig, callback?: CallBack) => {
    validateQueryID(favoriteConfig.queryID);
    if (!favoriteConfig.favoriteOn || favoriteConfig.favoriteOn === '') {
      throw new Error('appbase-analytics: favoriteOn property is required');
    }
    if (!favoriteConfig.source) {
      throw new Error('appbase-analytics: source property is required');
    }
    const requestBody: FavoriteConfigRequest = {
      query_id: favoriteConfig.queryID,
      favorite_on: favoriteConfig.favoriteOn,
      source: favoriteConfig.source,
      id: favoriteConfig.id,
      meta: favoriteConfig.meta,
      user_id: favoriteConfig.userID,
      custom_events: favoriteConfig.customEvents
    };
    metrics._request('PUT', '_analytics/favorite', requestBody, null, callback);
  };

  // To retrieve favorites
  metrics.getFavorites = (filters?: Object, callback?: CallBack) => {
    // just to avoid the flow type error
    if (metrics._request) {
      metrics._request('GET', '_analytics/favorites', null, filters, callback);
    }
  };

  // Sets the userID
  metrics.setUserID = (userID: string) => {
    metrics.userID = userID;
  };

  // Sets the global events
  metrics.setGlobalCustomEvents = (globalEvents: { [key: string]: string }) => {
    metrics.globalCustomEvents = globalEvents;
  };

  // Sets the headers
  metrics.setHeaders = (headers: Object) => {
    metrics.headers = headers;
  };

  // get queryID
  metrics.getQueryID = () => metrics.queryID;

  // Save session's usefulness
  metrics.saveSessionUsefulness = (
    aiSessionId: string,
    usefulnessConfig: {
      useful: boolean,
      reason?: string,
      userID?: string,
      meta?: Object
    },
    callback?: CallBack
  ) => {
    if (typeof aiSessionId !== 'string' || aiSessionId === '') {
      throw new Error('appbase-analytics: AISessionId is required');
    }
    if (typeof usefulnessConfig.useful !== 'boolean') {
      throw new Error(
        'appbase-analytics: useful property is required and must be a boolean'
      );
    }

    const requestBody = {
      useful: usefulnessConfig.useful,
      reason: usefulnessConfig.reason,
      user_id: usefulnessConfig.userID,
      meta: usefulnessConfig.meta
    };

    metrics._request(
      'PUT',
      `_ai/${aiSessionId}/analytics`,
      requestBody,
      null,
      callback
    );
  };

  return metrics;
}

export default {
  init: initClient
};
