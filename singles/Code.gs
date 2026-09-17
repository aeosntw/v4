/**
 * Google Apps Script web-app adapter for Aeos v4.
 *
 * Deploy: Deploy > New deployment > Web app.
 *   Execute as:        Me
 *   Who has access:    Anyone
 *
 * jsDelivr serves .html files as text/plain, so an iframe src pointing at it
 * would just render raw source. Instead we fetch the loader here and serve it
 * as real HTML from the Apps Script URL, which gives the page a proper https
 * origin (required by LuminSDK).
 *
 * Override the loader URL without editing code:
 *   Script Properties > AEOS_SINGLE_URL
 */

var DEFAULT_SINGLE_URL = 'https://cdn.jsdelivr.net/gh/aeosntw/v4@main/singles/aeos-v4.html';
var CACHE_KEY = 'aeos_single_html';
var CACHE_TTL = 600;

var AMP = String.fromCharCode(38);
var HASH = String.fromCharCode(35);

var ENTITIES = {
  '&': AMP + 'amp;',
  '<': AMP + 'lt;',
  '>': AMP + 'gt;',
  '"': AMP + 'quot;',
  "'": AMP + HASH + '39;'
};

var ENTITY_CHARS = /[&<>"']/g;

function escapeHtml_(value) {
  return String(value).replace(ENTITY_CHARS, function (character) {
    return ENTITIES[character] || character;
  });
}

function loaderUrl_() {
  try {
    var stored = PropertiesService.getScriptProperties().getProperty('AEOS_SINGLE_URL');
    if (stored && stored.length) return stored;
  } catch (e) {}
  return DEFAULT_SINGLE_URL;
}

function fetchLoader_() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get(CACHE_KEY);
  if (cached) return cached;

  var url = loaderUrl_();
  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var code = response.getResponseCode();
  if (code !== 200) {
    return [
      '<!doctype html><html><body style="color:#fff;background:#000;',
      'font:16px system-ui;padding:2rem">',
      'Failed to load Aeos loader (HTTP ',
      escapeHtml_(String(code)),
      '). Check the AEOS_SINGLE_URL script property.</body></html>'
    ].join('');
  }

  var html = response.getContentText();
  cache.put(CACHE_KEY, html, CACHE_TTL);
  return html;
}

function doGet() {
  return HtmlService
    .createHtmlOutput(fetchLoader_())
    .setTitle('Aeos v4')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
