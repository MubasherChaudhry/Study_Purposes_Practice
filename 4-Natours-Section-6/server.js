const dotenv=require('dotenv')
const app =require('./app')

dotenv.config({path:'./config.env'})

console.log(process.env);
// console.log(app.get('env')); use this to define development environment 

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App is running on port:${PORT}`);
});

