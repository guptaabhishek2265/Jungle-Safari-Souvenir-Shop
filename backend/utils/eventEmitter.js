const EventEmitter = require("events");

// Create a new event emitter instance
const eventEmitter = new EventEmitter();

// Increase max listeners to avoid memory leak warnings
eventEmitter.setMaxListeners(20);

module.exports = eventEmitter;
