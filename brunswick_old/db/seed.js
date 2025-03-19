const db = require("../db");

const seedSuppliers = () =>
  db.Promise.map(
    [
      {
        name: "Bar à Thym",
        email_address: "qle@esi-informatique.com",
        for_vendor_only: false,
        deleted: false
      },
      {
        name: "Les toqués gourmands",
        email_address: "qle@esi-informatique.com",
        for_vendor_only: false,
        deleted: false
      }
    ],
    supplier => db.model("suppliers").create(supplier)
  );

const seedUsers = () =>
  db.Promise.map(
    [
      {
        first_name: "Quentin",
        last_name: "LECLER",
        sex: "M",
        language: "fr",
        email_address: "a@test.test",
        password:
          "$2a$10$k4jPDXDRsg/ps5.ijl37.OTm.n0Yy6/FTxPGN4SDK42h/2uEQ/YDq",
        type: "administrator",
        pending_registration: false,
        deleted: false
      },
      {
        first_name: "test",
        last_name: "test",
        sex: "M",
        language: "fr",
        email_address: "s@test.test",
        password:
          "$2a$10$k4jPDXDRsg/ps5.ijl37.OTm.n0Yy6/FTxPGN4SDK42h/2uEQ/YDq",
        type: "supplier",
        supplier_id: "1",
        pending_registration: false,
        deleted: false
      },
      {
        first_name: "DUSS",
        last_name: "Michel",
        sex: "M",
        language: "fr",
        email_address: "c@test.test",
        password:
          "$2a$10$k4jPDXDRsg/ps5.ijl37.OTm.n0Yy6/FTxPGN4SDK42h/2uEQ/YDq",
        type: "customer",
        pending_registration: false,
        deleted: false
      },
      {
        first_name: "VENDOR",
        last_name: "Vendor",
        sex: "M",
        language: "fr",
        email_address: "v@test.test",
        password:
          "$2a$10$k4jPDXDRsg/ps5.ijl37.OTm.n0Yy6/FTxPGN4SDK42h/2uEQ/YDq",
        type: "vendor",
        pending_registration: false,
        deleted: false
      }
    ],
    user => db.model("users").create(user)
  );

const seedCategories = () =>
  db.Promise.map(
    [
      {
        title: "sandwiches traditionnels",
        title_en: "sandwiches traditionnels",
        order: 10,
        supplier_id: 1,
        deleted: false
      },
      {
        title: "dagoberts",
        title_en: "dagoberts",
        order: 20,
        supplier_id: 1,
        deleted: false
      },
      {
        title: "salades servies avec 1/3 de baguette et une vinaigrette",
        title_en: "salades servies avec 1/3 de baguette et une vinaigrette",
        order: 30,
        supplier_id: 1,
        deleted: false
      }
    ],
    category => db.model("categories").create(category)
  );

const seedMenus = () =>
  db.Promise.map(
    [
      {
        title: "jambon d'ardennes",
        title_en: "jambon d'ardennes",
        description:
          "Jambon fumé de chez Nailis, mayonnaise ou beurre + crudités",
        size: "1/2",
        pricing: 4.5,
        supplier_id: "1",
        category_id: "2",
        deleted: false
      },
      {
        title: "parigo",
        title_en: "parigo",
        description: "Jambon braisé, mayonnaise ou beurre+crudités",
        size: "1/2",
        pricing: 3.5,
        supplier_id: "1",
        category_id: "2",
        deleted: false
      },
      {
        title: "dagobert maison",
        title_en: "dagobert maison",
        description: "Jambon, fromage, mayonnaise, crudités, oeuf dur",
        size: "1/2",
        pricing: 4.5,
        supplier_id: "1",
        category_id: "1",
        deleted: false
      },
      {
        title: "poulet des champs",
        title_en: "poulet des champs",
        description:
          "Laitue, dés de poulet, œuf dur, tomate, concombre, courgette confite",
        size: "grand",
        pricing: 7.5,
        supplier_id: "1",
        category_id: "3",
        deleted: false
      },
      {
        title: "TEST MENU",
        title_en: "TEST MENU",
        description: "TEST MENU",
        size: "grand",
        pricing: 3.5,
        supplier_id: "2",
        category_id: "3",
        deleted: false
      }
    ],
    menu => db.model("menus").create(menu)
  );

const seedSettings = () =>
  db.Promise.map(
    [
      {
        time_limit: "11:00:00",
        start_period: "1",
        end_period: "5",
        email_order_cc: "qle@esi-informatique.com",
        email_supplier_cc: "qle@esi-informatique.com",
        email_vendor_cc: "qle@esi-informatique.com"
      }
    ],
    setting => db.model("settings").create(setting)
  );

const seedDictionnaries = () =>
  db.Promise.map(
    [
      {
        tag: "_ADRESSE_EMAIL",
        translation_fr: "Adresse e-mail",
        translation_en: "E-mail address",
        deleted: false
      },
      {
        tag: "_MOT_DE_PASSE",
        translation_fr: "Mot de passe",
        translation_en: "Password",
        deleted: false
      },
      {
        tag: "_SE_SOUVENIR_DE_MOI",
        translation_fr: "Se souvenir de moi",
        translation_en: "Remember me",
        deleted: false
      },
      {
        tag: "_SE_CONNECTER",
        translation_fr: "Se connecter",
        translation_en: "Login",
        deleted: false
      },
      {
        tag: "_SE_DECONNECTER",
        translation_fr: "Se déconnecter",
        translation_en: "Logout",
        deleted: false
      },
      {
        tag: "_MON_COMPTE",
        translation_fr: "Mon compte",
        translation_en: "My account",
        deleted: false
      }
    ],
    dictionnary => db.model("dictionnaries").create(dictionnary)
  );

const seedDailyMails = () =>
  db.Promise.map(
    [
      {
        date: "2019-01-01",
        sent: true,
        error: "",
        deleted: false
      }
    ],
    dailyMail => db.model("daily_mails").create(dailyMail)
  );

db.didSync
  .then(() => db.sync({ force: true }))
  .then(seedSuppliers)
  .then(suppliers => console.log(`Seeded ${suppliers.length} suppliers OK`))
  .then(seedUsers)
  .then(users => console.log(`Seeded ${users.length} users OK`))
  .then(seedSettings)
  .then(settings => console.log(`Seeded ${settings.length} settings OK`))
  .then(seedCategories)
  .then(categories => console.log(`Seeded ${categories.length} categories OK`))
  .then(seedMenus)
  .then(menus => console.log(`Seeded ${menus.length} menus OK`))
  .then(seedDictionnaries)
  .then(dictionnaries =>
    console.log(`Seeded ${dictionnaries.length} dictionnaries OK`)
  )
  .then(seedDailyMails)
  .then(dailyMails => console.log(`Seeded ${dailyMails.length} dailyMails OK`))
  .catch(error => console.error(error))
  .finally(() => db.close());
