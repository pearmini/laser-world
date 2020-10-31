# Simple Demo

这里是运行 simple-demo 的指引和里面关键代码的讲解。

## 运行

- 服务器
    - 在该项目的根目录打开终端。
    - 切换到 server 目录：`cd server`
    - 安装依赖：`yarn install`
    - 运行服务器：`node index.js`
- 客户端：在 clinet 文件夹里面有两个文件夹，如果你使用 mac 电脑就用 Processing 运行 `mac.pde`，否则就运行 win 文件夹里面的 `win.pde`。

这里需要注意的一点就是：**每次修改了服务器代码之后都需要重新启动客户端，保证代码的正常运行。**

## 代码讲解

### clinet

这里的讲解就以 mac 为例，windows 平台上的代码非常的相似。这里主要有三步：

- 获得 kinect 识别的场景。
- 根据深度数据检测物体。
- 建立客户端发送数据给服务器。

#### 绘制 kinect 识别的场景

这一步非常的简单，kinect 会将其识别的场景通过 PImage 的形式提供给我们，我们只需要在 `draw` 函数中实时地绘制就好。

```java
import org.openkinect.processing.*;
Kinect2 k2;

void setup() {
  size(424, 424);
  
  // init kinect
  k2 = new Kinect2(this);
  k2.initDepth();
  k2.initDevice();
}

void draw() {
  PImage img = k2.getDepthImage();
  image(img, 0, 0, width, height);
}

```

#### 根据深度数据检测物体

通过 `getRawDepth` 方法获得每一个像素点的深度，然后根据深度判断是否有物体，如果有就将该像素变成红色。

```java
import org.openkinect.processing.*;

PImage display;
Kinect2 k2;

void setup() {
  size(424, 424);
  
  // init kinect
  k2 = new Kinect2(this);
  k2.initDepth();
  k2.initDevice();
  display = createImage(k2.depthWidth, k2.depthHeight, RGB);
}

void draw() {
  PImage img = k2.getDepthImage();
  int[] depth = k2.getRawDepth();
  int minDepth = 10, maxDepth = 1000;
  
  if (depth == null || img == null) return;
  display.loadPixels();
  
  for (int i = 0; i < k2.depthWidth; i++) {
    for (int j = 0; j < k2.depthHeight; j++) {
      int index = i + j * display.width;
      int rawDepth = depth[index];
      if (rawDepth > minDepth && rawDepth < maxDepth) {
        display.pixels[index] = color(255, 0, 0);
      }else{
        display.pixels[index] = img.pixels[index];
      }
    }
  }
  display.updatePixels();
  image(display, 0, 0, width, height);
}
```

#### 建立客户端并且发送检测结果

这里需要注意的一点就是：在每一帧绘制的时候，我们统计变红像素的个数，如果该数值超过某个阈值，就发送有物体的信息给服务器，否则发送没有物体的信息。

```java
import processing.net.*;
import org.openkinect.processing.*;

PImage display;
Kinect2 k2;
Client client;

void setup() {
  size(424, 424);
  
  // init kinect
  k2 = new Kinect2(this);
  k2.initDepth();
  k2.initDevice();
  display = createImage(k2.depthWidth, k2.depthHeight, RGB);
  
  // init clinet
  client = new Client(this, "127.0.0.1", 8000);
}

void draw() {
  PImage img = k2.getDepthImage();
  int[] depth = k2.getRawDepth();
  int minDepth = 10, maxDepth = 1000;
  int cnt = 0;
  
  if (depth == null || img == null) return;
  display.loadPixels();
  
  for (int i = 0; i < k2.depthWidth; i++) {
    for (int j = 0; j < k2.depthHeight; j++) {
      int index = i + j * display.width;
      int rawDepth = depth[index];
      if (rawDepth > minDepth && rawDepth < maxDepth) {
        cnt++;
        display.pixels[index] = color(255, 0, 0);
      }else{
        display.pixels[index] = img.pixels[index];
      }
    }
  }
  display.updatePixels();
  image(display, 0, 0, width, height);
  
  if(client.active()){
    char flag = cnt > 100 ? 'i' : 'o';
    client.write(flag);
  }
}
```
### server

服务器端主要有两步：

- 搭建服务器能收到客户端发送的数据。
- 根据收到的数据控制激光。

#### 搭建服务器

以下的代码是搭建一个在本地端口 8000 运行的服务器。

```js
// 需要的第三方库
const net = require("net");

// 创建服务器
const server = new net.createServer((connection) => {
  /*
  * 监听收到数据的事件
  * 回调函数的 data 参数就是收到的数据
  */
  connection.on("data", function (data) {
    const flag = data.toString();
    console.log(flag)
  });
});

// 运行服务器
server.listen(8000, "127.0.0.1");
```

#### 控制激光

控制激光的代码如下，有两点需要特别注意：

- 在调试过程中，可以使用模拟器来模拟激光的效果：`dac.use(new Simulator())`，在最终运行时候可以用相应的 DAC，这里就用 Ether Dream 举例：`dac.use(new EtherDream())`。
- 控制激光绘制的图案最关键的代码在 `step` 函数中，该函数会被一直循环调用，类似于 Processing 中的 `draw` 函数。

```js
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

```