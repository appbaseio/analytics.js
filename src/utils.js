/**
 * Function to parse the headers to a string
 */
export function parseHeaders(headers: Object): string {
  let finalStr = '';
  if (headers) {
    Object.keys(headers).forEach((key, index) => {
      finalStr += `${key}=${headers[key]}`;
      if (index < Object.keys(headers).length - 1) {
        finalStr += ',';
      }
    });
  }
  return finalStr;
}

// Function to parse the URL
export function getURL(url: string): string {
  return url && url.trim() !== '' ? url : 'https://scalr.api.appbase.io';
}
