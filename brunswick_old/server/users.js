const router = require("express").Router();
const bcrypt = require("bcrypt");
const emailValidator = require("email-validator");
const db = require("../db");
const User = require("../db/models/user");
const Supplier = require("../db/models/supplier");
const jwtUtils = require("./jwt_utils");
const sendFinalizeRegistrationMail = require("./utils")
  .sendFinalizeRegistrationMail;
const sendResetPasswordMail = require("./utils").sendResetPasswordMail;
const getUrl = require("./utils").getUrl;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const saltRounds = 10;

router.post("/login/", async (req, res, next) => {
  const { emailAddress, password } = req.body;
  if (!emailValidator.validate(emailAddress) || !password) {
    return res.status(400).json({ error: "wrong parameters - invalid email or no password provided" });
  }
  try {
    const resultUser = await User.findAll({
      include: [
        {
          model: Supplier,
          as: "Supplier"
        }
      ],
      where: {
        email_address: emailAddress,
        deleted: false,
      }
    });
    if (resultUser && resultUser.length > 0) {
      const resultBcrypt = await new Promise((resolve, reject) => {
        bcrypt.compare(password, resultUser[0].password, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      });
      if (resultBcrypt === true) {
        let tokenDuration = "10m";
        if (resultUser[0].type === 'administrator') tokenDuration = "12h";       
        const token = jwtUtils.generateTokenForUser(resultUser[0], tokenDuration);
        resultUser.push({ token });
        res.status(200).send(resultUser);
      } else {
        res.status(400).json({ error: "wrong credentials" });
      }
    } else {
      res.status(400).json({ error: "wrong credentials" });
    }
  } catch (e) {
    next(e);
  }
  return "done";
});

router.get("/loginAs/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const resultUser = await User.findAll({
      include: [
        {
          model: Supplier,
          as: "Supplier"
        }
      ],
      where: {
        id,
        deleted: false,
      }
    });
      if (resultUser && resultUser.length > 0) {
        let tokenDuration = "24h";
        const token = jwtUtils.generateTokenForUser(resultUser[0], tokenDuration);
        const loginLink = `${getUrl()}/login/${jwtUtils.generateTokenForUser(
          resultUser,
          tokenDuration
        )}`;
        res.status(200).send(loginLink);
      } else {
        res.status(400).json({ error: "wrong credentials" });
      }
  } catch (e) {
    next(e);
  }
  return "done";
});

router.post("/add/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const {
      firstName,
      lastName,
      type,
      language,
      emailAddress,
      supplierId
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !type ||
      !language ||
      !emailValidator.validate(emailAddress)
    ) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const resultUser = await User.findAll({
      where: { email_address: emailAddress, deleted: false }
    });
    if (resultUser && resultUser.length > 0) {
      return res.status(400).json({ error: "email address already exist" });
    }
    const buildObj = {
      first_name: firstName,
      last_name: lastName,
      type,
      language,
      email_address: emailAddress,
      password: "",
      supplier_id:
        type === "supplier" && parseInt(supplierId) > 0 ? supplierId : null,
      pending_registration: true,
      deleted: false
    };
    const user = User.build(buildObj);
    const result = await user.save();
    const customerName = `${
      result.first_name
    } ${result.last_name.toUpperCase()}`;

    let tokenDuration = "1h";
    if (user.type === 'administrator') tokenDuration = "12h";       

    const passwordLink = `${getUrl()}/login/${jwtUtils.generateTokenForUser(
      result,
      tokenDuration
    )}`;
    sendFinalizeRegistrationMail(
      result.email_address,
      customerName,
      passwordLink,
      result.language
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

router.put("/edit/:id", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { id } = req.params;
    const {
      firstName,
      lastName,
      type,
      language,
      emailAddress,
      supplierId,
      resetPassword
    } = req.body;
    if (
      parseInt(id) < 1 ||
      !firstName ||
      !lastName ||
      !type ||
      !language ||
      !emailValidator.validate(emailAddress)
    ) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    let buildObj = {};
    if (!resetPassword) {
      buildObj = {
        first_name: firstName,
        last_name: lastName,
        type,
        language,
        email_address: emailAddress,
        supplier_id:
          type === "supplier" && parseInt(supplierId) > 0 ? supplierId : null,
        deleted: false
      };
    } else {
      buildObj = {
        first_name: firstName,
        last_name: lastName,
        type,
        language,
        email_address: emailAddress,
        supplier_id:
          type === "supplier" && parseInt(supplierId) > 0 ? supplierId : null,
        pending_registration: true,
        deleted: false
      };
      const customerName = `${firstName} ${lastName.toUpperCase()}`;

      let tokenDuration = "1h";
      if (buildObj.type === 'administrator') tokenDuration = "12h";       

      const passwordLink = `${getUrl()}/login/${jwtUtils.generateTokenForUser(
        { id, type },
        tokenDuration
      )}`;
      sendFinalizeRegistrationMail(emailAddress, customerName, passwordLink);
    }
    const result = await User.update(buildObj, { where: { id } });
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

router.put("/edit_language/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    if (parseInt(userId) < 1) {
      return res.status(400).json({ error: "wrong token" });
    }
    const { language } = req.body;
    if (!language) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const result = await User.update({ language }, { where: { id: userId } });
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

router.put("/register/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    if (parseInt(userId) < 1) {
      return res.status(400).json({ error: "wrong token" });
    }
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword || password !== confirmPassword) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const resultUser = await User.findAll({
      where: {
        id: userId,
        pending_registration: true,
        deleted: false
      }
    });
    if (resultUser && resultUser.length > 0) {
      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) {
            reject(err);
          }
          resolve(hash);
        });
      });
      const resultUpdate = await User.update(
        {
          password: hashedPassword,
          pending_registration: false
        },
        { where: { id: userId } }
      );
      res.status(200).send(resultUpdate);
    } else {
      return res.status(400).json({ error: "wrong user" });
    }
  } catch (e) {
    next(e);
  }
  return "done";
});

