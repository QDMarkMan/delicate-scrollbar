/** ---------------------------------------------------------------------------------------------
 *  @Author [ETongfu].
 *  @Des [main part].
 *-------------------------------------------------------------------------------------------- */
/**
 * DelicateScrollbar Core
 * @export
 * @class DelicateScrollbar
 */
export default class DelicateScrollbar {
  element: HTMLElement
  constructor (el: any, options: Object) {
    // start
    this.element = typeof el === 'string' ? document.querySelector(el): el
  }
  /**
   * init class
   * @param {*HTMLElement} el
   */
  init() {
    // if (typeof el == 'string')
  }

  render () {
    // render content
  }
}
