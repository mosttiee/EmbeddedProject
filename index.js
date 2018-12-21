const express = require("express"),
  server = express(),
  socketIO = require("socket.io"),
  bodyParser = require("body-parser");

server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// PORT && connection
const PORT = process.env.PORT || 5000;
const app = server.listen(PORT, () =>
  console.log(`listenning to port ${PORT}...`)
);

// socket.io
const io = socketIO.listen(app);

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Object variables
const sensor = {
  min_bpm: 0,
  max_bpm: 0,
  bpm: 0
};

const update = body => {
  sensor.bpm = body.bpm;

  io.sockets.emit("new-state", sensor);
};

const updateControl = body => {
  sensor.min_bpm = body.min_bpm;
  sensor.max_bpm = body.max_bpm;
};
// APIs

// for the front end to get the information to display
server.get("/api/sensor", (req, res) => {
  res.send(sensor);
});

// for the nodeMCU to update the status of the sensors
server.post("/api/sensor", (req, res) => {
  update(req.body);
  res.send(sensor);
});

server.post("/api/sensor/control", (req, res) => {
  updateControl(req.body);
  res.send(sensor);
});

io.on("connection", client => {
  console.log("user connected");

  // client disconnects
  client.on("disconnect", () => {
    console.log("user disconnected");
  });
});

if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  // lide our main.js file, or main.css file!
  server.use(express.static("client/build"));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require("path");
  server.get("*", () => (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
