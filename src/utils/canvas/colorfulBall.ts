import {
  // drawCircle,
  // mergeOptions,
  // clearCanvas,
  drawEllipse
  // drawRect
} from 'rz/utils/canvas/utils';

export function drawBall(ctx, clear) {
  const x = 300;
  const y = 300;
  const minorAxis = 260;
  const macroAxis = 260;
  const startRadius = 240;
  const endRadius = 80;
  const offset = 80;

  let increase = true;
  let timer2 = null;
  let i = 0;

  clearInterval(timer2);
  increase = !increase;
  let config = {
    vertex: {
      x,
      y
    },
    radius: {
      minorAxis,
      macroAxis
    }
  };

  let options = {
    linearStartPoint: { x: 0, y: 0 },
    linearEndPoint: { x: 0, y: 0 },
    linearFlag: false,
    fillColor: `rgba(188, 138, 253, 0)`,
    startRadius,
    endRadius,
    opacity: 0.1,
    colorItems: [
      { position: 0.1, color: `rgba(188, 138, 253, 0)` },
      { position: 0.2, color: `rgba(188, 138, 253, 0.1)` },
      { position: 0.3, color: `rgba(188, 138, 253, 0.3)` },
      { position: 0.4, color: `rgba(188, 138, 253, 0.7)` },
      { position: 0.8, color: `rgba(188, 138, 253, 0.9)` }
    ]
  };

  timer2 = setInterval(() => {
    increase ? i++ : i--;
    if (i === 10 || i === 5) {
      increase = !increase;
    }
    const gap = i / 8;

    clear();

    config = {
      vertex: {
        x,
        y
      },
      radius: {
        minorAxis: minorAxis - 15,
        macroAxis: macroAxis - 15
      }
    };
    let filter = Math.min(1, (1.6 * Math.abs(gap)) / 10);
    if (filter < 0.7) filter = 0.7;

    // 画中间的彩色圆
    const linearX = x - x / 2 - 50;
    const linearY = y + y / 2;
    // options = {
    //   fillColor: rgba,
    //   linearStartPoint: { x: linearX, y: 0 },
    //   linearEndPoint: { x: linearX, y: linearY },
    //   linearFlag: false,

    //   // linearStart: `rgba(186, 168, 221, ${Math.min(1, filter)})`,
    //   linearStart: `rgba(178, 158, 215, ${filter})`,

    //   // linearEnd: `rgba(27, 209, 255, ${Math.min(1, filter)})`,
    //   linearEnd: `rgba(26, 151, 188, ${filter})`,

    //   startRadius: startRadius,
    //   endRadius: endRadius,
    //   opacity: 0.1,
    //   startPosition: 0.3,
    //   endPosition: 0.7
    // };
    options = {
      linearStartPoint: { x: linearX - linearX * 0.7, y: 0 },
      linearEndPoint: { x: linearX, y: linearY },
      linearFlag: true,
      fillColor: `rgba(188, 138, 253, 0)`,
      startRadius: 240,
      endRadius: 80,
      opacity: 0.1,
      colorItems: [
        { position: 0.1, color: `rgba(180, 167, 218, 0.4)` },
        { position: 0.2, color: `rgba(105, 111, 151, 0.28)` },
        { position: 0.3, color: `rgba(214, 233, 251, 0.22)` },
        { position: 0.4, color: `rgba(214, 233, 251, 0.18)` },
        { position: 0.5, color: `rgba(165, 226, 252, 0.08)` },
        { position: 0.6, color: `rgba(130, 219, 253, 0.10)` },
        { position: 0.7, color: `rgba(80, 216, 254, 0.14)` },
        { position: 0.8, color: `rgba(74, 101, 141, 0.16)` },
        { position: 0.9, color: `rgba(54, 213, 254, 0.18)` },
        { position: 1, color: `rgba(29, 209, 255, 0.25)` }
        // { position: 0.4, color: `rgba(93, 217, 253, 0.7)` },
        // { position: 0.5, color: `rgba(93, 217, 233, 0.9)` },
        // { position: 0.6, color: `rgba(33, 210, 255, 0)` },
        // { position: 0.1, color: `rgba(33, 210, 255, 0)` }
      ]
    };
    drawEllipse(ctx, config, options);

    options = {
      linearStartPoint: { x: 0, y: 0 },
      linearEndPoint: { x: 0, y: 0 },
      linearFlag: false,
      fillColor: `rgba(188, 138, 253, 0)`,
      startRadius: 280,
      endRadius: 80,
      opacity: 0.1,
      colorItems: [
        { position: 0.1, color: `rgba(177, 166, 215, 0)` },
        { position: 0.15, color: `rgba(177, 166, 215, 0.1)` },
        { position: 0.25, color: `rgba(177, 166, 215, 0.8)` },
        // { position: 0.4, color: `rgba(93, 217, 253, 0.7)` },
        // { position: 0.5, color: `rgba(93, 217, 233, 0.9)` },
        // { position: 0.6, color: `rgba(33, 210, 255, 0)` },
        // { position: 0.1, color: `rgba(33, 210, 255, 0)` },
        { position: 0.4, color: `rgba(177, 165, 216, 0)` }
      ]
    };
    drawEllipse(ctx, config, options);

    // 画正中的圆
    // config = {
    //   vertex: {
    //     x,
    //     y
    //   },
    //   radius: {
    //     minorAxis,
    //     macroAxis
    //   }
    // };
    // options = {
    //   linearStartPoint: { x: 0, y: 0 },
    //   linearEndPoint: { x: 0, y: 0 },
    //   linearFlag: false,
    //   fillColor: rgba,
    //   linearStart: rgba,
    //   linearEnd: rgba2,
    //   startRadius,
    //   endRadius,
    //   opacity: 0.1,
    //   startPosition: 0,
    //   endPosition: 1
    // };
    // drawEllipse(ctx, config, options);

    // 画正中的圆的外轮廓
    // config = {
    //   vertex: {
    //     x,
    //     y
    //   },
    //   radius: {
    //     minorAxis: minorAxis + gap,
    //     macroAxis: macroAxis + gap
    //   }
    // };
    // drawEllipse(ctx, config, options);

    // 画上下动的椭圆
    options = {
      linearStartPoint: { x: 0, y: 0 },
      linearEndPoint: { x: 0, y: 0 },
      linearFlag: false,
      fillColor: `rgba(186,139,253,0.3)`,
      // linearStart: `rgba(186,139,253,0.3)`,
      // linearEnd: `rgba(32,205,255,0)`,
      startRadius: 240,
      endRadius: 80,
      opacity: 0.1,
      colorItems: [
        { position: 0.1, color: `rgba(177, 166, 215, 0)` },
        { position: 0.15, color: `rgba(177, 166, 215, 0.1)` },
        { position: 0.25, color: `rgba(177, 166, 215, 0.8)` },
        // { position: 0.4, color: `rgba(93, 217, 253, 0.7)` },
        // { position: 0.5, color: `rgba(93, 217, 233, 0.9)` },
        // { position: 0.6, color: `rgba(33, 210, 255, 0)` },
        // { position: 0.1, color: `rgba(33, 210, 255, 0)` },
        { position: 0.4, color: `rgba(177, 165, 216, 0)` }
      ]
    };
    config = {
      vertex: {
        x: x,
        y: y + gap
      },
      radius: {
        minorAxis: minorAxis - offset / 3,
        macroAxis: macroAxis + offset / 3
      }
    };
    drawEllipse(ctx, config, options);

    // 画左右动的圆
    // config = {
    //   vertex: { x: x + gap, y },
    //   radius: {
    //     minorAxis: minorAxis + offset / 2,
    //     macroAxis: macroAxis
    //   }
    // };
    // drawEllipse(ctx, config, options);

    // 画中间的呼吸圆
    // config = {
    //   vertex: {
    //     x: x,
    //     y: y
    //   },
    //   radius: {
    //     minorAxis: minorAxis + gap,
    //     macroAxis: macroAxis + gap
    //   }
    // };
    // drawEllipse(ctx, config, options);
    // 画左斜动的圆
    // config = {
    //   vertex: {
    //     x: x + gap,
    //     y: y + gap
    //   },
    //   radius: {
    //     minorAxis: minorAxis,
    //     macroAxis: macroAxis + offset / 2
    //   }
    // };
    // drawEllipse(ctx, config, options);
    // 画右斜动的圆
    // config = {
    //   vertex: {
    //     x: x - gap,
    //     y: y - gap / 2
    //   },
    //   radius: {
    //     minorAxis: minorAxis + offset / 2,
    //     macroAxis: macroAxis
    //   }
    // };
    // drawEllipse(ctx, config, options);
  }, 16);
}


// import { drawBall } from 'rz/utils/canvas/colorfulBall';

// drawBall(this.canvasCtx,this.clear.bind(this));