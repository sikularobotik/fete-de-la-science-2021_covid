export class UserInterface {
  constructor(al) {
    this.actionlist = al;
    this.modalaction = null;
    this.cursor = document.createElement("div");
    this.cursor.id = 'cursor';
    this.cursor.style.left = "-100px";
    this.cursor.style.top = "-100px";
    document.body.appendChild(this.cursor);

    this.init_action_buttons();
    this.init_save_button();
    this.init_modal();
  }

  init_action_buttons() {
    for (const btn of document.getElementsByClassName("ActionButton"))
      btn.addEventListener('click', this.action_button_pressed.bind(this, btn));
  }

  init_save_button() {
    const btn = document.getElementById('btnSave');
    const url = document.getElementById('robot_url');
    btn.addEventListener('click', e => this.actionlist.save(url.value));
  }

  init_modal() {
    const validateButton = document.getElementById("ValidateAction");
    validateButton.addEventListener('click', this.validate_modal.bind(this))
  }

  action_button_pressed(btn) {
    if (!btn.actionclass) return;
    const action = new btn.actionclass();
    if (action.modalhtml) {
      document.getElementById("ActionModalTitle").textContent = btn.textContent;
      const amb = document.getElementById("ActionModalBody");
      amb.textContent = "";
      amb.appendChild(action.modalhtml());
      this.modalaction = action;
      $("#actionModal").modal()
    } else {
      this.actionlist.add(action);
    }
  }

  validate_modal() {
    if (!this.modalaction) return;
    if (this.modalaction.modalvalidate)
      this.modalaction.modalvalidate(document.getElementById("ActionModalBody"));
    this.actionlist.add(this.modalaction);
    this.modalaction = null;
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
    const ev = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true,
      'clientX': xPos,
      'clientY': yPos
    });
    for (const el of document.elementsFromPoint(xPos, yPos)) {
      if (el == this.cursor) continue;
      el.dispatchEvent(ev);
      break;
    }
  }
}

