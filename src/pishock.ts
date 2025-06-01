import { EventEmitter } from 'node:events'
import { SerialPort } from 'serialport'
import { LINE_ENDING } from './constants'
import { Logger } from './logger'
import { Shocker } from './shocker'

export type PiShockDeviceInfo = {
  version: string // The running firmware version
  type: 3 | 4 // Hardware type: 3 for Next, 4 for Lite
  connected: boolean // Is the PiShock connected to the server?
  clientId: number // The ID of the PiShock (as shown on the website)
  wifi: string // The WiFi the PiShock is connected to
  server: string // The server the PiShock is connected to
  macAddress: string // The MAC of the PiShock
  shockers: Array<{
    id: number // The shocker ID (as shown on the website)
    type: 0 | 1 // 0 for Petrainer (old) 1 for SmallOne (new)
    paused: boolean // Whether this shocker is currently paused
  }>
  networks: Array<{
    ssid: string
    password: string
  }>
  otk: string // The one-time key which was used for pairing
  claimed: boolean // Whether this PiShock was claimed via the OTK
  isDev: boolean // Whether the PiShock is configured to connect to a dev server
  publisher: boolean // Whether the PiShock is connected as publisher
  polled: boolean // Whether the PiShock has polled the server
  subscriber: boolean // Whether the PiShock is connected as subscriber
  publicIp: string // The public IP of the PiShock
  internet: boolean // Whether we have an internet connection
  ownerId: number // The ID of the user that claimed the PiShock
}

type Events = {
  info: [PiShockDeviceInfo]
  shockers: [Shocker[]]
}

export class SerialPiShock extends EventEmitter<Events> {
  constructor(
    private port = new SerialPort({ path: 'COM4', baudRate: 115200 }),
  ) {
    super()
    this.line = []
    port.on('data', this.handleData)
    port.on('error', (err) =>
      this.logger.error({ err: err.toString() }, 'porterror'),
    )
  }

  private logger = Logger.child({ module: 'SerialPiShock' })

  private line: string[]

  public shockers: Shocker[] = []

  public async getInfo() {
    this.logger.info('getInfo')
    const infoFuture = new Promise<PiShockDeviceInfo>((resolve) => {
      this.once('info', (data) => resolve(data))
    })

    this.info()

    return infoFuture
  }

  async getShockers(): Promise<Shocker[]> {
    this.logger.info('getShockers')

    const info = await this.getInfo()

    const shockers = info.shockers.map((s) => new Shocker(String(s.id), this))
    this.shockers = shockers

    return shockers
  }

  handleData = (line: any) => {
    const newData: string = line.toString()

    for (const char of newData) {
      this.line.push(char)

      if (char === '\n' && this.line.slice(-2).join('') === '\r\n') {
        const str = this.line.join('')

        this.line = []

        if (str.startsWith('TERMINALINFO: ')) {
          const infoBlock: PiShockDeviceInfo = JSON.parse(
            str.replace('TERMINALINFO: ', ''),
          )
          this.logger.info({ event: 'info' }, str)
          this.emit('info', infoBlock)

          return
        }

        this.logger.trace(str)
      }
    }
  }

  info() {
    this.write({ cmd: 'info' })
  }

  public write(data: any) {
    this.port.write(JSON.stringify(data) + LINE_ENDING, (err) => {
      if (err) {
        console.error('Error on write: ', err)
      } else {
        console.log('➡️: ', data)
      }
    })
  }
}
