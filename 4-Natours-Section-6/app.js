const fs = require('fs');
const express = require('express');
const morgan =require('morgan')

const app = express();
const PORT = 3000;

//MIDDLEWARES
app.use(morgan('dev'))

app.use(express.json());
app.use((req,res,next)=>{
console.log('Hello its your own middleWare')
next()
})

app.use((req,res,next)=>{
  req.requesTime=new Date().toISOString()
  next()
  })


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

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
//2:- Rourte HANDLERS
const getAlltours=(req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
}
const getTour=(req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (id > tours.length) {
    // if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'success',

    data: {
      tour,
    },
  });
}
const createTour= (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id * 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
}
const updateTour= (req,res)=>{
  if (req.params.id *1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
res
.status(200)
.json({
  status:'success',
  data:{
    tours:'<Updating tour here....>'
  }
})
}
const deleteTour=(req,res)=>{
  if (req.params.id *1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
res
.status(204)
.json({
  status:'success',
  data:null
})
}

// app.get('/api/v1/tours',getAlltours );
// app.post('/api/v1/tours',createTour);
// app.get('/api/v1/tours/:id',getTour );
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id',deleteTour)

//3:-Routes

app.route('/api/v1/tours')
.get(getAlltours)
.post(createTour)

app.route('/api/v1/tours/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour)

//4:- START SERVER

app.listen(PORT, () => {
  console.log(`App is running on port:${PORT}`);
});
