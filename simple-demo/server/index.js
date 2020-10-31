const net = require("net");
const { DAC } = require("@laser-dac/core");
const { Simulator } = require("@laser-dac/simulator");
const { EtherDream } = require("@laser-dac/ether-dream");
const { Scene, Rect, Circle } = require("@laser-dac/draw");

let type = 1;

// server
const server = new net.createServer((connection) => {
  connection.on("data", function (data) {
    const flag = data.toString();
    type = flag === "i" ? 0 : 1;
  });

  connection.on("end", function () {
    console.log("close connection");
  });
});

const port = 8000;
const hostname = "127.0.0.1";
server.listen(port, hostname, function () {
  console.log(`The server is running on：http://${hostname}:${port}`);
});

// laser
const dac = new DAC();
dac.use(new Simulator());
dac.start().then(() => {
  const scene = new Scene({
    resolution: 500,
  });
  scene.start(step);
  dac.stream(scene);

  function step() {
    const boxWidth = 0.6;
    const boxHeight = 0.2;
    const boxX = (1 - boxWidth) / 2;
    const boxY = (1 - boxHeight) / 2;

    if (type) {
      drawRect();
    } else {
      drawCirlce();
    }

    function drawRect() {
      const rect = new Rect({
        width: boxWidth,
        height: boxHeight,
        color: [0, 1, 1],
        x: boxX,
        y: boxY,
      });
      scene.add(rect);
    }

    function drawCirlce() {
      const radius = 0.2;
      const circle = new Circle({
        x: 0.5,
        y: 0.5,
        radius,
        color: [0, 1, 1],
      });
      scene.add(circle);
    }
  }
});
