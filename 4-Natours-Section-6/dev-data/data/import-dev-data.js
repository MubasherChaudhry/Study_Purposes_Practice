const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection Successful'));

//Read the Json File

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tour-simple.json`, 'utf-8')
);
//import the data into DC

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Successfully Loaded');
  } catch (err) {
    console.log(err);
  }
};

//To delete all documents from DB collection

const deleteData = async () => {
  try {
    await Tour.deleteMany(tours);
    console.log('Data Successfully Deleted');
  } catch (err) {
    console.log(err);
  }
};
