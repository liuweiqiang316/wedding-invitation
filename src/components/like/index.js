export class LikeEffect {
  constructor(canvas) {
    this.canvas = canvas;
    // 上下文对象
    this.ctx = this.canvas.getContext("2d");
    // 显示的图标
    this.iconList = [
      "😀",
      "❤️",
      "😻",
      "👏",
      "🤘",
      "🤩",
      "👍🏼",
      "🎈",
      "💕",
      "💓",
      "💘",
      "💝",
      "💖",
      "💞",
      "💋",
      "✨",
      "🎉",
      "🎉",
      "🎉",
      "🎊",
      "🎊",
      "🎊",
      "🎊",
      "🌸",
      "🌷",
      "🌺",
      "🌹",
      "🌹",
      "💐",
      "🥳",
    ];
    // 点击时显示的列表
    this.clickList = [];
    // 右小角显示的列表
    this.showList = [];
    // 初始化事件
    this.initEvent();
  }

  initEvent() {
    this.canvas.addEventListener("click", (e) => {
      console.log("%c 111 click", "color:red", e);
      const index = Math.floor(Math.random() * this.iconList.length);
      const o = {
        text: this.iconList[index],
        x: e.offsetX,
        y: e.offsetY,
        size: 40,
        alpha: 1,
        random: Math.random() > 0.5,
      };
      this.clickList.push(o);
      this.showList.push({
        ...o,
        x: this.canvas.width - 50,
        y: this.canvas.height - 50,
        angle: 0.4,
      });
    });
  }

  showClickList() {
    this.clickList = this.clickList.filter((v) => v.alpha > 0);
    this.clickList.forEach((o, i) => {
      this.drawText(o.text, o.x, o.y, o.size, `rgba(0, 0, 0, ${o.alpha})`);
      o.y -= 1;
      o.size += 2;
      o.alpha -= 5 / 200;
    });
  }

  showAll() {
    this.showList = this.showList.filter((v) => v.alpha > 0);
    this.showList.forEach((o, i) => {
      this.drawText(o.text, o.x, o.y, o.size, `rgba(0, 0, 0, ${o.alpha})`);
      o.x += Math.cos(2 * o.angle);
      o.y -= 5;
      o.angle += 0.1;
      o.alpha -= 5 / 300;
    });
  }

  drawText(text, x, y, fontSize, color = "#000") {
    this.ctx.beginPath();
    this.ctx.font = `${fontSize}px 楷体`;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(text, x, y);
    this.ctx.closePath();
  }

  /**
   * 渲染函数
   */
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.showClickList();
    // this.showAll();
    requestAnimationFrame(this.render.bind(this));
  }
}

export default LikeEffect;
