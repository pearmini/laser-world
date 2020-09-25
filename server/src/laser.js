import { DAC } from "@laser-dac/core";
import { Simulator } from "@laser-dac/simulator";
import { EtherDream } from "@laser-dac/ether-dream";
import { Scene, Rect, Line, Circle } from "@laser-dac/draw";
import runtime from "./global";

export default async function () {
  const dac = new DAC();
  dac.use(new EtherDream());
  await dac.start();

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

    if (runtime.flag) {
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
        x: 0.4,
        y: 0.4,
        radius,
        color: [0, 1, 1],
      });
      scene.add(circle);
    }
  }
}
