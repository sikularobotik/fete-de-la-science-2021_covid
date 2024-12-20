import { Range, Dial } from './CustomControls.js'

function btns() {
  const div = document.createElement('div');

  const btnDown = document.createElement('button');
  btnDown.textContent = '↓';
  btnDown.classList.add('ActionDown');
  btnDown.style.width = '33%';
  div.appendChild(btnDown);

  const btnUp = document.createElement('button');
  btnUp.textContent = '↑';
  btnUp.classList.add('ActionUp');
  btnUp.style.width = '33%';
  div.appendChild(btnUp);

  const btnRm = document.createElement('button');
  btnRm.textContent = '×';
  btnRm.classList.add('ActionRemove');
  btnRm.style.width = '33%';
  div.appendChild(btnRm);

  return div;
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
    li.appendChild(btns());
    return li;
  }

  json() {
    return {
      "_type": "MoveLine",
      "distance": "" + this.distance
    };
  }

  modalhtml() {
    const range = new Range();
    return range.html();
  }

  modalvalidate(dom) {
    this.set_distance(dom.getElementsByTagName("canvas")[0].range.value/100);
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
    li.appendChild(btns());
    return li;
  }

  json() {
    return {
      "_type": "MoveRotate",
      "angle": "" + this.angle
    };
  }

  modalhtml() {
    const dial = new Dial();
    return dial.html();
  }

  modalvalidate(dom) {
    this.set_angle(dom.getElementsByTagName("canvas")[0].dial.value);
  }
}

class FlagAction {
  static label = 'Actionner le drapeau';

  constructor() {
    this.updown = "up";
    this.updown_notvalidated = "up";
  }

  li() {
    const li = document.createElement('li');
    if (this.updown == "up") {
      li.textContent = "Lever le drapeau";
    } else {
      li.textContent = "Baisser le drapeau";
    }
    li.appendChild(btns());
    return li;
  }

  json() {
    if (this.updown == "up") {
      return {
        "_type": "Include",
        "prog_name": "action__drapeau"
      };
    } else {
      return {
        "_type": "Include",
        "prog_name": "action__drapeau_down"
      };
    }
  }

  modalhtml() {
    const frag = document.createDocumentFragment();
    const btnUp = document.createElement('button');
    const btnDown = document.createElement('button');

    btnUp.classList.add("btn-success");

    btnUp.textContent = 'Lever';
    btnUp.onclick = () => {
      btnUp.classList.add("btn-success");
      btnDown.classList.remove("btn-success");
      this.updown_notvalidated = "up";
    }
    frag.appendChild(btnUp);

    frag.appendChild(document.createElement("br"));
    frag.appendChild(document.createElement("br"));

    btnDown.textContent = 'Baisser';
    btnDown.onclick = () => {
      btnUp.classList.remove("btn-success");
      btnDown.classList.add("btn-success");
      this.updown_notvalidated = "down";
    }
    frag.appendChild(btnDown);

    return frag;
  }

  modalvalidate(dom) {
    this.updown = this.updown_notvalidated;
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
    for (const btn of li.getElementsByClassName('ActionUp')) {
      btn.addEventListener('click', e => actionlist.up(action));
    }
    for (const btn of li.getElementsByClassName('ActionDown')) {
      btn.addEventListener('click', e => actionlist.down(action));
    }
    for (const btn of li.getElementsByClassName('ActionRemove')) {
      btn.addEventListener('click', e => actionlist.remove(action));
    }
    this.ul.appendChild(li);
  }

  refresh_dom() {
    this.ul.innerHTML = '';
    for (const e of this.list) {
      this.add_dom(e);
    }
  }

  up(action) {
    const idx = this.list.indexOf(action);
    if (idx < 1) return;
    const e = this.list[idx];
    this.list.splice(idx, 1);
    this.list.splice(idx-1, 0, e);
    this.refresh_dom();
  }

  down(action) {
    const idx = this.list.indexOf(action);
    if (idx > this.list.length - 2) return;
    const e = this.list[idx+1];
    this.list.splice(idx+1, 1);
    this.list.splice(idx, 0, e);
    this.refresh_dom();
  }

  remove(action) {
    const idx = this.list.indexOf(action);
    if (idx > -1) this.list.splice(idx, 1);
    this.refresh_dom();
  }

  save(url, fct) {
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
    xhr.onload = () => {
      fct(xhr.status);
    };
    xhr.send(JSON.stringify(json));
  }

  static get_button_list_fragment() {
    const fragment = document.createDocumentFragment();
    for (const c of [MoveAction, RotateAction, FlagAction]) {
      const btn = document.createElement('button');
      btn.textContent  = c.label;
      btn.classList.add("ActionButton");
      btn.actionclass = c;
      fragment.appendChild(btn);
      fragment.appendChild(document.createElement('br'));
      fragment.appendChild(document.createElement('br'));
    }
    return fragment;
  }
}
