import { fromFileWithPath } from 'textract';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

// Index learn dir
fs.readdir('/Users/marcus/Documents/myGitRepos/ballerina-dev-website/learn', (err, files) => {
    if (err) throw err;
    var documents = [];
    files.forEach(file => {
        // console.log(file);
        if (file.toString().includes(".md")) {
            // Index content for How Tos and Other MDs in learn page.
            fromFileWithPath('/Users/marcus/Documents/myGitRepos/ballerina-dev-website/learn/' + file, function (error, text) {
                if (error) throw error;
                documents = readJson('./contentIndex.json');
                var fileName = file.split(".md")[0];
                var searchObj = {
                    page: "/learn/" + fileName,
                    name: fileName.replace(/-/g, " "),
                    content: text
                }

                documents.push(searchObj);
                // console.log(documents);
                writeIntoJson('contentIndex.json', documents);
            });

            // Index titles for How Tos and Other MDs in learn page.
            documents = [];
            documents = readJson('./titleIndex.json');
            var fileName = file.split(".md")[0];
            var searchObj = {
                page: "/learn/" + fileName,
                name: fileName.replace(/-/g, " "),
                content: fileName.replace(/-/g, " ")
            }
            documents.push(searchObj);
            writeIntoJson('titleIndex.json', documents);
        }
    });
});

// API-Doc indexer
var apiDocPath = '/Users/marcus/Documents/myGitRepos/ballerina-dev-website/learn/api-docs/ballerina';
// var apiDocPathBallerinaX = '/Users/marcus/Documents/myGitRepos/ballerina-dev-website/learn/api-docs/ballerinax';
fileReader(apiDocPath);
// fileReader(apiDocPathBallerinaX);
function fileReader(docPath) {
    fs.readdir(docPath, (err, files) => {
        if (err) throw err;
        files.forEach(fileName => {
            let file = path.resolve(docPath, fileName);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory() && !file.toString().includes("_site")) {
                    fileReader(file);
                } else {
                    if (fileName.toString().includes(".html") && !fileName.toString().includes("module-list.html")) {
                        
                        var htmlString = readHtmlFile(file);
                        let $ = cheerio.load(htmlString);

                        // Index title in each api-doc.
                        let h1s = $('.content-wrapper').find('h1');
                        let title = $(h1s[0]).text();
                        let documents = [];
                        documents = readJson('./titleIndex.json');
                        let page = file.split('/learn/api-docs/')[1];
                        let splitedPageName = page.split('/');
                        let htmlFileName = splitedPageName[splitedPageName.length - 1];
                        let withoutBallerina = page.split('ballerina/')[1];
                        let name = htmlFileName.includes("index.html") ? splitedPageName[splitedPageName.length - 2] : withoutBallerina.replace(".html", "");
                        var searchObj = {
                            page: "/learn/api-docs/" + page,
                            name: name,
                            content: title.trim()
                        }
                        console.log(title);
                        documents.push(searchObj);
                        writeIntoJson('titleIndex.json', documents);

                        // Index sub titles in each api-doc
                        let h2s = $('.content-wrapper').find('h2');
                        let length = h2s.length;
                        for(let i = 0; i < length; i++) {
                            let subs = $(h2s[i]).text();
                            let documents = [];
                            documents = readJson('./titleIndex.json');
                            let page = file.split('/learn/api-docs/')[1];
                            let splitedPageName = page.split('/');
                            let htmlFileName = splitedPageName[splitedPageName.length - 1];
                            let withoutBallerina = page.split('ballerina/')[1];
                            let name = htmlFileName.includes("index.html") ? splitedPageName[splitedPageName.length - 2] : withoutBallerina.replace(".html", "");
                            var searchObj = {
                                page: "/learn/api-docs/" + page,
                                name: name,
                                content: subs.trim()
                            }
                            console.log(subs);
                            documents.push(searchObj);
                            writeIntoJson('titleIndex.json', documents);
                        }
                    }
                }
            });
        });
    });
}

function readJson(file) {
    try {
        const jsonString = fs.readFileSync(file);
        return JSON.parse(jsonString);
    } catch (err) {
        return [];
    }
}

function writeIntoJson(file, json) {
    fs.writeFileSync(file, JSON.stringify(json));
}

function readHtmlFile(file) {
    try {
        const htmlString = fs.readFileSync(file);
        return htmlString;
    } catch (err) {
        return;
    }
}