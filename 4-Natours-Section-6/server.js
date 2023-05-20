const dotenv= require('dotenv')
dotenv.config({path:'./config.env'})
const app =require('./app')



// console.log(app.get('env')); use this to define development environment 

const port =process.env.PORT || 5050;
app.listen(port, () => {
  console.log(`App is running on port:${port}`);
});

