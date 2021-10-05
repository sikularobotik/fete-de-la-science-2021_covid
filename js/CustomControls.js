export class Range {
  constructor() {
    this.min = -100
    this.max = 100
    this.value = 0;
    this.p = 15;
    this.h = 15;

    const canvas = document.createElement("canvas");
    canvas.width = 530;
    canvas.height = 150;
    canvas.range = this;
    this.canvas = canvas;

    this.frag = document.createDocumentFragment();
    const btnline = document.createElement("div");
    btnline.classList.add("row");
    function btn(v, l, fct) {
      const div = document.createElement("div");
      div.classList.add("col-sm-2");
      const btn = document.createElement("button");
      btn.textContent = v > 0 ? '+' + v : v;
      btn.addEventListener("click", e => fct(v));
      div.appendChild(btn);
      l.appendChild(div)
    }
    for (const b of [-50, -10, -1, 1, 10, 50]) btn(b, btnline, v => this.set_value(this.value + v));

    this.frag.appendChild(canvas);
    this.frag.appendChild(btnline);

    this.redraw();

    canvas.addEventListener("click", e => {
      const r = e.target.getBoundingClientRect();
      this.value = Math.max(this.min, Math.min(Math.round((e.clientX-r.left-this.p)/(r.right-r.left-2*this.p)*(this.max-this.min)+this.min), this.max));
      this.redraw();
    });
  }

  set_value(v) {
    this.value = v;
    this.redraw();
  }

  redraw() {
    const c = this.canvas;
    const ctx = c.getContext("2d");

    ctx.clearRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#e5ff80";
    ctx.beginPath();
    ctx.rect(this.p, (c.height - this.h) / 2, c.width - 2 * this.p, this.h);
    ctx.fill();

    ctx.fillStyle = "#aad400";
    ctx.beginPath();
    const vp = Math.max(0, Math.min((this.value - this.min) / (this.max - this.min), 1));
    ctx.rect(
      this.p + (c.width - 2 * this.p) * vp,
      (c.height - this.h) / 2,
      (c.width - 2 * this.p) * (0.5 - vp),
      this.h
    );
    ctx.fill();

    ctx.fillStyle = "#ff6600";
    ctx.beginPath();
    ctx.rect(this.p - 3 + (c.width - 2 * this.p) * vp, (c.height - this.h) / 2 - 5, 5, this.h + 10);
    ctx.fill();

    ctx.font = '25px serif';
    const label = this.value + " cm";
    const tw = ctx.measureText(label).width;
    let tl = (c.width - 2 * this.p) * vp;
    if (tl + tw > c.width) tl = c.width - tw;
    ctx.fillText(label, tl, (c.height - this.h) / 2 - 15);
  }

  html() {
    return this.frag;
  }
}
