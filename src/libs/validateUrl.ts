export function isValidUrl(url: string): boolean {
  const pattern = /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w\-.?=&]*)*\/?$/;
  return pattern.test(url);
}
