export class UserInterface {
  constructor() {
    this.cursor = document.createElement("div");
    document.body.appendChild(this.cursor);
    this.cursor.style.position = "absolute";
    this.cursor.style.width = "10px";
    this.cursor.style.height = "10px";
  }

  cursor_position(x, y, closed) {
    this.cursor.style.left = ((Math.round(x * window.innerWidth)|0) - 5) + "px";
    this.cursor.style.top = ((Math.round(y * window.innerHeight)|0) - 5) + "px";
    this.cursor.style.background = closed ? "#ff0000" : "#000000";
  }
}
