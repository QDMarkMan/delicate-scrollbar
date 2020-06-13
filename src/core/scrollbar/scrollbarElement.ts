/** ---------------------------------------------------------------------------------------------
 *  @Author [ETongfu].
 *  @Des [ScrollableElement Core].
 *-------------------------------------------------------------------------------------------- */
import { ScrollableElementOptions } from '../interface/options'
import { FastDomNode, createFastDomNode } from '../utils/fastDomNode'
export abstract class AbstractScrollableElement {

	private readonly _options: ScrollableElementOptions;
	protected readonly _scrollable: Scrollable;
	private readonly _verticalScrollbar: VerticalScrollbar;
	private readonly _horizontalScrollbar: HorizontalScrollbar;
	private readonly _domNode: HTMLElement;

	private readonly _leftShadowDomNode: FastDomNode<HTMLElement> | null;
	private readonly _topShadowDomNode: FastDomNode<HTMLElement> | null;
	private readonly _topLeftShadowDomNode: FastDomNode<HTMLElement> | null;

	private readonly _listenOnDomNode: HTMLElement;

	private _mouseWheelToDispose: IDisposable[];

	private _isDragging: boolean;
	private _mouseIsOver: boolean;

	private readonly _hideTimeout: TimeoutTimer;
	private _shouldRender: boolean;

	private _revealOnScroll: boolean;

	private readonly _onScroll = this._register(new Emitter<ScrollEvent>());
	public readonly onScroll: Event<ScrollEvent> = this._onScroll.event;

	private readonly _onWillScroll = this._register(new Emitter<ScrollEvent>());
	public readonly onWillScroll: Event<ScrollEvent> = this._onWillScroll.event;

	protected constructor(element: HTMLElement, options: ScrollableElementCreationOptions, scrollable: Scrollable) {
		super();
		element.style.overflow = 'hidden';
		this._options = resolveOptions(options);
		this._scrollable = scrollable;

		this._register(this._scrollable.onScroll((e) => {
			this._onWillScroll.fire(e);
			this._onDidScroll(e);
			this._onScroll.fire(e);
		}));

		let scrollbarHost: ScrollbarHost = {
			onMouseWheel: (mouseWheelEvent: StandardWheelEvent) => this._onMouseWheel(mouseWheelEvent),
			onDragStart: () => this._onDragStart(),
			onDragEnd: () => this._onDragEnd(),
		};
		this._verticalScrollbar = this._register(new VerticalScrollbar(this._scrollable, this._options, scrollbarHost));
		this._horizontalScrollbar = this._register(new HorizontalScrollbar(this._scrollable, this._options, scrollbarHost));

		this._domNode = document.createElement('div');
		this._domNode.className = 'monaco-scrollable-element ' + this._options.className;
		this._domNode.setAttribute('role', 'presentation');
		this._domNode.style.position = 'relative';
		this._domNode.style.overflow = 'hidden';
		this._domNode.appendChild(element);
		this._domNode.appendChild(this._horizontalScrollbar.domNode.domNode);
		this._domNode.appendChild(this._verticalScrollbar.domNode.domNode);

		if (this._options.useShadows) {
			this._leftShadowDomNode = createFastDomNode(document.createElement('div'));
			this._leftShadowDomNode.setClassName('shadow');
			this._domNode.appendChild(this._leftShadowDomNode.domNode);

			this._topShadowDomNode = createFastDomNode(document.createElement('div'));
			this._topShadowDomNode.setClassName('shadow');
			this._domNode.appendChild(this._topShadowDomNode.domNode);

			this._topLeftShadowDomNode = createFastDomNode(document.createElement('div'));
			this._topLeftShadowDomNode.setClassName('shadow top-left-corner');
			this._domNode.appendChild(this._topLeftShadowDomNode.domNode);
		} else {
			this._leftShadowDomNode = null;
			this._topShadowDomNode = null;
			this._topLeftShadowDomNode = null;
		}

		this._listenOnDomNode = this._options.listenOnDomNode || this._domNode;

		this._mouseWheelToDispose = [];
		this._setListeningToMouseWheel(this._options.handleMouseWheel);

		this.onmouseover(this._listenOnDomNode, (e) => this._onMouseOver(e));
		this.onnonbubblingmouseout(this._listenOnDomNode, (e) => this._onMouseOut(e));

		this._hideTimeout = this._register(new TimeoutTimer());
		this._isDragging = false;
		this._mouseIsOver = false;

		this._shouldRender = true;

		this._revealOnScroll = true;
	}

	public dispose(): void {
		this._mouseWheelToDispose = dispose(this._mouseWheelToDispose);
		super.dispose();
	}

