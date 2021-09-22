class MoveAction {
  static label = 'Avancer / Reculer';

  li() {
    const li = document.createElement('li');
    li.textContent = MoveAction.label;
    return li;
  }
}

class RotateAction {
  static label = 'Tourner';

  li() {
    const li = document.createElement('li');
    li.textContent = RotateAction.label;
    return li;
  }
}

export class ActionList {
  constructor(ul) {
    this.ul = ul;
    this.list = []
  }

  add(action) {
    this.list.push(action);
    this.ul.appendChild(action.li())
  }

  static get_button_list_fragment() {
    const fragment = document.createDocumentFragment();
    for (const c of [MoveAction, RotateAction]) {
      const btn = document.createElement('button');
      btn.textContent  = c.label;
      btn.classList.add("ActionButton");
      btn.actionclass = c;
      fragment.appendChild(btn);
      fragment.appendChild(document.createElement('br'));
    }
    return fragment;
  }
}
