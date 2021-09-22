export class UserInterface {
  constructor() {
    this.cursor = document.createElement("div");
    document.body.appendChild(this.cursor);
    this.cursor.style.position = "absolute";
    this.cursor.style.width = "10px";
    this.cursor.style.height = "10px";
    this.lastElement = null;
    this.resetTimeout = null;
  }

  cursor_position(x, y, closed) {
    const zone = document.getElementById('cursor_zone').getBoundingClientRect();
    const xPos = zone.left + (Math.round(x * (zone.right-zone.left))|0);
    const yPos = zone.top + (Math.round(y * (zone.bottom-zone.top))|0);
    this.cursor.style.left = xPos + "px";
    this.cursor.style.top = yPos+ "px";
    this.cursor.style.background = closed ? "#ff0000" : "#000000";
    // if human try to click, get every dom element at this position
    if(closed){
      var elements = document.elementsFromPoint(xPos, yPos);
      elements.forEach(this.check_is_new_button.bind(this));
    }
  }
  /* @brief methode which check if the element something to interract with
  *  @element the dom element to check
  *  @retval click event
  */
  check_is_new_button(element){
    if((element.tagName == "BUTTON" || element.tagName == "LI")
        && element != this.lastElement){
      clearTimeout(this.resetTimeout);
      this.lastElement = element;
      element.click();
      this.resetTimeout = setTimeout(function(){ console.log("timeout");this.lastElement = null; }, 500);
    }
  }
}
