/* eslint-disable max-len */
const util = require("util");
const fs = require("fs");
const gConfig = require("../config/default.json");


let count = 0;

const counter = () => {
  fs.appendFile(gConfig.filepath, ++count + "\n", (err) => {
    if (err) throw err;
  });
  console.info(`adapter count: ${count}`);
};

const statusHandler = (response) => {
  counter();
  return `************************ SUCCESS ************************
${response.data}
STATUS: ${response.status} - ${response.statusText}
URL: ${response.config.url}
DATA: ${response.config.data}`;
};

const successHandler = {
  create: statusHandler,
  update: statusHandler,
  read: (response) => {
    counter();
    return response.data;
  },
};

const errorHandler = (error) => {
  if (error.response) {
    if (error.response.data.description === "The requested entity has not been found. Check type and id") {
      console.info("Entity does not exist yet. Going to create it...");
      return "create";
    }
    //this is ultraspecific, however, we cannot stop the execution of a program only because we did not found record in one query
    if (error.response.data.description === "No records were found for such query.") return;
    return Promise.reject(`Request made and server responded
      \ndata: ${util.inspect(error.response.data)}
      \nstatus: ${util.inspect(error.response.status)}
      \nheaders:${util.inspect(error.response.headers)}
      \nURL: ${util.inspect(error.response.config.url)}`);
  } else if (error.request) {
    return Promise.reject(
      new Error(
        `The request was made but no response was received `
        // \n${util.inspect(error.request)}
      )
    );
  } else {
    return Promise.reject(
      new Error(`Something happened in setting up the request that triggered an Error\n${util.inspect(error.message)}`)
    );
  }
};

module.exports = {
  successHandler,
  errorHandler,
};
