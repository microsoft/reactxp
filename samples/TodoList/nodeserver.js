/**
* nodeserver.js
* Copyright: Microsoft 2018
*
* Simple node-based web server that hosts the app.
*/

var http = require('http');
var fs = require('fs');
var _ = require('lodash');
var querystring = require('querystring');
var serveStatic = require('serve-static');
var finalhandler = require('finalhandler');

// Find our static content in the web dir.
var serve = serveStatic('./web');
var port = 8080;

var config = {
    version: '0.0.1.0'
};

function replaceVariables(html, replacements) {
    _.each(replacements, (val, key) => {
        // Look for all instances of "{{ key }}" and replace them with val.
        var regEx = new RegExp('\\{\\{ ' + key + ' \\}\\}', 'g');
        html = html.replace(regEx, val);
    });

    return html;
}

// Serve up the requested page.
function serveHtmlPage(response, file) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    var html = fs.readFileSync(file, { encoding: 'utf8' });
    html = replaceVariables(html, {
        version: config.version
    });
    response.end(html);
}

function handler(request, response) {
    // Require that we're serving files from the proper domain. This is
    // necessary for OAuth flow and the cert.
    var knownHosts = [
        'localhost:8080',
        'localhost'
    ];

    if (!_.includes(knownHosts, request.headers.host)) {
        console.log('Unhandled host: ' + request.headers.host);
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end('');
        return;
    }

    // Serve simple static content through serveStatic/finalhandler.
    if (request.url.substr(0, 4) === '/js/' || request.url.substr(0, 5) === '/css/' ||
        request.url.substr(0, 8) === '/images/' || request.url.substr(0, 7) === '/fonts/') {
        console.log("[200] Serving static: " + request.method + " to " + request.url);
        var done = finalhandler(request, response);

        response.setHeader('Cache-Control', 'private, must-revalidate');

        serve(request, response, done);
        return;
    }

    if (request.url.substr(0, 8) === '/version') {
        console.log("[200] Serving static: " + request.method + " to " + request.url);
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end('{"AppVersion": "' + config.version + '"}');
        return;
    }

    console.log("[200] " + request.method + " to " + request.url);

    if (request.url.substr(0, 14) === '/oauthcallback') {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end();
        return;
    }

    // Everything else falls through to the single index.html file.
    if (request.method == 'POST') {
        // Someone's logging in, probably.
        var body = '';
        request.on('data', function (chunk) {
            body += chunk.toString();
        });
        request.on('end', function () {
            var decodedBody = querystring.parse(body);
            console.log(decodedBody);

            serveHtmlPage(response, 'web/index.html');
        });
    } else {
        serveHtmlPage(response, 'web/index.html');
    }
}

console.log(
    '\n' +
    '───────────────────────────────────────────────────────────────────────────\n' +
    ' Running app on port ' + port + '.\n\n' +
    ' Keep this server running while developing and refresh your browser for\n' +
    ' fresh assets.\n\n' +
    ' Assuming your hosts and certs have been configured properly, visit\n' +
    ' http://localhost:8080\n' +
    '───────────────────────────────────────────────────────────────────────────\n'
);

http.createServer(handler).listen(port);

