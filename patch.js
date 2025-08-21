const { SourceMapConsumer } = require("source-map");
const path = require("path");

SourceMapConsumer.initialize({
  "lib/mappings.wasm": path.join(__dirname, "node_modules/source-map/lib/mappings.wasm"),
});