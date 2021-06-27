const util = require('util');
const nsTable = require("nodestringtable");
const byteLength = require('byte-length').byteLength;

let global_process;
try {
	global_process = process;
} catch (referenceError) {}

function BufferDescriptor(func, str = "") {
	this.func = func;
	this.str = str;
}
BufferDescriptor.prototype.flush = function () {
	this.func(this.str);
};
function ConsoleBuffer(console, limit = 8192, prefix = null) {
	if (!new.target) {
		return new ConsoleBuffer(console, limit, prefix);
	}

	this.buffer = [];
	this.console = console;
	this.limit = limit;
	this.prefix = prefix;

	const cWarn = console.warn;
	const cLog = console.log;
	const cError = console.error;
	const cInfo = console.info;
	const cGroup = console.group;
	const cGroupEnd = console.groupEnd;

	this.descriptors = {
		log: str => new BufferDescriptor(cLog, str),
		warn: str => new BufferDescriptor(cWarn, str),
		error: str => new BufferDescriptor(cError, str),
		info: str => new BufferDescriptor(cInfo, str),
		table: str => new BufferDescriptor(cLog, str),
		group: str => new BufferDescriptor(cGroup, str),
		groupEnd: Ø => new BufferDescriptor(cGroupEnd)
	};

	this.patch(limit, prefix);

	global_process && global_process.on('exit', () => this.flush());
}
ConsoleBuffer.prototype.log = function (name, args) {
	if (name === "table") var str = nsTable.apply(null, args);
	else var str = util.format.apply(null, args);
	if (this.prefix !== null) {
		if (name === "table") {
			if (typeof this.prefix === "string") str = this.prefix + "\n" + str;
			else if (typeof this.prefix === "function") str = this.prefix() + "\n" + str;
		} else {
			if (typeof this.prefix === "string") str = this.prefix + str;
			else if (typeof this.prefix === "function") str = this.prefix() + str;
		}
	}
	// calculate the new length
	this.size += byteLength(str);
	// push the data, and flush if > limit
	this.buffer.push(this.descriptors[name](str));
	if (this.size > this.limit) this.flush();
};
ConsoleBuffer.prototype.clear = function () {
	this.buffer = [];
	this.size = 0;
};
ConsoleBuffer.prototype.flush = function () {
	for (const descriptor of this.buffer) descriptor.flush();
	this.clear();
};
ConsoleBuffer.prototype.patchConsole = function (name) {
	this.console[name] = (...args) => this.log(name, args);
};
ConsoleBuffer.prototype.patch = function (limit = null, prefix = null) {
	this.limit = limit !== null ? limit : 8192;
	this.prefix = prefix;
	this.patchConsole("log");
	this.patchConsole("warn");
	this.patchConsole("error");
	this.patchConsole("info");
	this.patchConsole("table");
	this.patchConsole("group");
	this.patchConsole("groupEnd");
};

module.exports = ConsoleBuffer;
