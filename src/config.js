/* eslint-disable quotes */
module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL || "postgresql://nikadarab@localhost/noteful",
  API_TOKEN: process.env.API_TOKEN || "0e0a6da6-d88b-49d3-ab9a-b28f75efaf2b",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    "postgresql://nikadarab@localhost/noteful-test",
};
