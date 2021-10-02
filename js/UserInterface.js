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
      btn.addEventListener('click', e => {
	if (btn.actionclass) this.actionlist.add(new btn.actionclass());
      });
    }
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
