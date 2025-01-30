/*import http from "node:http";

import fs from "node:fs"


const server = http.createServer((req, res) => {
    const homepage =fs.readFileSync('./html.html','utf8')

    console.log(req.url)
    if(req.url === '/home'){
        res.write(homepage)
    }else if (req.url === '/about'){
        res.write("<h1>About<h1>")
    }else if (req.url === '/'){
        res.write(homepage)
    }
    else{
        res.statusCode=404;
        res.write("<h1>not founded<h1>")
    }
    res.end();
});

server.listen(3002, () => {
    console.log("Server is powered on http://localhost:3002");
});
*/