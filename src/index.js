// @flow
import { btoa } from './utils';
import fetch from 'cross-fetch';
import {
  validateIndex,
  validateCredentials,
  validateURL,
  validateQuery,
  validateClickObjects,
  validateConversionObjects
} from './validate';

type Hit = {
  id?: string,
  type?: string,
  source?: Object
};

type AnalyticsConfig = {
  index: string,
  url: string,
  credentials: string,
  userID?: string,
  globalEventData?: { [key: string]: string },
  headers?: Object
};

type SearchConfig = {
  query: string,
  eventData?: { [key: string]: string },
  filters?: { [key: string]: string },
  hits?: Array<Hit>
};

type SearchRequestBody = {
  query: string,
  event_data?: { [key: string]: string },
  filters?: { [key: string]: string },
  user_id?: string,
  hits?: Array<Hit>
};

type ClickConfig = {
  query?: string,
  queryID?: string,
  isSuggestionClick?: boolean,
  objects: { [key: string]: number },
  eventData?: { [key: string]: string }
};

type ClickRequestBody = {
  click_on: { [key: string]: number },
  click_type?: 'result' | 'suggestion',
  query?: string,
  query_id?: string,
  event_data?: { [key: string]: string },
  user_iD?: string
};

type ConversionConfig = {
  objects: Array<string>,
  query?: string,
  queryID?: string,
  eventData?: { [key: string]: string }
};

type ConversionRequestBody = {
  conversion_on: Array<string>,
  query?: string,
  query_id?: string,
  event_data?: { [key: string]: string },
  user_iD?: string
};

type CallBack = (err: any, res: any) => void;

type Metrics = {
  index: string,
  url: string,
  credentials: string,
  globalEventData?: { [key: string]: string },
  userID?: string,
  queryID: string,
  headers?: Object,
  search?: (searchConfig: SearchConfig, callback: CallBack) => void,
  click?: (clickConfig: ClickConfig, callback: CallBack) => void,
  conversion?: (conversionConfig: ConversionConfig, callback: CallBack) => void,
  getQueryID?: () => string,
  setUserID?: (userID: string) => void,
  setGlobalEventData?: (events: { [key: string]: string }) => void,
  setHeaders?: (headers: Object) => void,
  _request?: (url: string, body: Object, callback?: CallBack) => void
};

function initClient(config: AnalyticsConfig = {}) {
  const metrics: Metrics = {
    credentials: config.credentials,
    index: config.index,
    url: config.url,
    userID: config.userID,
    globalEventData: config.globalEventData,
    queryID: '',
    headers: null
  };

  validateIndex(metrics.index);
  validateCredentials(metrics.credentials);
  validateURL(metrics.url);

  metrics._request = (
    url: string,
    body?: Object,
    callback?: CallBack
  ): void => {
    const finalBody = {
      ...body,
      user_id: metrics.userID,
      event_data: { ...(body && body.event_data), ...metrics.globalEventData }
    };
    return fetch(`${metrics.url}/${metrics.index}/_analytics/${url}`, {
      method: 'PUT',
      headers: {
        ...metrics.headers,
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(metrics.credentials)}`
      },
      body: JSON.stringify(finalBody)
    })
      .then(response => {
        if (callback) {
          callback(null, response);
        }
      })
      .catch(err => {
        console.error(err);
        if (callback) {
          callback(err, null);
        }
      });
  };

  // To register a search
  metrics.search = (searchConfig: SearchConfig, callback?: CallBack) => {
    validateQuery(searchConfig.query);
    const captureQueryID = (err: any, res: any) => {
      if (res) {
        res
          .json()
          .then(response => {
            if (response && response.query_id) {
              metrics.queryID = response.query_id;
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
      if (callback) {
        callback(err, res);
      }
    };
    // just to avoid the flow type error
    if (metrics._request) {
      const requestBody: SearchRequestBody = {
        query: searchConfig.query,
        event_data: searchConfig.eventData,
        filters: searchConfig.filters,
        hits: searchConfig.hits
      };
      metrics._request('search', requestBody, captureQueryID);
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
        event_data: clickConfig.eventData
      };
      metrics._request('click', requestBody, callback);
    }
  };

  // To register a conversion
  metrics.conversion = (
    conversionConfig: ConversionConfig,
    callback?: CallBack
  ) => {
    validateQuery(conversionConfig.query, conversionConfig.queryID);
    validateConversionObjects(conversionConfig.objects);
    // just to avoid the flow type error
    if (metrics._request) {
      const requestBody: ConversionRequestBody = {
        conversion_on: conversionConfig.objects,
        query: conversionConfig.query,
        query_id: conversionConfig.queryID,
        event_data: conversionConfig.eventData
      };
      metrics._request('conversion', requestBody, callback);
    }
  };

  // Sets the userID
  metrics.setUserID = (userID: string) => {
    metrics.userID = userID;
  };

  // Sets the global events
  metrics.setGlobalEventData = (globalEvents: { [key: string]: string }) => {
    metrics.globalEventData = globalEvents;
  };

  // Sets the headers
  metrics.setHeaders = (headers: Object) => {
    metrics.headers = headers;
  };

  return metrics;
}

export default {
  init: initClient
};
