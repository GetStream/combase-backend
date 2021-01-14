This file uses the `integration-manifest.json` created at build-time to create what is essentially an event listener based on the parameters set in the plugins `./combase.config.json`.

`combase.config.json`
This file is parsed at build-time for each plugin included in the `combase.config.js` in the root of this repository.

From there, we map together the triggers and methods so they can be called when a corresponding event comes in.

This is acheived by dynamically creating a `captain-hook` (see `./createDynamicPlugins.js`) compatible plugin based on the above data.
