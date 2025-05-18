import { SerialPort } from 'serialport';
import { SerialPiShock } from './pishock';
import { Shocker } from './shocker';
/*
    path: 'COM3',
    manufacturer: 'wch.cn',
    serialNumber: '5&B6F046&0&2',
    pnpId: 'USB\\VID_1A86&PID_7523\\5&B6F046&0&2',
    locationId: 'Port_#0002.Hub_#0001',
    friendlyName: 'USB-SERIAL CH340 (COM3)',
    vendorId: '1A86',
    productId: '7523'
*/

const VENDOR_ID = '1A86';
const PRODUCT_ID = '7523';

const BAUD_RATE = 115200;

export async function getPiShock() {
  const allDevices = await SerialPort.list();
  const pishocks = allDevices.filter(
    device => device.vendorId === VENDOR_ID && device.productId === PRODUCT_ID
  );

  if (!pishocks[0]) throw new Error('could not find pishock');

  const pishock = new SerialPiShock(
    new SerialPort({ path: pishocks[0].path, baudRate: BAUD_RATE })
  );

  await pishock.getInfo();

  return pishock;
}

export { SerialPiShock, Shocker };
