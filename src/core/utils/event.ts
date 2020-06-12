/** ---------------------------------------------------------------------------------------------
 *  @Author [ETongfu].
 *  @Date [2020-05-14 16:29:05].
 *  @Des [resize helper].
 *-------------------------------------------------------------------------------------------- */
/**
 * 
 * @param entries
 */
export const resizeHandler = function (entries) {
  for (const entry of entries) {
    const listeners = entry.target.__resizeListeners__ || []
    if (listeners.length > 0) {
      listeners.forEach(fn => {
        fn()
      })
    }
  }
}
