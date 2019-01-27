
const { config } = require('./config');

module.exports = {
    log: log
};

/**
 * Log to console
 * @param {string} message 
 * @param {boolean} isDebug is this a debug message, ommited when config.debug is false
 */
function log (message, isDebug){
    if (typeof isDebug === 'undefined' || config.debug && isDebug) {
        const now = new Date();
        const strNow = `${pad(now.getDate())}/${pad(now.getMonth())}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        console.log(`${strNow} ${message}`);
        return true;
    }
    return false;
}

function pad(number){
    return number.toString().padStart(2,0);
}