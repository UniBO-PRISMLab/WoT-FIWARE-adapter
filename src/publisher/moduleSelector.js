module.exports = {
  orion: {
    update(config, entity) {
      const { id, type, ...idLessEntity } = entity;
      const url = `http://${config.host}:${config.port}/v2/entities/${id}/attrs`;
      return [url, "patch", idLessEntity, { id, type }];
    },
    create(config, entity) {
      const url = `http://${config.host}:${config.port}/v2/entities`;
      return [url, "post", entity];
    },
  },
  node_wot: {
    read(config) {
      const url = `http://${config.host}:${config.port}`;
      return [url, "get"];
    },
  },
};
