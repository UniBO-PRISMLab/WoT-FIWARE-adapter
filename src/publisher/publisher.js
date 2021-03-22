const axios = require("axios");

const moduleSelector = require("./moduleSelector");
const resultHandler = require("./resultHandler");
const gConfig = require("../config/default.json");
const headerFactory = require("../factory/headers");


const genericPublisher = (payload, config) => {
  const axiosConfig = {};
  axiosConfig.headers = config.headers;
  if (config.method === "get") request = axios[config.method](config.url, axiosConfig);
  else {
    console.info(config.url);
    console.info(JSON.stringify(payload, null, 4));
    request = axios[config.method](config.url, payload, axiosConfig);
  }
  return request.then((result = resultHandler.successHandler[config.crudOption])).catch((error) => {
    const errorHandling = resultHandler.errorHandler(error);
    return errorHandling === "create" ? publish(gConfig, "create", "orion", { ...config.metadata, ...payload }) : errorHandling;
  });
};


const publish = (config, crudOption, target, rawPayload) => {
  const targetModuleSelector = moduleSelector[target][crudOption];
  const [url, method, payload, metadata] = targetModuleSelector(config[target], rawPayload);
  const headers = headerFactory(method, config.fiware);
  return genericPublisher(payload, { headers, url, method, crudOption, metadata });
};

module.exports = { publish };
