/**
 * Returns date in YYYY-MM-DD
 * @param  {Date} date Date to convert
 * @return {String} Date in YYYY-MM-DD
 */
export function formatDate(date) {
  return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
}

/**
 * Convert array of objects w/ timestamp to object by date
 * @param  {Array} messages Messages to convert
 * @return {Object} Messages grouped by date YYYY-MM-DD
 */
export function groupMessagesByDate(messages = []) {
  const groupedMessages = {};

  messages.forEach(message => {
    const groupKey = formatDate(message.timestamp);

    if (groupedMessages[groupKey]) {
      groupedMessages[groupKey] = [...groupedMessages[groupKey], message];
    } else {
      groupedMessages[groupKey] = [message];
    }
  });

  return groupedMessages;
}
