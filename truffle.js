module.exports = {
    networks: {
    "pubtest": {
      network_id: 1,
      host: "localhost",
      port: 8546   // Different than the default below
    },
    "development": {
      host: "localhost",
      port: 8545,
      network_id: "default" // Match any network id
    }
  }
};