	/**
	 * Get the generated 'scrollable' dom node
	 */
	public getDomNode(): HTMLElement {
		return this._domNode;
	}

	public getOverviewRulerLayoutInfo(): IOverviewRulerLayoutInfo {
		return {
			parent: this._domNode,
			insertBefore: this._verticalScrollbar.domNode.domNode,
		};
	}

	/**
	 * Delegate a mouse down event to the vertical scrollbar.
	 * This is to help with clicking somewhere else and having the scrollbar react.
	 */
	public delegateVerticalScrollbarMouseDown(browserEvent: IMouseEvent): void {
		this._verticalScrollbar.delegateMouseDown(browserEvent);
	}

	public getScrollDimensions(): IScrollDimensions {
		return this._scrollable.getScrollDimensions();
	}

	public setScrollDimensions(dimensions: INewScrollDimensions): void {
		this._scrollable.setScrollDimensions(dimensions, false);
	}

	/**
	 * Update the class name of the scrollable element.
	 */
	public updateClassName(newClassName: string): void {
		this._options.className = newClassName;
		// Defaults are different on Macs
		if (platform.isMacintosh) {
			this._options.className += ' mac';
		}
		this._domNode.className = 'monaco-scrollable-element ' + this._options.className;
	}

	/**
	 * Update configuration options for the scrollbar.
	 * Really this is Editor.IEditorScrollbarOptions, but base shouldn't
	 * depend on Editor.
	 */
	public updateOptions(newOptions: ScrollableElementChangeOptions): void {
		if (typeof newOptions.handleMouseWheel !== 'undefined') {
			this._options.handleMouseWheel = newOptions.handleMouseWheel;
			this._setListeningToMouseWheel(this._options.handleMouseWheel);
		}
		if (typeof newOptions.mouseWheelScrollSensitivity !== 'undefined') {
			this._options.mouseWheelScrollSensitivity = newOptions.mouseWheelScrollSensitivity;
		}
		if (typeof newOptions.fastScrollSensitivity !== 'undefined') {
			this._options.fastScrollSensitivity = newOptions.fastScrollSensitivity;
		}
		if (typeof newOptions.scrollPredominantAxis !== 'undefined') {
			this._options.scrollPredominantAxis = newOptions.scrollPredominantAxis;
		}
		if (typeof newOptions.horizontalScrollbarSize !== 'undefined') {
			this._horizontalScrollbar.updateScrollbarSize(newOptions.horizontalScrollbarSize);
		}

		if (!this._options.lazyRender) {
			this._render();
		}
	}

	public setRevealOnScroll(value: boolean) {
		this._revealOnScroll = value;
	}

	public triggerScrollFromMouseWheelEvent(browserEvent: IMouseWheelEvent) {
		this._onMouseWheel(new StandardWheelEvent(browserEvent));
	}

	// -------------------- mouse wheel scrolling --------------------

	private _setListeningToMouseWheel(shouldListen: boolean): void {
		let isListening = (this._mouseWheelToDispose.length > 0);

		if (isListening === shouldListen) {
			// No change
			return;
		}

		// Stop listening (if necessary)
		this._mouseWheelToDispose = dispose(this._mouseWheelToDispose);

		// Start listening (if necessary)
		if (shouldListen) {
			let onMouseWheel = (browserEvent: IMouseWheelEvent) => {
				this._onMouseWheel(new StandardWheelEvent(browserEvent));
			};

			this._mouseWheelToDispose.push(dom.addDisposableListener(this._listenOnDomNode, dom.EventType.MOUSE_WHEEL, onMouseWheel, { passive: false }));
		}
	}

