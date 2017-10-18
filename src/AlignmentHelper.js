import Quill from 'quill';

import IconAlignLeft from 'quill/assets/icons/align-left.svg';
import IconAlignCenter from 'quill/assets/icons/align-center.svg';
import IconAlignRight from 'quill/assets/icons/align-right.svg';

const Parchment = Quill.imports.parchment;
const leftAlignName = 'left';
const centerAlignName = 'center';
const rightAlignName = 'right';
export const alignAttribute = 'data-align';

export default class AlignmentHelper {

	constructor() {
		this.floatStyle = new Parchment.Attributor.Style('float', 'float');
		this.marginStyle = new Parchment.Attributor.Style('margin', 'margin');
		this.displayStyle = new Parchment.Attributor.Style('display', 'display');
		this.alignAttribute = new Parchment.Attributor.Attribute(alignAttribute, alignAttribute);
		this.alignments = {
			left: {
				icon: IconAlignLeft,
				apply: (el) => this.applyLeftAlign(el),
				isApplied: (el) => this.isAligned(el, leftAlignName),
			},
			center: {
				icon: IconAlignCenter,
				apply: (el) => this.applyCenterAlign(el),
				isApplied: (el) => this.isAligned(el, centerAlignName),
			},
			right: {
				icon: IconAlignRight,
				apply: (el) => this.applyRightAlign(el),
				isApplied: (el) => this.isAligned(el, rightAlignName),
			},
		};
	}

	isAligned(el, alignType) {
		return this.alignAttribute.value(el) === alignType;
	}

	applyLeftAlign(el) {
		this.alignAttribute.add(el, leftAlignName);
		this.displayStyle.add(el, 'inline');
		this.floatStyle.add(el, 'left');
		this.marginStyle.add(el, '0 1em 1em 0');
	};

	applyCenterAlign(el) {
		this.alignAttribute.add(el, centerAlignName);
		this.displayStyle.add(el, 'block');
		this.floatStyle.remove(el);
		this.marginStyle.add(el, 'auto');
	};

	applyRightAlign(el) {
		this.alignAttribute.add(el, rightAlignName);
		this.displayStyle.add(el, 'inline');
		this.floatStyle.add(el, 'right');
		this.marginStyle.add(el, '0 0 1em 1em');
	};

	clearStyles(el) {
		this.floatStyle.remove(el);
		this.marginStyle.remove(el);
		this.displayStyle.remove(el);
	};

	clearData(el) {
		this.alignAttribute.remove(el);
	};

	clear(el) {
		this.clearStyles(el);
		this.clearData(el);
	};

	getCurrentAlignment(el) {
		for (const alignment of this.getAlignments()) {
			if (alignment.isApplied(el)) {
				return alignment;
			}
		}

		return null;
	};

	getAlignments() {
		return Object.keys(this.alignments).map(k => this.alignments[k]);
	}
}
