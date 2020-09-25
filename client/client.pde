import processing.net.*;
import org.openkinect.processing.*;
import controlP5.*;

PImage display;
Kinect2 k2;
int rectX, rectY, rectWidth, rectHeight;
ControlP5 cp5;
Client client;

int MAX;
int MIN;

void setup() {
  size(424, 424);
  initKect2();
  initRect();
  initInterface();
  initClient();
}

void draw() {
  drawDetectionImage();
  drawRect();
}

void mousePressed() {
  if (mouseY < 60)return;
  rectWidth = 0;
  rectHeight = 0;
  rectX = mouseX;
  rectY = mouseY;
}

void mouseDragged() {
  if (mouseY < 60)return;
  rectWidth = mouseX - rectX;
  rectHeight = mouseY - rectY;
}

void initClient() {
  client = new Client(this, "127.0.0.1", 8000);
}

void initInterface() {
  cp5 = new ControlP5(this);
  cp5.addSlider("MIN")
    .setPosition(0, 0)
    .setSize(200, 20)
    .setRange(0, 5000)
    .setValue(0)
    .setColorCaptionLabel(color(20, 20, 20));

  cp5.addSlider("MAX")
    .setPosition(0, 30)
    .setSize(200, 20)
    .setRange(0, 5000)
    .setValue(749)
    .setColorCaptionLabel(color(20, 20, 20));
}

void initKect2() {
  k2 = new Kinect2(this);
  k2.initDepth();
  k2.initDevice();
  display = createImage(k2.depthWidth, k2.depthHeight, RGB);
}

void initRect() {
  rectX =0;
  rectY = 0;
  rectWidth = 0;
  rectHeight = 0;
}

void drawRect() {
  Boolean isIn = hasObject(rectX, rectY, rectWidth, rectWidth, MIN, MAX);
  color c = isIn ? color(0, 255, 0) : color(255, 0, 0);
  if (client.active()) {
    char flag = isIn ? 'i' : 'o';
    client.write(frameCount + "-" + flag);
  }
  stroke(c);
  noFill();
  rect(rectX, rectY, rectWidth, rectHeight);
}

void drawDetectionImage() {
  PImage img = k2.getDepthImage();
  int[] depth = k2.getRawDepth();

  if (depth == null || img == null) return;

  display.loadPixels();
  for (int i = 0; i < k2.depthWidth; i++) {
    for (int j = 0; j < k2.depthHeight; j++) {
      int offset = (k2.depthWidth - i - 1) + j * k2.depthWidth;
      int pix = i + j*display.width;
      display.pixels[pix] = img.pixels[offset];
    }
  }
  display.updatePixels();

  image(display, 0, 0, width, height);
}

Boolean hasObject(int x, int y, int w, int h, int minDepth, int maxDepth) {
  int[] depth = k2.getRawDepth();
  int x1 = min(k2.depthWidth, x + w);
  int y1 = min(k2.depthHeight, y + h);

  for (int i = x; i < x1; i++) {
    for (int j = y; j < y1; j++) {
      int index = k2.depthWidth - i - 1 + j * k2.depthWidth;
      int rawDepth = depth[index];
      if (rawDepth > minDepth && rawDepth < maxDepth) {
        return true;
      }
    }
  }

  return false;
}
