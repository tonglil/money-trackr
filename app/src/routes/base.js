/*
 *Base endpoints
 */

module.exports = function(app) {
  app.get('/none', function(req, res) {
    res.json(200, null);
  });

  app.get('*', function(req, res) {
    res.json(404, 'not found');
  });

  app.get('/err', function(req, res) {
    res.json(500, 'error');
  });
};
