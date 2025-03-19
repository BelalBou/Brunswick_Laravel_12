const path = require("path");
const Email = require("email-templates");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const email = new Email({
  send: true,
  preview: false,
  message: {
    from: process.env.EMAIL_FROM
  },
  transport: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    tls: {
      rejectUnauthorized: false
    }
  },
  views: { root: path.join(__dirname, "emails") }
});

function sendDailyMail(to, cci, supplierName, orders) {
  let error = "";
  email
    .send({
      template: "dailyMail",
      message: {
        to,
        cci
      },
      locals: {
        supplierName,
        orders
      }
    })
    .then(() => {
      console.log("Sent daily email.");
    })
    .catch(err => {
      console.error("Error sending daily email: " + err);
      error = err;
    });
  return error;
}

function sendConfirmMail(when, to, cci, customerName, order, lang) {
  email
    .send({
      template: "confirmMail",
      message: {
        to,
        cci
      },
      locals: {
        when,
        customerName,
        order,
        lang
      }
    })
    .then(() => {
      console.log("Sent confirm email.");
    })
    .catch(err => {
      console.error("Error sending confirm email: " + err);
    });
}

function sendFinalizeRegistrationMail(to, customerName, passwordLink, lang) {
  email
    .send({
      template: "finalizeRegistrationMail",
      message: {
        to
      },
      locals: {
        customerName,
        passwordLink,
        lang
      }
    })
    .then(() => {
      console.log("Sent finalize registration email.");
    })
    .catch(err => {
      console.error("Error sending finalize registration email: " + err);
    });
}

function sendResetPasswordMail(to, customerName, passwordLink, lang) {
  email

    .send({
      template: "resetPasswordMail",
      message: {
        to
      },
      locals: {
        customerName,
        passwordLink,
        lang
      }
    })
    .then(() => {
      console.log("Sent reset password email.");
    })
    .catch(err => {
      console.error("Error sending reset password email: " + err);
    });
}

function sendVendorMail(to,cci, vendors) {
  email
    .send({
      template: "vendorMail",
      message: {
        to,
        cci
      },
      locals: {
        vendors
      }
    })
    .then(() => {
      console.log("Sent vendor email.");
    })
    .catch(err => {
      console.error("Error sending vendor email: " + err);
    });
}

function userSort(a, b) {
  const ret = a.User.last_name
    .toLowerCase()
    .localeCompare(b.User.last_name.toLowerCase());
  return ret === 0
    ? a.User.first_name
        .toLowerCase()
        .localeCompare(b.User.first_name.toLowerCase())
    : ret;
}

function menuSort(a, b) {
  return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
}

function categorySort(a, b) {
  return a.Menu.Category && b.Menu.Category
    ? a.Menu.Category.title
        .toLowerCase()
        .localeCompare(b.Menu.Category.title.toLowerCase())
    : false;
}

function getUrl() {
  const NODE_ENV = process.env.NODE_ENV || "dev";
  if (NODE_ENV === "dev") {
    return "http://localhost:3000";
  } else {
    const URL = process.env.URL;
    return `https://${URL}`;
  }
}

module.exports = {
  sendDailyMail,
  sendConfirmMail,
  sendFinalizeRegistrationMail,
  sendResetPasswordMail,
  sendVendorMail,
  userSort,
  menuSort,
  categorySort,
  getUrl
};
