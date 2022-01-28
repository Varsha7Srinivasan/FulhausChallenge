var request = require('request');

const jsonData = require('./slang.json');
console.log(jsonData);

Object.keys(jsonData).forEach(async function (key) {
    var options = {
        'method': 'POST',
        'url': 'http://localhost:3000/acronym',
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "acronym": key,
            "definition": jsonData[key]
        })
    };


    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
      });
});
