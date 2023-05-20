const express = require('express');
const morgan = require('morgan');
const tourRouter=require('./routes/tourRoutes')
const userRouter=require('./routes/userRoutes')

const app = express();

//MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());


app.use((req, res, next) => {
  console.log('Hello its your own middleWare');
  next();
});

/* app.use((req, res, next) => {
  req.requesTime = new Date().toISOString();
  next();
}); */

/* app.get('/',(req,res)=>{
  res
  .status(200)
  .json({message:'hello from ther serverside', newStep:'into Natours'})
})
app.post('/',(req,res)=>{
  res
  .status(200)
  .json({message:'you can reach to this post request endpoint',newRequest:'this is First post request endpoint'})
}) */

//2:- Rourte HANDLERS
// app.get('/api/v1/tours',getAlltours );
// app.post('/api/v1/tours',createTour);
// app.get('/api/v1/tours/:id',getTour );
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id',deleteTour)
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

//4:- START SERVER

module.exports= app
