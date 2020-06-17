/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { StandardWheelEvent } from '../utils/mouseEvent'
import { ScrollbarState } from '../utils/scrollbarState'
import { FastDomNode, createFastDomNode } from './../utils/fastDomNode';

/**
 * The orthogonal distance to the slider at which dragging "resets". This implements "snapping"
 */
const MOUSE_DRAG_RESET_DISTANCE = 140;

export interface ISimplifiedMouseEvent {
	buttons: number;
	posx: number;
	posy: number;
}

export interface ScrollbarHost {
	onMouseWheel(mouseWheelEvent: StandardWheelEvent): void;
	onDragStart(): void;
	onDragEnd(): void;
}

export const enum ScrollbarVisibility {
	Auto = 1,
	Hidden = 2,
	Visible = 3
}

export interface AbstractScrollbarOptions {
	lazyRender: boolean;
	host: ScrollbarHost;
	scrollbarState: ScrollbarState;
	visibility: ScrollbarVisibility;
	extraScrollbarClassName: string;
	// scrollable: Scrollable;
}

export abstract class AbstractScrollbar {

	protected _host: ScrollbarHost;
	protected _scrollbarState: ScrollbarState;

	public domNode: FastDomNode<HTMLElement>;
	public slider!: FastDomNode<HTMLElement>;

	protected _shouldRender: Boolean;

	constructor(opts: AbstractScrollbarOptions) {
		this._host = opts.host;
		this._shouldRender = !opts.lazyRender
		this._scrollbarState = opts.scrollbarState
		// DOM
		this.domNode = createFastDomNode(document.createElement('div'))
		this.domNode.setAttribute('role', 'presentation');
		this.domNode.setAttribute('aria-hidden', 'true');
		this.domNode.setPosition('absolute');
	}

	protected _createSlider (top: number, left: number, width: number | undefined, height: number | undefined) :void {
		this.slider = createFastDomNode(document.createElement('div'));
		this.slider = createFastDomNode(document.createElement('div'));
		this.slider.setClassName('slider');
		this.slider.setPosition('absolute');
		this.slider.setTop(top);
		this.slider.setLeft(left);
		if (typeof width === 'number') {
			this.slider.setWidth(width);
		}
		if (typeof height === 'number') {
			this.slider.setHeight(height);
		}
		this.slider.setLayerHinting(true);
		this.slider.setContain('strict');

		this.domNode.domNode.appendChild(this.slider.domNode);
	}

	/**
	 * render
	 */
	public render() :void {
		if (!this._shouldRender) {
			return;
		}
		this._shouldRender = false
		this._renderDomNode(this._scrollbarState.getRectangleLargeSize(), this._scrollbarState.getRectangleSmallSize());
		this._updateSlider(this._scrollbarState.getSliderSize(), this._scrollbarState.getArrowSize() + this._scrollbarState.getSliderPosition());
	}

	// ----------------- Overwrite these
	protected abstract _renderDomNode(largeSize: number, smallSize: number): void;
	protected abstract _updateSlider(sliderSize: number, sliderPosition: number): void;
}
