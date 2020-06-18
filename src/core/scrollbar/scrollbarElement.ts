/** ---------------------------------------------------------------------------------------------
 *  @Author [ETongfu].
 *  @Des [ScrollableElement Core].
 *-------------------------------------------------------------------------------------------- */
import { ScrollableElementOptions } from '../interface/options'
// import { FastDomNode, createFastDomNode } from '../utils/fastDomNode'
// const HIDE_TIMEOUT = 500;
// const SCROLL_WHEEL_SENSITIVITY = 50;
// const SCROLL_WHEEL_SMOOTH_SCROLL_ENABLED = true;
export abstract class AbstractScrollableElement {

	private readonly _options: ScrollableElementOptions;
	private readonly _domNode: HTMLElement;

	protected constructor(element: HTMLElement, options: ScrollableElementOptions) {
		element.style.overflow = 'hidden';
		this._options = options
		this._domNode = element
	}

	public dispose(): void {

	}

	/**
	 * Get the generated 'scrollable' dom node
	 */
	public getDomNode(): HTMLElement {
		return this._domNode;
	}

	public getOverviewRulerLayoutInfo() {
		return {
			parent: this._domNode,
		};
	}

	/**
	 * Update configuration options for the scrollbar.
	 * Really this is Editor.IEditorScrollbarOptions, but base shouldn't
	 * depend on Editor.
	 */
	public updateOptions(newOptions: ScrollableElementOptions): void {

	}

	public setRevealOnScroll(value: boolean) {

	}


	/**
	 * Render / mutate the DOM now.
	 * Should be used together with the ctor option `lazyRender`.
	 */
	public renderNow(): void {
		if (!this._options.lazyRender) {
			throw new Error('Please use `lazyRender` together with `renderNow`!');
		}

		this._render();
	}

	private _render(): void {

	}
}



function resolveOptions(opts: ScrollableElementOptions): ScrollableElementOptions {
	let result: ScrollableElementOptions = {
		lazyRender: (typeof opts.lazyRender !== 'undefined' ? opts.lazyRender : false),
		className: (typeof opts.className !== 'undefined' ? opts.className : ''),
		useShadows: (typeof opts.useShadows !== 'undefined' ? opts.useShadows : true),
		handleMouseWheel: (typeof opts.handleMouseWheel !== 'undefined' ? opts.handleMouseWheel : true),
		flipAxes: (typeof opts.flipAxes !== 'undefined' ? opts.flipAxes : false),
		alwaysConsumeMouseWheel: (typeof opts.alwaysConsumeMouseWheel !== 'undefined' ? opts.alwaysConsumeMouseWheel : false),
		scrollYToX: (typeof opts.scrollYToX !== 'undefined' ? opts.scrollYToX : false),
		mouseWheelScrollSensitivity: (typeof opts.mouseWheelScrollSensitivity !== 'undefined' ? opts.mouseWheelScrollSensitivity : 1),
		fastScrollSensitivity: (typeof opts.fastScrollSensitivity !== 'undefined' ? opts.fastScrollSensitivity : 5),
		scrollPredominantAxis: (typeof opts.scrollPredominantAxis !== 'undefined' ? opts.scrollPredominantAxis : true),
		mouseWheelSmoothScroll: (typeof opts.mouseWheelSmoothScroll !== 'undefined' ? opts.mouseWheelSmoothScroll : true),
		arrowSize: (typeof opts.arrowSize !== 'undefined' ? opts.arrowSize : 11),

		horizontalScrollbarSize: (typeof opts.horizontalScrollbarSize !== 'undefined' ? opts.horizontalScrollbarSize : 10),
		horizontalSliderSize: (typeof opts.horizontalSliderSize !== 'undefined' ? opts.horizontalSliderSize : 0),
		horizontalHasArrows: (typeof opts.horizontalHasArrows !== 'undefined' ? opts.horizontalHasArrows : false),

		verticalScrollbarSize: (typeof opts.verticalScrollbarSize !== 'undefined' ? opts.verticalScrollbarSize : 10),
		verticalHasArrows: (typeof opts.verticalHasArrows !== 'undefined' ? opts.verticalHasArrows : false),
		verticalSliderSize: (typeof opts.verticalSliderSize !== 'undefined' ? opts.verticalSliderSize : 0)
	};

	result.horizontalSliderSize = (typeof opts.horizontalSliderSize !== 'undefined' ? opts.horizontalSliderSize : result.horizontalScrollbarSize);
	result.verticalSliderSize = (typeof opts.verticalSliderSize !== 'undefined' ? opts.verticalSliderSize : result.verticalScrollbarSize);

	// Defaults are different on Macs
	// if (platform.isMacintosh) {
	// 	result.className += ' mac';
	// }

	return result;
}
