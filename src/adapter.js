const { default: Servient } = require("@node-wot/core");
const config = require("./config/default.json");
const publisher = require("./publisher/publisher");

const bindServient = async (woTHelper, url, servient) => {
  const thingDescription = await woTHelper.fetch(url);
  const wot = await servient.start();
  const thing = await wot.consume(thingDescription);
  console.info("Thing Description:", thingDescription);
  thing.subscribeEvent("ngsiOutput", (data) => {
    publisher.publish(config, "update", "orion", data).then(console.log).catch(console.error);
  });
};

const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const getArrayOfWoTDevices = async (config) => {
  const arrayOfRawWoTUrl = await publisher.publish(config, "read", "node_wot");
  const arrayOfDevicesWithDuplicates = await arrayOfRawWoTUrl.map((rawWoTUrl) => rawWoTUrl.split("/")[3]);
  const arrayOfDevices = await arrayOfDevicesWithDuplicates.filter(unique);
  return arrayOfDevices;
};

module.exports = {
  bindServient,
  getArrayOfWoTDevices,
};
