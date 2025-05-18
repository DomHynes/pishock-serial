import { EventEmitter } from 'events';
import { SerialPiShock } from '../src';
import { LINE_ENDING } from '../src/constants';
import { MOCK_TERMINAL_INFO } from './constants';

class MockSerialPort extends EventEmitter {
  public write = jest.fn();
}

describe('SerialPiShock', () => {
  let mockSerialPort = new MockSerialPort();

  beforeEach(() => {
    mockSerialPort = new MockSerialPort();
  });

  afterEach(() => {
    mockSerialPort.removeAllListeners();
  });

  it('getInfo promise resolves', async () => {
    // @ts-ignore
    const pishock = new SerialPiShock(mockSerialPort);

    const infoFuture = pishock.getInfo();

    mockSerialPort.emit('data', MOCK_TERMINAL_INFO);

    const info = await infoFuture;

    expect(info.type).toEqual(4);
  });

  it('can get shockers', async () => {
    // @ts-ignore
    const pishock = new SerialPiShock(mockSerialPort);

    const [shockers] = await Promise.all([
      pishock.getShockers(),
      mockSerialPort.emit('data', MOCK_TERMINAL_INFO),
    ]);

    expect(shockers).toHaveLength(1);
    expect(shockers[0].id).toEqual('420');
  });

  it('shockers write to parent serial port', async () => {
    // @ts-ignore
    const pishock = new SerialPiShock(mockSerialPort);

    const [[shocker]] = await Promise.all([
      pishock.getShockers(),
      mockSerialPort.emit('data', MOCK_TERMINAL_INFO),
    ]);

    let payload = '';

    mockSerialPort.write.mockImplementationOnce(
      (cmd: string) => (payload = cmd)
    );

    shocker.shock({ duration: 100, intensity: 100 });

    expect(payload).toEqual(
      JSON.stringify({
        cmd: 'operate',
        value: {
          id: '420',
          op: 'shock',
          duration: 100,
          intensity: 100,
        },
      }) + LINE_ENDING
    );
  });
});
