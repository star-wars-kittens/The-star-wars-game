import { MillenniumFalcon } from './MillenniumFalcon';
import { Bullet } from './Bullet';
import { CloneShip } from './CloneShip';

export default class Display {
  private score = 0;

  private readonly _context: CanvasRenderingContext2D;
  public width = 0;
  public height = 0;
  private setGameInfo: any;

  private interval: ReturnType<typeof setInterval> | undefined;

  private millenniumFalcon: MillenniumFalcon;
  private bullets: Array<Bullet> = [];
  private cloneShips: Array<CloneShip> = [];

  constructor(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    setGameInfo: any
  ) {
    this._context = context;
    this.width = width;
    this.height = height;
    this.setGameInfo = setGameInfo;

    this.millenniumFalcon = new MillenniumFalcon(this);
  }

  public get context() {
    return this._context;
  }

  draw = () => {
    this.context.clearRect(0, 0, this.width, this.height);

    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.width, this.height);

    this.millenniumFalcon.draw();

    if (this.millenniumFalcon.health > 70) this.context.fillStyle = 'green';
    if (this.millenniumFalcon.health < 70) this.context.fillStyle = 'yellow';
    if (this.millenniumFalcon.health < 30) this.context.fillStyle = 'red';

    this.context.fillRect(10, 10, this.millenniumFalcon.health, 10);

    this.context.fillStyle = 'yellow';
    this.context.font = 'bold 46px Arial';
    this.context.fillText(String(this.score), this.width - 50, 50);

    if (this.bullets.length > 0) {
      this.bullets = this.bullets.filter((bullet) => {
        if (bullet.isVisible) {
          this.context.fillStyle = 'red';
          this.context.fillRect(
            bullet.x,
            bullet.y,
            bullet.width,
            bullet.height
          );
          bullet.update();
          if (bullet.y > 0) {
            return true;
          }
        }
        bullet.clearSelf();
        return false;
      });
    }

    if (this.cloneShips.length > 0) {
      this.cloneShips = this.cloneShips.filter((cloneShip) => {
        if (cloneShip.isVisible) {
          cloneShip.draw();

          cloneShip.update();
          if (cloneShip.y < this.height) {
            return true;
          }
        }
        if (!cloneShip.isVisible) {
          this.score++;
        }
        cloneShip.clearSelf();
        return false;
      });
    }
  };

  public activeActions: { [index: string]: boolean } = {
    upUpdate: false,
    downUpdate: false,
    RRrightUpdate: false,
    leftUpdate: false,
    fireUpdate: false,
  };

  upUpdate = () => {
    if (this.millenniumFalcon.y > 50)
      this.millenniumFalcon.update({ moveX: 0, moveY: -10 });
  };

  downUpdate = () => {
    if (this.millenniumFalcon.y < this.height - 100)
      this.millenniumFalcon.update({ moveX: 0, moveY: 10 });
  };

  RRrightUpdate = () => {
    if (this.millenniumFalcon.x < this.width - 100)
      this.millenniumFalcon.update({ moveX: 10, moveY: 0 });
  };

  leftUpdate = () => {
    if (this.millenniumFalcon.x > 50)
      this.millenniumFalcon.update({ moveX: -10, moveY: 0 });
  };

  fireUpdate = () => {
    if (this.reload) {
      this.bullets.push(
        new Bullet(this.millenniumFalcon.x, this.millenniumFalcon.y)
      );
      this.reload = false;
    }
  };

  reload = true;

  buttonDownHandler = (e: any) => {
    //UP
    if (e.keyCode === 38) {
      this.activeActions.upUpdate = true;
    }
    //DOWN
    if (e.keyCode === 40) {
      this.activeActions.downUpdate = true;
    }
    //LEFT
    if (e.keyCode === 37) {
      this.activeActions.leftUpdate = true;
    }
    //RIGHT
    if (e.keyCode === 39) {
      this.activeActions.RRrightUpdate = true;
    }

    //fire
    if (e.keyCode === 32) {
      this.activeActions.fireUpdate = true;
    }
  };
  buttonUpHandler = (e: any) => {
    //UP
    if (e.keyCode === 38) {
      this.activeActions.upUpdate = false;
    }
    //DOWN
    if (e.keyCode === 40) {
      this.activeActions.downUpdate = false;
    }
    //LEFT
    if (e.keyCode === 37) {
      this.activeActions.leftUpdate = false;
    }
    //RIGHT
    if (e.keyCode === 39) {
      this.activeActions.RRrightUpdate = false;
    }

    //fire
    if (e.keyCode === 32) {
      this.activeActions.fireUpdate = false;
    }
  };

  public init = () => {
    this.interval = setInterval(() => {
      this.reload = true;
    }, 500);

    setInterval(() => {
      this.cloneShips.push(new CloneShip(this, this.width));
    }, 1000);
  };

  update = () => {
    Object.entries(this.activeActions).forEach(([key, value]) => {
      if (value && Object.keys(this).includes(key)) {
        if (
          key === 'upUpdate' ||
          key === 'downUpdate' ||
          key === 'RRrightUpdate' ||
          key === 'leftUpdate' ||
          key === 'fireUpdate'
        ) {
          this[key]();
        }
      }
    });

    if (this.millenniumFalcon.health > 0) {
      this.draw();
    } else {
      this.setGameInfo();
    }
  };
}
