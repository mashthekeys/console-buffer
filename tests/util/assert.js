
const globalConsole = console;

module.exports = function assert(test, label = undefined) {
  if (typeof test === "function") {
    try {
      test = test();
    } catch (error) {
      test = false;
    }
  }

  if (!test) {
    globalConsole.warn("ASSERTION FAILED %s", label || String(test));
    globalConsole.trace();
    process.exit(255);
  }
};