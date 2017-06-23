import {formatDate} from './utils';

/**
 * Render date section
 * @param  {String} formattedDate Datestring in YYYY-MM-DD
 * @param  {String} children HTML
 * @return {String} HTML
 */
export function renderDateSection(formattedDate, children = '') {
  const now = new Date();
  const today = formatDate(now);
  return `
    <li>
      <time datetime="${formattedDate}T00:00">${formattedDate === today ? 'Vandaag' : formattedDate}</time>
      ${children}
    </li>
  `;
}

/**
 * Render a single article element
 * @param  {Object} message Message object
 * @param  {Boolean} read Message has been read by Robat
 * @return {String} Single html element
 */
export function renderMessage(message, read = false) {
  const {id, value} = message;
  return `<article data-id=${id} data-read=${read}>${value}</article>`;
}
