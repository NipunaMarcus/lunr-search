import { fromFileWithPath } from 'textract';
import fs from 'fs';

fs.readdir('./test-files', (err, files) => {
    if (err) throw err;
    var documents = [];
    let mdFiles = [];
    files.forEach(file => {
        console.log(file);
        if (file.toString().includes(".md")) {
            fromFileWithPath('./' + file, function (error, text) {
                if (error) throw error;
                documents = readJson();
                var fileName = file.split(".md")[0];
                var searchObj = {
                    page: "https://ballerina.io/learn/" + fileName,
                    content: text
                }
    
                documents.push(searchObj);
                console.log(documents);
                writeIntoJson(documents);
            });
        }
    });
});

function readJson() {
    try {
        const jsonString = fs.readFileSync('./index.json');
        return JSON.parse(jsonString);
    } catch(err) {
        console.log(err);
        return [];
    } 
}

function writeIntoJson(json) {
    fs.writeFileSync('index.json', JSON.stringify(json));
}