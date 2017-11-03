var glob = require('glob');
var fs = require('fs');

var fileName;

if (process.argv.length !== 4) {
    console.log('usage:');
    console.log('node import-json.js regex path');
    console.log(' ');
    console.log('(where regex is the glob pattern to find files)');
    console.log('(where path is the destination output path)');
    console.log(' ');
    console.log('example:');
    console.log('node import-json.js \'./atlas/*.json\' \'./src/const/\'');
    console.log(' ');

    return;
}

var find = process.argv[2];
var output = process.argv[3];

glob(find, function(er, files) {

    files.forEach(function(f) {

        fs.readFile(f, 'utf8', function(err, data) {
            if (err) throw err;

            fileName = f.substring(f.lastIndexOf('/') + 1, f.length - 2);

            data = 'export default ' + data;

            console.log('successfully imported ' + output + fileName);

            //Do your processing, MD5, send a satellite to the moon, etc.
            fs.writeFile(output + fileName, data, function(err) {
                if (err) throw err;
            });
        });

    }, this);
});
