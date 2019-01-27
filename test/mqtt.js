import rewiremock from 'rewiremock';
import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';

chai.should();
chai.use(sinonChai);

describe('mqtt connect', function() {
    it('should attempt to connect to mqtt broker with username and password', function() {
        const settings = { serverAddress: 'server.address.com', username: 'testuser', password: 'testpassword' };
        const mqttMock = { connect: sinon.spy() };
        const mqtt = getMocks(mqttMock);

        mqtt.connect(settings.serverAddress, settings.username, settings.password);

        mqttMock.connect.should.have.been.calledWith({host: settings.serverAddress, username: settings.username, password: settings.password});
    });

    it('should attempt to connect to mqtt broker without credentials', function() {
        const settings = { serverAddress: 'server.address.com' };
        const mqttMock = { connect: sinon.spy() };
        const mqtt = getMocks(mqttMock);

        mqtt.connect(settings.serverAddress, settings.username, settings.password);

        mqttMock.connect.should.have.been.calledWith({host: settings.serverAddress});
    });
});

describe('mqtt publish', function() {
    it('should publish message in topic when connected', function() {
        const message = JSON.stringify({ GPIO: 5, State: 0 });
        const topic = 'tele/test/topic';
        const publishSpy = sinon.spy();
        const mqttMock = { 
            connect: () => {
                return {
                    connected: true,
                    publish: publishSpy
                };
            }
        };
        const mqtt = getMocks(mqttMock);

        mqtt.connect();
        mqtt.publish(topic, message);

        publishSpy.should.have.been.calledWith(topic, message);
    });

    it('should error when not connected', function() {
        const mqtt = require('../mqtt');

        chai.expect(() => mqtt.publish('topic','')).to.throw('MQTT broker not connected, use connect() first');
    });

    it('should error when no topic specified', function() {
        const mqtt = require('../mqtt');

        chai.expect(() => mqtt.publish()).to.throw('Topic required');
    });// Message required

    it('should error when no message specified', function() {
        const mqtt = require('../mqtt');

        chai.expect(() => mqtt.publish('topic')).to.throw('Message required');
    });
});

describe('mqtt subscribe', function() {
    it('should subscribe to topic when callback function supplied', function() {
        const topic = 'tele/test/topic';
        const subscribeSpy = sinon.spy();
        const onSpy = sinon.spy();
        const callbackFn = console.log;
        const mqttMock = { 
            connect: () => {
                return {
                    connected: true,
                    subscribe: subscribeSpy,
                    on: onSpy
                };
            }
        };
        const mqtt = getMocks(mqttMock);

        mqtt.connect();
        mqtt.subscribe(topic, callbackFn);

        subscribeSpy.should.have.been.calledOnce;
        onSpy.should.have.been.calledWith('message', callbackFn);
    });

    it('should error when no topic specified', function() {
        const mqtt = require('../mqtt');

        chai.expect(() => mqtt.subscribe('')).to.throw('Topic required');
    });

    it('should error when no function supplied', function() {
        const mqtt = require('../mqtt');

        chai.expect(() => mqtt.subscribe('some/topic')).to.throw('Callback function required for new message received');
    });

    it('should error when problem subscribing to topic', function() {
        const topic = 'tele/test/topic';
        const callbackFn = () => { return null; };
        const errorMessage = 'An error occured';
        const mqttMock = {
            connect: () => {
                return {
                    connected: true,
                    subscribe: sinon.fake((_, privateCallbackFn) => {
                        privateCallbackFn(errorMessage);
                    })
                };
            }
        };
        const mqtt = getMocks(mqttMock);

        mqtt.connect();
        chai.expect(() => mqtt.subscribe(topic, callbackFn)).to.throw(errorMessage);
    });
});

function getMocks(mqttMock) {
    return rewiremock.proxy('../mqtt', () => ({
        'mqtt': mqttMock,
        'logger': { log: () => {} }    
    }));
}