router.put("/resetPassword/", async (req, res, next) => {
  try {
    const { emailAddress } = req.body;
    if (!emailValidator.validate(emailAddress)) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const resultUser = await User.findAll({
      where: {
        email_address: emailAddress,
        deleted: false
      }
    });
    if (resultUser && resultUser.length > 0) {
      const resultUpdate = await User.update(
        {
          pending_registration: true
        },
        { where: { email_address: emailAddress } }
      );
      const customerName = `${
        resultUser[0].first_name
      } ${resultUser[0].last_name.toUpperCase()}`;

      let tokenDuration = "1h";
      if (resultUser[0].type === 'administrator') tokenDuration = "12h";       

      const passwordLink = `${getUrl()}/login/${jwtUtils.generateTokenForUser(
        resultUser[0],
        tokenDuration
      )}`;
      sendResetPasswordMail(
        emailAddress,
        customerName,
        passwordLink,
        resultUser[0].language
      );
      res.status(200).send(resultUpdate);
    } else {
      return res.status(400).json({ error: "wrong user" });
    }
  } catch (e) {
    next(e);
  }
  return "done";
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const { id } = req.params;
    if (parseInt(id) < 1) {
      return res.status(400).json({ error: "wrong parameters" });
    }
    const result = await User.update(
      {
        deleted: true
      },
      { where: { id } }
    );
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

router.get("/list/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const result = await User.findAll({
      include: [
        {
          model: Supplier,
          as: "Supplier",
          attributes: { exclude: ["created_at", "updated_at", "deleted"] }
        }
      ],
      where: { deleted: false },
      order: [["last_name", "ASC"], ["first_name", "ASC"]],
      attributes: {
        exclude: ["created_at", "updated_at", "deleted", "password"]
      }
    });
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

router.get("/list_customers/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userType = jwtUtils.getUserType(headerAuth);
/*
    if (userType !== "administrator") {
      return res.status(400).json({ error: "wrong token" });
    }
*/
    const result = await User.findAll({
      where: { type: ["customer", "administrator"], deleted: false },
      order: [["last_name", "ASC"], ["first_name", "ASC"]],
      attributes: {
        exclude: ["created_at", "updated_at", "deleted", "password"]
      }
    });
    res.status(200).send(result);
  } catch (e) {
    next(e);
  }
  return "done";
});

router.get("/check_validity/", async (req, res, next) => {
  try {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    let validity = "not valid";

    if (parseInt(userId) > 0) {
      const result = await User.findAll({
        where: { id: userId, deleted: false }
      });

      if (result && result.length > 0) {
        validity = "valid";
      }    
    }
    res.status(200).send(validity);
  } catch (e) {
    next(e);
  }
  return "done";
});

router.get("/send_all_finalize/:start/:end", async (req, res, next) => {
  try {
    const { start } = req.params;
    const { end } = req.params;

    const users = await User.findAll({
      where: { 
        pending_registration: true, 
        deleted: false, 
        type: 'customer' ,
        id: {
          [Op.gte]: start,
          [Op.lte]: end,
        },
      }
    });

    var emails_sent = [];

    users.forEach(function(user) {
      let customerName = `${
        user.first_name
      } ${user.last_name.toUpperCase()}`;

      let tokenDuration = '30d';
    
      let passwordLink = `${getUrl()}/login/${jwtUtils.generateTokenForUser(
        user,
        tokenDuration
      )}`;

      sendFinalizeRegistrationMail(
        user.email_address,
        customerName,
        passwordLink,
        user.language
      );

      emails_sent.push(user);
      
    });
    res.status(200).send(emails_sent);


  } catch (e) {
    next(e);
  }
  return "done";
});

module.exports = router;
