# LinkedOut
This is a simple extension for logging data for jobs applied on 
LinkedIn. In general, this can be generalized to domain specific 
logging through expanding the content script portion of the manifest. 
The application may not be the most optimized but it met my needs and 
I had no performance issues. 

# Overview
The project is divided into a few main components. You will need to 
edit `manifest.json` with your own client-key for the google console 
project you create to access googlesheets API. You should only need
to interact with `./scripts/content.js` and `./scripts/entries.js` 
to modify how and what data is stored. `content.js` allows you to 
define what data is stored in the google sheet and in which columns. 
`entries.js` is where helper functions are defined for collecting 
information stored in `content.js`. 

# References
Here are some references you can use to get started.

1. Enable google api - https://console.cloud.google.com/apis/enableflow?apiid=sheets.googleapis.com
2. Chrome extension basics - https://developer.chrome.com/docs/extensions/mv3/intro/
3. Google oauth2 - https://docs.robomotion.io/how-to-guides/authentication/google/oauth2/

# Packages
```
npm install dotenv-webpack --save-dev
npm install webpack webpack-cli --save-dev
npm install --save-dev webpack-dev-server
npm install --save-dev html-webpack-plugin
npm install --save-dev copy-webpack-plugin
npx webpack
```