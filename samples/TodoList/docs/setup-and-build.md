
# Setup & Build Instructions

## Web Build
To test the web build, you can run a local web server in node.

### Node.JS
From a command line, go to the TodoList directory and simply type:
```
node nodeserver.js
```
Within a browser, open http://localhost:8080/. You should see some debug spew as the local web server handles requests.

On Windows, if there is another process already bound to port 80, the node server will fail to start ("Error listen EACCES 0.0.0.0:80").