	private _onMouseWheel(e: StandardWheelEvent): void {

		const classifier = MouseWheelClassifier.INSTANCE;
		if (SCROLL_WHEEL_SMOOTH_SCROLL_ENABLED) {
			if (platform.isWindows) {
				// On Windows, the incoming delta events are multiplied with the device pixel ratio,
				// so to get a better classification, simply undo that.
				classifier.accept(Date.now(), e.deltaX / window.devicePixelRatio, e.deltaY / window.devicePixelRatio);
			} else {
				classifier.accept(Date.now(), e.deltaX, e.deltaY);
			}
		}

		// console.log(`${Date.now()}, ${e.deltaY}, ${e.deltaX}`);

		if (e.deltaY || e.deltaX) {
			let deltaY = e.deltaY * this._options.mouseWheelScrollSensitivity;
			let deltaX = e.deltaX * this._options.mouseWheelScrollSensitivity;

			if (this._options.scrollPredominantAxis) {
				if (Math.abs(deltaY) >= Math.abs(deltaX)) {
					deltaX = 0;
				} else {
					deltaY = 0;
				}
			}

			if (this._options.flipAxes) {
				[deltaY, deltaX] = [deltaX, deltaY];
			}

			// Convert vertical scrolling to horizontal if shift is held, this
			// is handled at a higher level on Mac
			const shiftConvert = !platform.isMacintosh && e.browserEvent && e.browserEvent.shiftKey;
			if ((this._options.scrollYToX || shiftConvert) && !deltaX) {
				deltaX = deltaY;
				deltaY = 0;
			}

			if (e.browserEvent && e.browserEvent.altKey) {
				// fastScrolling
				deltaX = deltaX * this._options.fastScrollSensitivity;
				deltaY = deltaY * this._options.fastScrollSensitivity;
			}

			const futureScrollPosition = this._scrollable.getFutureScrollPosition();

			let desiredScrollPosition: INewScrollPosition = {};
			if (deltaY) {
				const desiredScrollTop = futureScrollPosition.scrollTop - SCROLL_WHEEL_SENSITIVITY * deltaY;
				this._verticalScrollbar.writeScrollPosition(desiredScrollPosition, desiredScrollTop);
			}
			if (deltaX) {
				const desiredScrollLeft = futureScrollPosition.scrollLeft - SCROLL_WHEEL_SENSITIVITY * deltaX;
				this._horizontalScrollbar.writeScrollPosition(desiredScrollPosition, desiredScrollLeft);
			}

			// Check that we are scrolling towards a location which is valid
			desiredScrollPosition = this._scrollable.validateScrollPosition(desiredScrollPosition);

			if (futureScrollPosition.scrollLeft !== desiredScrollPosition.scrollLeft || futureScrollPosition.scrollTop !== desiredScrollPosition.scrollTop) {

				const canPerformSmoothScroll = (
					SCROLL_WHEEL_SMOOTH_SCROLL_ENABLED
					&& this._options.mouseWheelSmoothScroll
					&& classifier.isPhysicalMouseWheel()
				);

				if (canPerformSmoothScroll) {
					this._scrollable.setScrollPositionSmooth(desiredScrollPosition);
				} else {
					this._scrollable.setScrollPositionNow(desiredScrollPosition);
				}
				this._shouldRender = true;
			}
		}

		if (this._options.alwaysConsumeMouseWheel || this._shouldRender) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	private _onDidScroll(e: ScrollEvent): void {
		this._shouldRender = this._horizontalScrollbar.onDidScroll(e) || this._shouldRender;
		this._shouldRender = this._verticalScrollbar.onDidScroll(e) || this._shouldRender;

		if (this._options.useShadows) {
			this._shouldRender = true;
		}

		if (this._revealOnScroll) {
			this._reveal();
		}

		if (!this._options.lazyRender) {
			this._render();
		}
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
		if (!this._shouldRender) {
			return;
		}

		this._shouldRender = false;

		this._horizontalScrollbar.render();
		this._verticalScrollbar.render();

		if (this._options.useShadows) {
			const scrollState = this._scrollable.getCurrentScrollPosition();
			let enableTop = scrollState.scrollTop > 0;
			let enableLeft = scrollState.scrollLeft > 0;

			this._leftShadowDomNode!.setClassName('shadow' + (enableLeft ? ' left' : ''));
			this._topShadowDomNode!.setClassName('shadow' + (enableTop ? ' top' : ''));
			this._topLeftShadowDomNode!.setClassName('shadow top-left-corner' + (enableTop ? ' top' : '') + (enableLeft ? ' left' : ''));
		}
	}

	// -------------------- fade in / fade out --------------------

	private _onDragStart(): void {
		this._isDragging = true;
		this._reveal();
	}

	private _onDragEnd(): void {
		this._isDragging = false;
		this._hide();
	}

	private _onMouseOut(e: IMouseEvent): void {
		this._mouseIsOver = false;
		this._hide();
	}

	private _onMouseOver(e: IMouseEvent): void {
		this._mouseIsOver = true;
		this._reveal();
	}

	private _reveal(): void {
		this._verticalScrollbar.beginReveal();
		this._horizontalScrollbar.beginReveal();
		this._scheduleHide();
	}

	private _hide(): void {
		if (!this._mouseIsOver && !this._isDragging) {
			this._verticalScrollbar.beginHide();
			this._horizontalScrollbar.beginHide();
		}
	}

	private _scheduleHide(): void {
		if (!this._mouseIsOver && !this._isDragging) {
			this._hideTimeout.cancelAndSet(() => this._hide(), HIDE_TIMEOUT);
		}
	}
}