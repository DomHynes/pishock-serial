import { LINE_ENDING } from '../src/constants';

export const MOCK_TERMINAL_INFO =
  'TERMINALINFO: ' +
  JSON.stringify({
    version: '3.1.1.231119.1556',
    type: 4,
    connected: false,
    clientId: 621,
    wifi: 'My WiFi',
    server: 'eu1.pishock.com',
    macAddress: '0C:B8:15:AB:CD:EF',
    shockers: [
      {
        id: 420,
        type: 1,
        paused: false,
      },
    ],
    networks: [
      {
        ssid: 'My WiFi',
        password: 'hunter2',
      },
      {
        ssid: 'PiShock',
        password: 'Zappy454',
      },
    ],
    otk: 'e71d7b27-dc38-4774-bafc-c427757f0134',
    claimed: true,
    isDev: false,
    publisher: false,
    polled: true,
    subscriber: true,
    publicIp: '203.0.113.69',
    internet: true,
    ownerId: 6969,
  }) +
  LINE_ENDING;
