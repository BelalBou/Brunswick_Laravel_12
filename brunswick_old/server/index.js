const schedule = require("node-schedule");
const unirest = require("unirest");
const app = require("./app");

const PORT = process.env.PORT || 8000;
const HOST = `http://127.0.0.1:${PORT}/api`;
const AUTH = `Bearer ${process.env.TOKEN}`;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

schedule.scheduleJob("*/5 * * * *", () => {
  unirest
    .get(`${HOST}/daily_mails/check`)
    .headers({
      Authorization: AUTH
    })
    .end(response => {
      console.log(response.raw_body);
    });
});

module.exports = app;
