module.exports = (type, {service, servicePath}) => {
  const headerSelector = {
    get(headers) {
      headers['Accept'] = 'application/json';
      return headers;
    },
    post(headers) {
      headers['Content-Type'] = 'application/json';
      return headers;
    },
    patch(headers) {
      headers['Content-Type'] = 'application/json';
      return headers;
    },
  };
  const headers = {
    'Fiware-Service': service,
    'Fiware-ServicePath': servicePath,
  };
  return headerSelector[type](headers);
};
