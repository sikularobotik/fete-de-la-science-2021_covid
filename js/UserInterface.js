export class UserInterface {
  constructor(al) {
    this.actionlist = al;
    this.cursor = document.createElement("div");
    this.cursor.id = 'cursor';
    this.cursor.style.left = "-100px";
    this.cursor.style.top = "-100px";
    document.body.appendChild(this.cursor);

    this.init_action_buttons();
    this.init_save_button();
  }

  init_action_buttons() {
    const btnlist = document.getElementsByClassName("ActionButton");
    for (const btn of btnlist) {
      if(btn.dataset.toggle != "modal"){
        btn.addEventListener('click', e => {
  	       if (btn.actionclass) this.actionlist.add(new btn.actionclass());
        });
      }
    }
    const validateButton = document.getElementById("ValidateAction");
    validateButton.addEventListener('click', this.validate_modal.bind(event,this.actionlist));
  }

  validate_modal(actionlist) {
    let myButton = document.getElementById("ValidateAction");
    let modalOut =  document.getElementsByTagName("output")[0];
    myButton.actionclass.attributes.value = modalOut.value;

    console.log(myButton.actionclass);
    if (myButton.actionclass) actionlist.add(new myButton.actionclass());
  }

  init_save_button() {
    const btn = document.getElementById('btnSave');
    const url = document.getElementById('robot_url');
    btn.addEventListener('click', e => this.actionlist.save(url.value));
  }

  zone_xy(x, y) {
    if (!x || !y) return [-100, -100];
    const zone = document.getElementById('cursor_zone').getBoundingClientRect();
    return [
      zone.left + (Math.round(x * (zone.right-zone.left))|0),
      zone.top + (Math.round(y * (zone.bottom-zone.top))|0),
    ];
  }

  cursor_position(x, y, closed) {
    const [xPos, yPos] = this.zone_xy(x, y);
    this.cursor.style.left = xPos + "px";
    this.cursor.style.top = yPos+ "px";
    if (closed)
      this.cursor.classList.add('active');
    else
      this.cursor.classList.remove('active');
  }

  click(x, y) {
    const [xPos, yPos] = this.zone_xy(x, y);
    document.elementsFromPoint(xPos, yPos).forEach(e => e.click());
  }
}

$('#rotateKnob').jsRapKnob({
  position:0.5,
  step:10,
  onChange:function(value){
     $(".rapKnobCaption",this).text('Angle ' + (Math.floor(value * 360)-180) + '°');
     $('#modalOutput').val(Math.floor(value * 360)-180);
  },
});

$('#moveRange').attr({
    min:-50,
    max:50,
    step:2,
    value:0,
});
$('#moveRange').on("input change", function() {
  $('#modalOutput').val(this.value);
});

$('#actionModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget)[0]; // Button that triggered the modal
  var thisAction = button.actionclass;
  document.getElementById("ValidateAction").actionclass = thisAction;

  // Update the modal's content
  var modal = $(this)
  modal.find('.modal-title').text(button.textContent);

  let domToHide = modal.find('.modal-body').children()
  domToHide.each(function(index, element) {
    if(element.id != "modalOutput") element.style.display = 'none';
  });

  let domToShow = modal.find('.modal-body').find(thisAction.linkedDOM)[0];
  domToShow.style.display = 'block';
})
