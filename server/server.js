var mysql = require('mysql');
var connection = mysql.createConnection({
      host     : '115.88.201.51',
      user     : 'iotr',
      password : 'iotr123'}
);

var http = require('http');
http.createServer(function (req, res) {
      connection.connect(function(err) {
            if (err) {
                  res.writeHead(500, {'Content-Type': 'text/plain'});
                  res.end('Connection failed: ' + err.stack + '\n');
                  return;
            }
            connection.query('SELECT timestamp, lat, lng, mcp_value FROM kisti.sensorParser WHERE mcp_value IS NOT NULL AND mcp_value <> 0 ORDER BY timestamp DESC LIMIT 0,8', function(err, results, fields) {
                  res.writeHead(200, {'Content-Type': 'application/json', 'charset': 'utf-8'});
                  res.write(JSON.stringify(results), encoding='utf8');
                  res.end();
            });
      });
}).listen(1337);
