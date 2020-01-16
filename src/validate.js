export function validateIndex(index: string) {
  if (!index) {
    throw new Error(
      'appbase-analytics: A valid index must be present to record analytics events.'
    );
  }
}

export function validateCredentials(credentials: string) {
  if (!credentials) {
    throw new Error('appbase-analytics: Auth credentials is missing.');
  }
}

export function validateURL(url: string) {
  if (!url) {
    throw new Error('appbase-analytics: URL is missing.');
  }
}

export function validateSearchQuery(query: string) {
  if (query === undefined || query === null) {
    throw new Error(
      'appbase-analytics: query must be present, set to empty string to register as an empty query search.'
    );
  }
}

export function validateQuery(query: string, queryID: string) {
  if ((query === undefined || query === null) && !queryID) {
    throw new Error(
      'appbase-analytics: query or queryID must be present to register a click/conversion event'
    );
  }
}

export function validateClickObjects(objects: Object) {
  if (!objects || Object.keys(objects).length < 1) {
    throw new Error(
      'appbase-analytics: at least one click object must be present to register a click event'
    );
  }
}

export function validateConversionObjects(objects: Object) {
  if (!objects || Object.keys(objects).length < 1) {
    throw new Error(
      'appbase-analytics: at least one click object must be present to register a click event'
    );
  }
}
