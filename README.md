# lunr-search

### Run sample search for already indexed pages

1. open `index.html` in a browser
2. search any keyword or phrase available in the following pages
  - [how to deploy and run ballerina programs](https://ballerina.io/learn/how-to-deploy-and-run-ballerina-programs)
  - [how to document ballerina code](https://ballerina.io/learn/how-to-document-ballerina-code)
  - [how to extend ballerina](https://ballerina.io/learn/how-to-extend-ballerina)
  - [how to generate code for protocol buffers](https://ballerina.io/learn/how-to-generate-code-for-protocol-buffers)
  
### Build and Run indexer

1. go to `indexer` dir
2. run `npm install`
3. run `node indexer.js`
4. open the created `index.json` file and copy the content into `documents` array in `indexed.js` available in the `lunr-search` root dir.
