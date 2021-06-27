if (console._LOG_BUFFER) {
	module.exports = console._LOG_BUFFER;
	return;
}

const ConsoleBuffer = require("./console-buffer");

const buffer = new ConsoleBuffer();
const patch = (...args) => buffer.patch(...args);
patch.flush = Ø => buffer.flush();
module.exports = patch;
console._LOG_BUFFER = patch;
patch();
if (typeof window === 'undefined') process.on('exit', Ø => buffer.flush());
