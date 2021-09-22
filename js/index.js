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
    ui.click.bind(ui),
  );

  // debug only (to see x y when clicking either with mousse or with hand)
  document.addEventListener("click", function(event){
    var el = document.elementFromPoint(event.clientX, event.clientY);
    console.log(el.nodeName + " (from eventListener) X " + event.clientX +  " Y " + event.clientY);
  });

  var list = document.getElementById("ActionList");

  // manage click event on actions on the left side
  $("button").click(function() {
    var fragment = document.createDocumentFragment();
    // creat a new list element
    var li = document.createElement('li');
    // give it the button value as value
    li.textContent  = $(this).val();
    fragment.appendChild(li);
    // and appen it to the ActionList
    list.appendChild(fragment);

  });

  // manage click event on actions on the right side
  list.addEventListener("click",function(e) {
    if(e.target && e.target.nodeName == "LI") {
        list.removeChild(e.target)
    }
  });
}
