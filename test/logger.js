import rewiremock from 'rewiremock';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import { expect } from 'chai';

chai.should();
chai.use(sinonChai);

describe('logger', function() {
    it('should log', function() {
        const loggerRewired = rewiremock.proxy('../logger', () => ({
            'config': {
                config: {
                    debug: false
                }
            }
        }));
        
        expect(loggerRewired.log('Message')).to.equal(true);
    });

    it('should log when debug messsage and debug config true', function() {
        const loggerRewired = rewiremock.proxy('../logger', () => ({
            'config': {
                config: {
                    debug: true
                }
            }
        }));
        
        expect(loggerRewired.log('Debug message', true)).to.equal(true);
    });

    it('should not log when debug messsage and debug config false', function() {
        const loggerRewired = rewiremock.proxy('../logger', () => ({
            'config': {
                config: {
                    debug: false
                }
            }
        }));
        
        expect(loggerRewired.log('Hiddem debug message', true)).to.equal(false);
    });
});