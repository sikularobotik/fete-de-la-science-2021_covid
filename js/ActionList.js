function btnRm() {
  const btn = document.createElement('button');
  btn.textContent = '×';
  btn.classList.add('ActionRemove');
  return btn;
}

class MoveAction {
  static label = 'Avancer / Reculer';

  li() {
    const li = document.createElement('li');
    li.textContent = MoveAction.label;
    li.appendChild(btnRm());
    return li;
  }
}

class RotateAction {
  static label = 'Tourner';

  li() {
    const li = document.createElement('li');
    li.textContent = RotateAction.label;
    li.appendChild(btnRm());
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
    this.add_dom(action);
  }

  add_dom(action) {
    const li = action.li();
    const actionlist = this;
    for (const btn of li.getElementsByClassName('ActionRemove')) {
      btn.addEventListener('click', e => actionlist.remove(action));
    }
    this.ul.appendChild(li);
  }

  remove(action) {
    const idx = this.list.indexOf(action);
    if (idx > -1) this.list.splice(idx, 1);
    this.ul.innerHTML = '';
    for (const e of this.list) {
      this.add_dom(e);
    }
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
