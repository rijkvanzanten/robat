module.exports = function(req, res) {
  const contentType = req.headers['content-type'];

  if (contentType && contentType === 'application/json') {
    return handleJSONRequest(req, res);
  }

  return handleHTMLRequest(req, res);
};

/**
 * Handle request that come in with a content-type = application/json header
 *   client expects JSON
 * @param  {Object} req Express request object
 * @param  {Object} res Express response object
 */
function handleJSONRequest(req, res) {
  res.json({
    messages: [],
  });
}

/**
 * Handle regular post requests
 *   client expects HTML
 * @param  {Object} req Express request object
 * @param  {Object} res Express response object
 */
function handleHTMLRequest(req, res) {
  res.render('index', {
    messages: [], // the messages based on the session
  });
}
