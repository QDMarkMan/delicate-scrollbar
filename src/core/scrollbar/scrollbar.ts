/** ---------------------------------------------------------------------------------------------
 *  @Author [ETongfu].
 *  @Des [scrollbar].
 *-------------------------------------------------------------------------------------------- */

export const enum ScrollbarVisibility {
	Auto = 1,
	Hidden = 2,
	Visible = 3
}
export interface ScrollEvent {
	width: number;
	scrollWidth: number;
	scrollLeft: number;

	height: number;
	scrollHeight: number;
	scrollTop: number;

	widthChanged: boolean;
	scrollWidthChanged: boolean;
	scrollLeftChanged: boolean;

	heightChanged: boolean;
	scrollHeightChanged: boolean;
	scrollTopChanged: boolean;
}


export interface IScrollDimensions {
	readonly width: number;
	readonly scrollWidth: number;
	readonly height: number;
	readonly scrollHeight: number;
}
export interface INewScrollDimensions {
	width?: number;
	scrollWidth?: number;
	height?: number;
	scrollHeight?: number;
}

export interface IScrollPosition {
	readonly scrollLeft: number;
	readonly scrollTop: number;
}
export interface ISmoothScrollPosition {
	readonly scrollLeft: number;
	readonly scrollTop: number;

	readonly width: number;
	readonly height: number;
}
export interface INewScrollPosition {
	scrollLeft?: number;
	scrollTop?: number;
}

export class ScrollState implements IScrollDimensions, IScrollPosition {
	_scrollStateBrand: void;

	public readonly rawScrollLeft: number;
	public readonly rawScrollTop: number;

	public readonly width: number;
	public readonly scrollWidth: number;
	public readonly scrollLeft: number;
	public readonly height: number;
	public readonly scrollHeight: number;
	public readonly scrollTop: number;

	constructor(
		width: number,
		scrollWidth: number,
		scrollLeft: number,
		height: number,
		scrollHeight: number,
		scrollTop: number
	) {
		width = width | 0;
		scrollWidth = scrollWidth | 0;
		scrollLeft = scrollLeft | 0;
		height = height | 0;
		scrollHeight = scrollHeight | 0;
		scrollTop = scrollTop | 0;

		this.rawScrollLeft = scrollLeft; // before validation
		this.rawScrollTop = scrollTop; // before validation

		if (width < 0) {
			width = 0;
		}
		if (scrollLeft + width > scrollWidth) {
			scrollLeft = scrollWidth - width;
		}
		if (scrollLeft < 0) {
			scrollLeft = 0;
		}

		if (height < 0) {
			height = 0;
		}
		if (scrollTop + height > scrollHeight) {
			scrollTop = scrollHeight - height;
		}
		if (scrollTop < 0) {
			scrollTop = 0;
		}

		this.width = width;
		this.scrollWidth = scrollWidth;
		this.scrollLeft = scrollLeft;
		this.height = height;
		this.scrollHeight = scrollHeight;
		this.scrollTop = scrollTop;
	}

	public equals(other: ScrollState): boolean {
		return (
			this.rawScrollLeft === other.rawScrollLeft
			&& this.rawScrollTop === other.rawScrollTop
			&& this.width === other.width
			&& this.scrollWidth === other.scrollWidth
			&& this.scrollLeft === other.scrollLeft
			&& this.height === other.height
			&& this.scrollHeight === other.scrollHeight
			&& this.scrollTop === other.scrollTop
		);
	}

	public withScrollDimensions(update: INewScrollDimensions, useRawScrollPositions: boolean): ScrollState {
		return new ScrollState(
			(typeof update.width !== 'undefined' ? update.width : this.width),
			(typeof update.scrollWidth !== 'undefined' ? update.scrollWidth : this.scrollWidth),
			useRawScrollPositions ? this.rawScrollLeft : this.scrollLeft,
			(typeof update.height !== 'undefined' ? update.height : this.height),
			(typeof update.scrollHeight !== 'undefined' ? update.scrollHeight : this.scrollHeight),
			useRawScrollPositions ? this.rawScrollTop : this.scrollTop
		);
	}

	public withScrollPosition(update: INewScrollPosition): ScrollState {
		return new ScrollState(
			this.width,
			this.scrollWidth,
			(typeof update.scrollLeft !== 'undefined' ? update.scrollLeft : this.rawScrollLeft),
			this.height,
			this.scrollHeight,
			(typeof update.scrollTop !== 'undefined' ? update.scrollTop : this.rawScrollTop)
		);
	}

	public createScrollEvent(previous: ScrollState): ScrollEvent {
		const widthChanged = (this.width !== previous.width);
		const scrollWidthChanged = (this.scrollWidth !== previous.scrollWidth);
		const scrollLeftChanged = (this.scrollLeft !== previous.scrollLeft);

		const heightChanged = (this.height !== previous.height);
		const scrollHeightChanged = (this.scrollHeight !== previous.scrollHeight);
		const scrollTopChanged = (this.scrollTop !== previous.scrollTop);

		return {
			width: this.width,
			scrollWidth: this.scrollWidth,
			scrollLeft: this.scrollLeft,

			height: this.height,
			scrollHeight: this.scrollHeight,
			scrollTop: this.scrollTop,

			widthChanged: widthChanged,
			scrollWidthChanged: scrollWidthChanged,
			scrollLeftChanged: scrollLeftChanged,

			heightChanged: heightChanged,
			scrollHeightChanged: scrollHeightChanged,
			scrollTopChanged: scrollTopChanged,
		};
	}

}