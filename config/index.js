var nconf = require('nconf');
var path = require('path');

nconf.env();

var configPath;
if(nconf.get('NODE_ENV') === 'prod'){
    configPath = path.join(__dirname, 'config-prod.json')
}
else if(nconf.get('NODE_ENV') === 'test') {
    configPath = path.join(__dirname, 'config-test.json')
}
else {
    configPath = path.join(__dirname, 'config-dev.json')
}

nconf.file(configPath);

module.exports = nconf;