
# Setup & Build Instructions

## Web Build
To test the web build, you can run a local web server in node.

### Hosts
The hosts file defines the mappings between hostnames and IP addresses. Here are the steps to redirect the website URL so you can test private bits.

On Windows, the hosts file is located in "c:\windows\system32\drivers\etc\hosts" and can be edited from within notepad running as adminstrator.

On MacOS, the hosts file is located in "/private/etc/hosts" and can be edited with your favorite editor.

Add this line to your hosts file:
    ```
    127.0.0.1 todolist-dev.sample.com
    ```

### Node.JS
Follow the instructions below to modify your hosts directory.
From a command line, go to the web directory and simply type:
```
node nodeserver.js
```
Within a browser, open http://todolist-dev.sample.com/. You should see some debug spew as the local web server handles requests.

On Windows, IIS cannot already be running on port 80, otherwise the node server will fail to start ("Error listen EACCES 0.0.0.0:80").
