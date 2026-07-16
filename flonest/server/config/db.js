const dns = require('dns');
const mongoose = require('mongoose');

// Some local DNS resolvers block Atlas SRV lookups. Override only the
// resolver used by Node, while allowing a custom list through DNS_SERVERS.
const dnsServers = (process.env.DNS_SERVERS || '1.1.1.1,8.8.8.8')
  .split(',')
  .map((server) => server.trim())
  .filter(Boolean);

if (dnsServers.length) {
  dns.setServers(dnsServers);
}

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flonest';
  
  // ANSI terminal color codes
  const green = '\x1b[32m';
  const red = '\x1b[31m';
  const yellow = '\x1b[33m';
  const reset = '\x1b[0m';

  // Configure mongoose listeners for automatic reconnect states
  mongoose.connection.on('connected', () => {
    console.log(`${green}MongoDB Connection Status: Connected successfully.${reset}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`${red}MongoDB Connection Error: ${err.message}${reset}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log(`${yellow}MongoDB Connection Status: Disconnected. Attempting automatic reconnection...${reset}`);
  });

  try {
    console.log(`${yellow}Attempting to connect to MongoDB...${reset}`);
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error(`${red}Initial Database Boot Connection Failure: ${error.message}${reset}`);
    process.exit(1);
  }
};

module.exports = connectDB;
