import IconAlignLeft from 'quill/assets/icons/align-left.svg';
import IconAlignRight from 'quill/assets/icons/align-right.svg';
import IconAlignCenter from 'quill/assets/icons/align-center.svg';
import BaseModule from './BaseModule';

export default class Toolbar extends BaseModule {
    onCreate = () => {
        this.toolbar = document.createElement('div');

        this.addToolbarButtons();

        // Apply styles
        Object.assign(this.toolbar.style, this.options.toolbarStyles);

        // Attach it
        this.overlay.appendChild(this.toolbar);
    };

    onDestroy = () => {
        if (this.toolbar) {
            this.toolbar.parentNode.removeChild(this.toolbar);
        }
        this.toolbar = undefined;
    };

    onUpdate = () => {
        if (!this.toolbar || !this.img) {
            return;
        }

        const dispRect = this.toolbar.getBoundingClientRect();

        Object.assign(this.toolbar.style, {
            left: '16px',
            bottom: `${-dispRect.height}px`,
        });
    };

    addToolbarButtons = () => {
        this.addAlignLeft();
        this.addAlignCenter();
        this.addAlignRight();
    };

    addAlignLeft = () => {
        if (this.options.toolbarButtons.alignLeft === false) {
            return;
        }

        const button = document.createElement('button');
        button.innerHTML = IconAlignLeft;
        button.onclick = this.onAlignLeft;
        Object.assign(button.style, this.options.toolbarButtonStyles.alignLeft);
        Object.assign(button.getElementsByTagName('svg')[0].style, this.options.toolbarButtonSvgStyles);

        if (this.img.getAttribute('data-align') === 'left') {
            this.styleButtonAsSelected(button);
        }

        this.toolbar.appendChild(button);
    };

    onAlignLeft = (evt) => {
        if (this.img.getAttribute('data-align') === 'left') {
            this.clearAlignmentStyles();
            return;
        }

        this.clearAlignmentStyles();
        this.styleButtonAsSelected(evt.currentTarget);
        this.img.style.float = 'left';
        this.img.setAttribute('data-align', 'left');
        this.requestUpdate();
    };

    addAlignRight = () => {
        if (this.options.toolbarButtons.alignRight === false) {
            return;
        }

        const button = document.createElement('button');
        button.innerHTML = IconAlignRight;
        button.onclick = this.onAlignRight;
        Object.assign(button.style, this.options.toolbarButtonStyles.alignRight);
        Object.assign(button.getElementsByTagName('svg')[0].style, this.options.toolbarButtonSvgStyles);

        if (this.img.getAttribute('data-align') === 'right') {
            this.styleButtonAsSelected(button);
        }

        this.toolbar.appendChild(button);
    };

    onAlignRight = (evt) => {
        if (this.img.getAttribute('data-align') === 'right') {
            this.clearAlignmentStyles();
            return;
        }

        this.clearAlignmentStyles();
        this.styleButtonAsSelected(evt.currentTarget);
        this.img.style.float = 'right';
        this.img.setAttribute('data-align', 'right');
        this.requestUpdate();
    };

    addAlignCenter = () => {
        if (this.options.toolbarButtons.alignCenter === false) {
            return;
        }

        const button = document.createElement('button');
        button.innerHTML = IconAlignCenter;
        button.onclick = this.onAlignCenter;
        Object.assign(button.style, this.options.toolbarButtonStyles.alignCenter);
        Object.assign(button.getElementsByTagName('svg')[0].style, this.options.toolbarButtonSvgStyles);

        if (this.img.getAttribute('data-align') === 'center') {
            this.styleButtonAsSelected(button);
        }

        this.toolbar.appendChild(button);
    };

    onAlignCenter = (evt) => {
        if (this.img.getAttribute('data-align') === 'center') {
            this.clearAlignmentStyles();
            return;
        }

        this.clearAlignmentStyles();
        this.styleButtonAsSelected(evt.currentTarget);
        this.img.style.display = 'block';
        this.img.style.margin = 'auto';
        this.img.setAttribute('data-align', 'center');
        this.requestUpdate();
    };

    styleButtonAsSelected = (button) => {
        button.style.filter = 'invert(10%)';    // eslint-disable-line no-param-reassign
    };

    clearAlignmentStyles = () => {
        Array.prototype.forEach.call(
            this.toolbar.getElementsByTagName('button'),
            (button) => {
                button.style.filter = '';   // eslint-disable-line no-param-reassign
            },
        );
        this.img.style.display = 'inline-block';
        this.img.style.margin = '';
        this.img.style.float = '';
        this.img.removeAttribute('data-align');
        this.requestUpdate();
    };
}
