class MoveAction {
  static label = 'Avancer / Reculer';
}

class RotateAction {
  static label = 'Tourner';
}

export class ActionList {
  constructor(ul) {
    this.ul = ul;
  }

  static get_button_list_fragment() {
    const fragment = document.createDocumentFragment();
    for (const c of [MoveAction, RotateAction]) {
      const btn = document.createElement('button');
      btn.textContent  = c.label;
      btn.value = c.label;
      fragment.appendChild(btn);
      fragment.appendChild(document.createElement('br'));
    }
    return fragment;
  }
}
