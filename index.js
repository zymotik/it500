const request = require('request-promise-native').defaults({ simple: false, jar: true });
const cheerio = require('cheerio');
const cache = require('node-persist');
const config = require('./config').config;
const mqtt = require('./mqtt');
const log = require('./logger').log;

const keyToken = 'it500token';

async function login() {
    await request.post('https://salus-it500.com/public/login.php', {
        form: {
            IDemail: config.it500Username,
            password: config.it500Password,
            login: 'Login',
        }
    });
}

async function getToken() {
    const responseDeviceList = await request.get('https://salus-it500.com/public/devices.php');
    const html = cheerio.load(responseDeviceList);
    const token = html('input[name="token"]').attr('value');
    return token;
}
    
async function getTemperatures(token) {
    const responseDevice = await request.get(`https://salus-it500.com/public/ajax_device_values.php?devId=${config.it500DeviceId}&token=${token}`);
    const deviceDetails = JSON.parse(responseDevice);
    return { zone1Temperature: deviceDetails.CH1currentRoomTemp, zone2Temperature: deviceDetails.CH2currentRoomTemp };
}

async function getTokenAndCacheIt() {
    await login();
    const token = await getToken();
    await cache.setItem(keyToken, token);
    return token;
}

async function initCache() {
    await cache.init({ ttl: config.timeToLiveMinutes * 60 * 1000 });
}

async function main() {
    await initCache();

    let token = await cache.getItem(keyToken);

    if (typeof token === 'undefined') {
        token = await getTokenAndCacheIt();
    }

    const temperatures = await getTemperatures(token);
    
    mqtt.connect(config.mqttServer, config.mqttUsername, config.mqttPassword);
    setTimeout(() => {
        mqtt.publish(config.publishTopic, JSON.stringify({ 
            Zone1Temperature: parseFloat(temperatures.zone1Temperature), 
            Zone2Temperature: parseFloat(temperatures.zone2Temperature)
        }));
        setTimeout(() => process.exit(), 500);
    }, 500); // Have to wait for connection..., no call back on mqtt.connect :sadface:
}

main();
