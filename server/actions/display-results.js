/**
 * This action sends data through socket io, so it
 *   needs access to the io object which is passed
 *   through as function param (the first arrow function)
 *   in ../wit.js
 */

module.exports = io => ({context, sessionId}) =>
  new Promise(resolve => {
    io.to(sessionId).emit('displayResults', context.results);
    return resolve(context);
  });
