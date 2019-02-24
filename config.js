const fs = require('fs');
const colors = require('colors');
const path = require('path');

let config = {
    debug: false,
    loadError: false,
    pollIntervalSeconds: 60
};

function init() {
    try {
        const fileContents = fs.readFileSync(path.join(__dirname, './settings.json'));
        const loadedConfig = JSON.parse(fileContents);
        config = Object.assign(config, loadedConfig);
    } catch(e) {
        config.debug = true;
        config.loadError = true;
        if (e.code === 'ENOENT') {
            console.log(colors.red(colors.bold('No .\\settings.json file found.') + ' Create one from the .\\settings.sample.json file.'));
        }
    }
    if (!config.loadError) {
        if (config.debug) {
            logConfiguration();
        }
        validateConfig();
    }
}

function validateConfig() {    
    const requiredProperties = ['it500Username',
                                'it500Password',
                                'it500DeviceId',
                                'mqttServer',
                                'publishTopic',
                                'timeToLiveMinutes'];
 
    requiredProperties.map((prop) => {
        if (isNullOrEmpty(config[prop])) {
            console.log(colors.bold(`Configuration '${prop}' is required and has not been set.`));
            config.loadError = true;
        }
    });
 }

function isNullOrEmpty(value) {
    if (typeof value === 'undefined' || value.length === 0) {
        return true;
    }
    return false;
}

function logConfiguration(){
    const runningConfig = Object.assign({}, config);
    if (runningConfig.it500Password) {
        runningConfig.it500Password = '******';
    }
    if (runningConfig.mqttPassword) {
        runningConfig.mqttPassword = '******';
    }
    console.log(`Configuration loaded:`);
    console.log(JSON.stringify(runningConfig, null, 2));
}

init();

module.exports = {
    config: config
};