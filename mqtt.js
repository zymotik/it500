const mqtt = require('mqtt');
const { log } = require('./logger');

let mqttClient;

module.exports = {
    connect: connect,
    subscribe: subscribe,
    publish: publish
}

function connect(server, username, password) {
    const mqttOptions = { host: server };
    
    if (username && password) {
        mqttOptions.username = username;
        mqttOptions.password = password;
    }
    
    mqttClient = mqtt.connect(mqttOptions);
}

/**
 * setup subscription to a topic
 * @param {string} topic 
 * @param {function} callbackFn 
 */
function subscribe(topic, callbackFn){
    if (typeof topic === 'undefined' || topic.length === 0) {
        throw new Error('Topic required');
    } else if (typeof callbackFn !== 'function') {
        throw new Error('Callback function required for new message received');
    }
    
    log(`Subscribing to '${topic}'`, true);
    mqttClient.subscribe(topic, function (err) {
        log(`Subscribed to '${topic}'`, true);
        if (err){
            throw new Error(err);
        }
    });

    mqttClient.on('message', callbackFn);
}

function publish(topic, message) {
    if (typeof topic === 'undefined' || topic.length === 0) {
        throw new Error('Topic required');
    } else if (typeof message === 'undefined') {
        throw new Error('Message required');
    } else if (typeof mqttClient === 'undefined' || !mqttClient.connected) {
        throw new Error('MQTT broker not connected, use connect() first');        
    }

    log(`Publish '${topic}' message '${message}'`, true);
    mqttClient.publish(topic, message);
}
