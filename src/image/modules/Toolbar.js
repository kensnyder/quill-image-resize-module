import AlignmentHelper from '../../AlignmentHelper';
import { BaseModule } from './BaseModule';

export class Toolbar extends BaseModule {
  onCreate = () => {
    // Setup Toolbar
    this.toolbar = document.createElement('div');
    Object.assign(this.toolbar.style, this.options.toolbarStyles);
    this.overlay.appendChild(this.toolbar);

    // Setup Buttons
    this._addToolbarButtons();
  };

  // The toolbar and its children will be destroyed when the overlay is removed
  onDestroy = () => {};

  // Nothing to update on drag because we are are positioned relative to the overlay
  onUpdate = () => {};

  _addToolbarButtons = () => {
    const buttons = [];
    AlignmentHelper.getAlignments().forEach((alignment, idx) => {
      const button = document.createElement('span');
      buttons.push(button);
      button.innerHTML = alignment.icon;
      button.addEventListener('click', () => {
        // deselect all buttons
        buttons.forEach(button => button.style.filter = '');
        if (alignment.isApplied(this.img)) {
          // If applied, unapply
          AlignmentHelper.clear(this.img);
        } else {
          // otherwise, select button and apply
          this._selectButton(button);
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
        this._selectButton(button);
      }
      this.toolbar.appendChild(button);
    });
  };

  _selectButton = (button) => {
    button.style.filter = 'invert(20%)';
  };

}
