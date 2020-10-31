import runtime from "./global";

export default function () {
  const net = require("net");
  const port = 8000;
  const hostname = "127.0.0.1";

  const server = new net.createServer((connection) => {
    connection.on("data", function (data) {
      const result = data.toString();
      const chars = result.split("-");
      runtime.flag = chars[1] === "i" ? true : false;
      console.log(result, runtime.flag)
    });

    connection.on("end", function () {
      console.log("close connection");
    });
  });

  server.listen(port, hostname, function () {
    console.log(`The server is running on：http://${hostname}:${port}`);
  });
}
