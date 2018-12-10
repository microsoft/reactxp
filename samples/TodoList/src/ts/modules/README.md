# "modules" directory

This directory contains platform-specific modules. A module should present the same interface for all supported platforms.

To import a module, use an absolute path with the module name after 'modules/'. For example, if your modules folder is named 'foo', you can import that module like this:
``` import Foo from 'modules/foo'; ```

The packager will resolve this at build time to the appropriate platform-specific implementation. It searches in the following order:
* index.<platform>.ts[x]
* index.<web|native>.ts[x]
* index.ts[x]

This allows for common implementations with platform-specific overrides.

