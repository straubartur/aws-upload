/**
 * @typedef Message
 * @property { String } message
 * @property { * } [error]
 * @property { * } [post]
 */

/**
 * Returns the Message
 * @param { string } message - The message
 * @param { * } extras - The extras attributes to be included into message object
 * @return { Message }
 */
exports.buildMessage = function buildMessage (message, extras = {}) {
    return {
        message,
        ...extras
    }
}