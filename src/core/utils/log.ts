/** ---------------------------------------------------------------------------------------------
 *  @Author [ETongfu].
 *  @Date [2020-06-10 17:56:28].
 *  @Des [Logs].
 *-------------------------------------------------------------------------------------------- */
export class Logger {
  prefix: String
  constructor (prefix: string = '') {
    this.prefix = prefix ? `[${prefix}]: ` : ''
  }

  log (info: string = '') :void {
    info && console.log(this.prefix + info)
  }

  warn (info: string = '') :void {
    info && console.warn(this.prefix + info)
  }

  error (info: string = '') :void {
    info && console.error(this.prefix + info)
  }
}