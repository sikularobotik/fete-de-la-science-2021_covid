export class CameraAnalysis {
  constructor(videoElement, canvasElement, fct_cursor_position, fct_click) {
    const canvasCtx = canvasElement.getContext('2d');
    let was_closed = false;
    function onResults(results) {
      canvasCtx.save();
      const w = Math.min(canvasElement.width, canvasElement.height * 16/9);
      const h = Math.min(canvasElement.height, canvasElement.width * 9/16);
      const x0 = (canvasElement.width - w)/2;
      const y0 = (canvasElement.height - h)/2;
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.translate(canvasElement.width, 0);
      canvasCtx.scale(-1, 1);
      canvasCtx.drawImage(results.image, x0, y0, w, h);
      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          let fingers = 0;
          if ((landmarks[ 6].x-landmarks[0].x)**2 + (landmarks[ 6].y-landmarks[0].y)**2 < (landmarks[ 8].x-landmarks[0].x)**2 + (landmarks[ 8].y-landmarks[0].y)**2) fingers += 2;
          if ((landmarks[10].x-landmarks[0].x)**2 + (landmarks[10].y-landmarks[0].y)**2 < (landmarks[12].x-landmarks[0].x)**2 + (landmarks[12].y-landmarks[0].y)**2) fingers += 4;
          if ((landmarks[14].x-landmarks[0].x)**2 + (landmarks[14].y-landmarks[0].y)**2 < (landmarks[16].x-landmarks[0].x)**2 + (landmarks[16].y-landmarks[0].y)**2) fingers += 8;
          if ((landmarks[18].x-landmarks[0].x)**2 + (landmarks[18].y-landmarks[0].y)**2 < (landmarks[20].x-landmarks[0].x)**2 + (landmarks[20].y-landmarks[0].y)**2) fingers += 16;

          function z(a, b, o) { return ((a.y-o.y) * (b.x-o.x) - (a.x-o.x) * (b.y-o.y)); }
          if (z(landmarks[4], landmarks[5], landmarks[0]) * z(landmarks[5], landmarks[17], landmarks[0]) > 0) fingers += 1;

          canvasCtx.strokeStyle = 'blue';
          canvasCtx.lineWidth = 5;
          canvasCtx.beginPath();
          canvasCtx.moveTo(x0 + w * landmarks[0].x, y0 + h * landmarks[0].y);
          for (let i = 1; i < 5; i++) canvasCtx.lineTo(x0 + w * landmarks[i].x, y0 + h * landmarks[i].y);
          canvasCtx.moveTo(x0 + w * landmarks[1].x, y0 + h * landmarks[1].y);
          for (let i = 5; i < 9; i++) canvasCtx.lineTo(x0 + w * landmarks[i].x, y0 + h * landmarks[i].y);
          canvasCtx.moveTo(x0 + w * landmarks[5].x, y0 + h * landmarks[5].y);
          for (let i = 9; i < 13; i++) canvasCtx.lineTo(x0 + w * landmarks[i].x, y0 + h * landmarks[i].y);
          canvasCtx.moveTo(x0 + w * landmarks[9].x, y0 + h * landmarks[9].y);
          for (let i = 13; i < 17; i++) canvasCtx.lineTo(x0 + w * landmarks[i].x, y0 + h * landmarks[i].y);
          canvasCtx.moveTo(x0 + w * landmarks[13].x, y0 + h * landmarks[13].y);
          for (let i = 17; i < 21; i++) canvasCtx.lineTo(x0 + w * landmarks[i].x, y0 + h * landmarks[i].y);
          canvasCtx.moveTo(x0 + w * landmarks[0].x, y0 + h * landmarks[0].y);
          canvasCtx.lineTo(x0 + w * landmarks[17].x, y0 + h * landmarks[17].y);
          canvasCtx.stroke();
          canvasCtx.rect(canvasElement.width*0.15, canvasElement.height*0.15, canvasElement.width*0.7, canvasElement.height*0.7);
          canvasCtx.lineWidth = 1;
          canvasCtx.stroke();

          for (let i = 0; i < 5; i++) {
            canvasCtx.fillStyle = fingers & (1 << i) ? 'green' : 'red';
            canvasCtx.beginPath();
            canvasCtx.arc(x0 + w * landmarks[i*4+1].x, y0 + h * landmarks[i*4+1].y, 8, 0, Math.PI * 2, true);
            canvasCtx.fill();
          }

          const x = Math.min(Math.max(0, (1-(landmarks[0].x+landmarks[9].x)/2-0.15)/0.7), 1);
          const y = Math.min(Math.max(0, ((landmarks[0].y+landmarks[9].y)/2-0.15)/0.7), 1);
          const closed = fingers < 2;
          if (fct_cursor_position) fct_cursor_position(x, y, closed);
          if (closed && !was_closed && fct_click) fct_click(x, y);
          was_closed = closed;
        }
      }
      canvasCtx.restore();
    }

    const hands = new Hands({locateFile: (file) => { return `./libs/${file}`; }});
    hands.setOptions({
      maxNumHands: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    hands.onResults(onResults);

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({image: videoElement});
      }
    });
    camera.start();
  }
}
