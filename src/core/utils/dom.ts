/** ---------------------------------------------------------------------------------------------
 *  @Author [ETongfu].
 *  @Des [DOM util].
 *-------------------------------------------------------------------------------------------- */

export const toggleClass: (node: HTMLElement | SVGElement, className: string, shouldHaveIt?: boolean) => void = _classList.toggleClass.bind(_classList);
