import { BaseModule } from './BaseModule';

export class Toolbar extends BaseModule {
	onCreate = () => {
		// Setup Toolbar
		this.toolbar = document.createElement('div');
		Object.assign(this.toolbar.style, this.options.toolbarStyles);
		this.overlay.appendChild(this.toolbar);

		// Setup Buttons
		this.addToolbarButtons();
	};

	// The toolbar and its children will be destroyed when the overlay is removed
	onDestroy = () => {};

	// Nothing to update on drag because we are are positioned relative to the overlay
	onUpdate = () => {};

	addToolbarButtons = () => {
		const buttons = [];
		const alignmentHelper = this.options.alignmentHelper;
		alignmentHelper.getAlignments().forEach((alignment, idx) => {
			const button = document.createElement('span');
			buttons.push(button);
			button.innerHTML = alignment.icon;
			button.addEventListener('click', () => {
				// deselect all buttons
				buttons.forEach(this.deselectButton);
				if (alignment.isApplied(this.img)) {
					if (this.options.toolbar.allowDeselect) {
						alignmentHelper.clear(this.img);
					} else {
						this.selectButton(button);
					}
				} else {
					// otherwise, select button and apply
					this.selectButton(button);
					alignment.apply(this.img);
				}
				// image may change position; redraw drag handles
				this.requestUpdate();
			});
			Object.assign(button.style, this.options.toolbarButtonStyles);
			if (idx > 0) {
				button.style.borderLeftWidth = '0';
			}
			Object.assign(button.children[0].style, this.options.toolbarButtonSvgStyles);
			if (alignment.isApplied(this.img)) {
				// select button if previously applied
				this.selectButton(button);
			}
			this.toolbar.appendChild(button);
		});
	};

	selectButton = (button) => {
		button.classList.add('is-selected');
		button.style.filter = 'invert(20%)';
	};

	deselectButton = (button) => {
		button.classList.remove('is-selected');
		button.style.filter = '';
	}
}
