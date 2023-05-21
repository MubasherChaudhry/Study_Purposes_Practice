const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path:'./config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:false,
  useUnifiedTopology: true

})
.then(()=>console.log('DB connection Successful'))

const tourSchema= new mongoose.Schema({
  name:{
    type:String,
    required:[true,'Atour Must Have a name'],
    unique:true},
  
    rating:{
      type:Number,
      default:4.5
    },

  price:{
    type:Number,
  required:[true, 'A tour must have a price']} 

})
const Tour=mongoose.model('Tour',tourSchema)

const testTour = new Tour({
name:'the forest Biker',
rating:4.7,
price:497
})

testTour
.save()
.then(doc=>{
console.log(doc);
})
.catch(err=>{
console.log('ERROR',err);
})
// console.log(app.get('env')); use this to define development environment

const port = process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`App is running on port:${port}`);
});
