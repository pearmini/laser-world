import KinectPV2.*;
import processing.net.*;

KinectPV2 k2;
Client client;

void setup() {
  size(424, 424);
  k2 = new KinectPV2(this);
  k2.enableDepthImg(true);
  k2.init();

  client = new Client(this, "127.0.0.1", 8000);
}

void draw() {
  PImage img = k2.getDepthImage();
  int [] depth = k2.getRawDepthData();
  int cnt = 0;

  img.loadPixels();
  for (int i = 0; i < k2.HEIGHTDepth; i++) {
    for (int j = 0; j < k2.WIDTHDepth; j++) {
      int index = j + i * k2.WIDTHDepth;
      int rawDepth = depth[index];
      if (rawDepth > 100 && rawDepth < 1000) {
        img.pixels[index] = color(255, 0, 0);
        cnt++;
      }
    }
  }
  
  if(client.active()){
    char flag = cnt > 100 ? 'i' : 'o';
    client.write(flag);
  }
  

  img.updatePixels();
  image(img, 0, 0, width, height);
}