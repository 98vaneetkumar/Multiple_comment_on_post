const Sequelize = require("sequelize");
const sequelize = new Sequelize(
 'databasename',
 'root',
 'password',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);
const connectDB=sequelize.authenticate().then(async() => {
    sequelize.sync({alert:false}).then(() => {
        console.log('Connection has been established successfully.');
     }).catch((error) => {
        console.error('Unable to create table : ', error);
     });
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });

 module.exports={
    sequelize:sequelize,
    connectDB:connectDB
 }