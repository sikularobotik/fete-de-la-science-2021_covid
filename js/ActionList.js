function btnRm() {
  const btn = document.createElement('button');
  btn.textContent = '×';
  btn.classList.add('ActionRemove');
  return btn;
}

class MoveAction {
  static label = 'Avancer / Reculer';

  constructor() {
    this.distance = 1;
  }

  set_distance(v) {
    this.distance = v;
  }

  li() {
    const li = document.createElement('li');
    if (this.distance < 0) {
      li.textContent = "Reculer de " + Math.round(this.distance * -100) + " cm";
    } else {
      li.textContent = "Avancer de " + Math.round(this.distance * 100) + " cm";
    }
    li.appendChild(btnRm());
    return li;
  }

  json() {
    return {
      "_type": "MoveLine",
      "distance": "" + this.distance
    };
  }
}

class RotateAction {
  static label = 'Tourner';

  constructor() {
    this.angle = 0;
  }

  set_angle(a) {
    this.angle = a;
  }

  li() {
    const li = document.createElement('li');
    li.textContent = "Tourner de " + this.angle + "°";
    li.appendChild(btnRm());
    return li;
  }

  json() {
    return {
      "_type": "MoveRotate",
      "angle": "" + this.angle
    };
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

  save(url) {
    const json = {
      "actions": [
        {
          "_type": "VariableWait",
          "operation": "=",
          "source": "rr_robotctrl",
          "timeout": "-1",
          "value": "1",
          "varname": "sensors.tor.jack"
        },
        {
          "_type": "VariableWait",
          "operation": "=",
          "source": "rr_robotctrl",
          "timeout": "-1",
          "value": "0",
          "varname": "sensors.tor.jack"
        },
      ],
      "desc": "Match par interface sans contact pour la Fête de la Science",
      "name": "FdS"
    };
    for (const action of this.list) {
      if (action.json) json.actions.push(action.json());
    }
    const u = new URL('/configs/multiseq/match__fete_de_la_science.json', url);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', u.href, true);
    xhr.send(JSON.stringify(json));
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
