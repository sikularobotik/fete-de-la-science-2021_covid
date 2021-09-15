import { UserInterface } from "./UserInterface.js"
import { CameraAnalysis } from "./CameraAnalysis.js"

if (document.location.protocol == "http:" && document.location.hostname != "localhost") {
  document.body.innerHTML = `<p>Dû à des restrictions de sécurité du navigateur, cet outil ne fonctionne qu'en HTTPS ou sur localhost.</p>
<p>Un pont peut être établi avec socat par exemple :</p>
<pre>socat tcp-listen:8080,reuseaddr,fork tcp:${document.location.host}</pre>`;

} else {
  const videoElement = document.getElementsByClassName('input_video')[0];
  const canvasElement = document.getElementsByClassName('output_canvas')[0];

  canvasElement.width = canvasElement.clientWidth;
  canvasElement.height = canvasElement.clientHeight;

  const ui = new UserInterface();
  const camanalyst = new CameraAnalysis(
    videoElement,
    canvasElement,
    ui.cursor_position.bind(ui),
  );
}
