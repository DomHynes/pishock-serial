import { SerialPiShock } from './pishock';

export class Shocker {
  constructor(public readonly id: string, public parent: SerialPiShock) {}

  end() {
    this.write({
      cmd: 'operate',
      value: {
        id: this.id,
        op: 'end',
        duration: 0,
      },
    });
  }

  vibrate({ duration, intensity }: { duration: number; intensity: number }) {
    this.write({
      cmd: 'operate',
      value: {
        id: this.id,
        op: 'vibrate',
        duration,
        intensity,
      },
    });
  }

  shock({ duration, intensity }: { duration: number; intensity: number }) {
    this.write({
      cmd: 'operate',
      value: {
        id: this.id,
        op: 'shock',
        duration,
        intensity,
      },
    });
  }

  public write(data: any) {
    this.parent.write(data);
  }
}
