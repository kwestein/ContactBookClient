var https = require("https"),
    nodeStatic = require("node-static"),
    fileServer = new nodeStatic.Server(),
    port = process.env.PORT || 1337,
    host = process.env.IP || "127.0.0.1";

https.createServer(function (request, response) {
    request.addListener("end", function () {
        fileServer.serve(request, response);
    });
}).listen(port, host);

console.log("Server listening on " + host + " at port " + port);
