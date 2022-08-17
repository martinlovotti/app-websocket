const { options } = require("./options/sqliteDB");
const knex = require("knex")(options);

knex.schema
  .createTable("mensajes", (table) => {
    table.date("date");
    table.increments("id");
    table.string("mail");
    table.string("text")
  })
  .then(() => {
    console.log("Table mensajes created");
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    knex.destroy;
  });