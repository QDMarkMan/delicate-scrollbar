/** ---------------------------------------------------------------------------------------------
 *  @Author [ETongfu].
 *  @Des [DOM util].
 *-------------------------------------------------------------------------------------------- */
interface IDomClassList {
	hasClass(node: HTMLElement | SVGElement, className: string): boolean;
	addClass(node: HTMLElement | SVGElement, className: string): void;
	addClasses(node: HTMLElement | SVGElement, ...classNames: string[]): void;
	removeClass(node: HTMLElement | SVGElement, className: string): void;
	removeClasses(node: HTMLElement | SVGElement, ...classNames: string[]): void;
	toggleClass(node: HTMLElement | SVGElement, className: string, shouldHaveIt?: boolean): void;
}

const _classList: IDomClassList = new class implements IDomClassList {
	hasClass(node: HTMLElement, className: string): boolean {
		return Boolean(className) && node.classList && node.classList.contains(className);
	}

	addClasses(node: HTMLElement, ...classNames: string[]): void {
		classNames.forEach(nameValue => nameValue.split(' ').forEach(name => this.addClass(node, name)));
	}

	addClass(node: HTMLElement, className: string): void {
		if (className && node.classList) {
			node.classList.add(className);
		}
	}

	removeClass(node: HTMLElement, className: string): void {
		if (className && node.classList) {
			node.classList.remove(className);
		}
	}

	removeClasses(node: HTMLElement, ...classNames: string[]): void {
		classNames.forEach(nameValue => nameValue.split(' ').forEach(name => this.removeClass(node, name)));
	}

	toggleClass(node: HTMLElement, className: string, shouldHaveIt?: boolean): void {
		if (node.classList) {
			node.classList.toggle(className, shouldHaveIt);
		}
	}
};
export const toggleClass: (node: HTMLElement | SVGElement, className: string, shouldHaveIt?: boolean) => void = _classList.toggleClass.bind(_classList);
