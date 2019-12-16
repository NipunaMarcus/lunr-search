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
                content: fileName.replace(/-/g, " ")
            }
            documents.push(searchObj);
            writeIntoJson('titleIndex.json', documents);
        }
    });
});

// API-Doc indexer
var apiDocPath = '/Users/marcus/Documents/myGitRepos/ballerina-dev-website/learn/api-docs/ballerina';
var records = [];
fileReader(apiDocPath);
function fileReader(docPath) {
    fs.readdir(docPath, (err, files) => {
        if (err) throw err;
        files.forEach(fileName => {
            // console.log(file.toString());
            let file = path.resolve(docPath, fileName);
            fs.stat(file, function (err, stat) {
                // console.log(file);
                if (stat && stat.isDirectory()) {
                    fileReader(file);
                } else {
                    // console.log("regular file");
                    if (fileName.toString().includes("index.html")) {
                        // console.log(file.toString());
                        var htmlString = readHtmlFile(file);
                        let $ = cheerio.load(htmlString);
                        let h1s = $('.content-wrapper').find('h1');

                        let title = $(h1s[0]).text();
                        let documents = [];
                        documents = readJson('./titleIndex.json');
                        let page = file.split('/learn/')[1];
                        var searchObj = {
                            page: "/learn/" + page,
                            content: title.trim()
                        }
                        console.log(title);
                        documents.push(searchObj);
                        writeIntoJson('titleIndex.json', documents);

                        // let h2s = $('.content-wrapper').find('h2');

                        // let subs = $(h2s[1]).text();
                        // console.log(subs);
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
        console.log(err);
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
        console.log(err);
        return;
    }
}