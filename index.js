const Adapter = require("./src/adapter");
const config = require("./src/config/default.json");

const Servient = require("@node-wot/core").Servient;
const HttpClientFactory = require("@node-wot/binding-http").HttpClientFactory;
const Helpers = require("@node-wot/core").Helpers;

const servient = new Servient();
servient.addClientFactory(new HttpClientFactory(null)); //maybe {host:"localhost", port:"8080"} ?
const woTHelper = new Helpers(servient);
const url = `http://${config.node_wot.host}:${config.node_wot.port}/`;

Adapter.getArrayOfWoTDevices(config)
  .then((arrayOfWoTDevices) => {
    arrayOfWoTDevices.forEach((wotDevice) => Adapter.bindServient(woTHelper, url + wotDevice, servient));
  })
  .catch(console.err);
