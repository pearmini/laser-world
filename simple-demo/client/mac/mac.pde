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
