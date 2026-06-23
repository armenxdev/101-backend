import sequelize from "../config/db.sequelize.js";
import initUser from "./User.js";

const db = {};

db.User = initUser(sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

export { sequelize, db };
export default db;