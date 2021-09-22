export class UserInterface {
  constructor(al) {
    this.actionlist = al;
    this.cursor = document.createElement("div");
    document.body.appendChild(this.cursor);
    this.cursor.style.position = "absolute";
    this.cursor.style.width = "10px";
    this.cursor.style.height = "10px";
    this.zone = document.getElementById('cursor_zone').getBoundingClientRect();

    this.init_action_buttons();
  }

  init_action_buttons() {
    const btnlist = document.getElementsByClassName("ActionButton");
    for (const btn of btnlist) {
      btn.addEventListener('click', e => {
	if (btn.actionclass) this.actionlist.add(new btn.actionclass());
      });
    }
  }

  zone_xy(x, y) {
    return [
      this.zone.left + (Math.round(x * (this.zone.right-this.zone.left))|0),
      this.zone.top + (Math.round(y * (this.zone.bottom-this.zone.top))|0),
    ];
  }

  cursor_position(x, y, closed) {
    const [xPos, yPos] = this.zone_xy(x, y);
    this.cursor.style.left = xPos + "px";
    this.cursor.style.top = yPos+ "px";
    this.cursor.style.background = closed ? "#ff0000" : "#000000";
  }

  click(x, y) {
    const [xPos, yPos] = this.zone_xy(x, y);
    document.elementsFromPoint(xPos, yPos).forEach(e => e.click());
  }
}
