const EventEmitter = require("events");
const http = require("http");

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

myEmitter.on("topic of Node.Js", () => {
  console.log("There is new freaking lesson");
});
myEmitter.on("topic of Node.Js", () => {
  console.log("There is another new freaking lesson");
});
myEmitter.on("topic of Node.Js", (topics) => {
  console.log(`There are ${topics} more topics left to finish the course.`);
});

myEmitter.emit("topic of Node.Js", "Few"); // we can use string or numbers as 2nd parameter as well.

//
const PORT=5000
const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request Received!");
  console.log(req.url);//we can see browser is requesting to /favicon.ico that's why we are getting same output twice 
  res.end("Request Received");
});
server.on("request", (req, res) => {
  console.log("2nd Request Received!");
  // res.end("2nd Request Received");
});
server.on("request", (req, res) => {
  console.log("3rd Request Received!");
  // res.end("3rd Request Received");
});

server.on('close',()=>{
  console.log('Server closed');
})

server.listen(PORT,()=>{
  console.log('Waiting For your Freaking request Man');
})