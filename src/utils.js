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

export function btoa(input = '') {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  const str = input;
  let output = '';

  // eslint-disable-next-line
  for (
    let block = 0, charCode, i = 0, map = chars;
    str.charAt(i | 0) || ((map = '='), i % 1); // eslint-disable-line no-bitwise
    output += map.charAt(63 & (block >> (8 - (i % 1) * 8))) // eslint-disable-line no-bitwise
  ) {
    charCode = str.charCodeAt((i += 3 / 4));

    if (charCode > 0xff) {
      throw new Error(
        '"btoa" failed: The string to be encoded contains characters outside of the Latin1 range.'
      );
    }

    block = (block << 8) | charCode; // eslint-disable-line no-bitwise
  }

  return output;
}
