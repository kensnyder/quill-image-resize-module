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
            left: 0,
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
        button.innerHTML = 'Align left';
        button.onclick = this.onAlignLeft;

        this.toolbar.appendChild(button);
    };

    onAlignLeft = () => {
        if (this.img.getAttribute('data-align') === 'left') {
            this.clearAlignmentStyles();
            return;
        }

        this.clearAlignmentStyles();
        this.img.style.float = 'left';
        this.img.setAttribute('data-align', 'left');
        this.requestUpdate();
    };

    addAlignRight = () => {
        if (this.options.toolbarButtons.alignRight === false) {
            return;
        }

        const button = document.createElement('button');
        button.innerHTML = 'Align right';
        button.onclick = this.onAlignRight;

        this.toolbar.appendChild(button);
    };

    onAlignRight = () => {
        if (this.img.getAttribute('data-align') === 'right') {
            this.clearAlignmentStyles();
            return;
        }

        this.clearAlignmentStyles();
        this.img.style.float = 'right';
        this.img.setAttribute('data-align', 'right');
        this.requestUpdate();
    };

    addAlignCenter = () => {
        if (this.options.toolbarButtons.alignCenter === false) {
            return;
        }

        const button = document.createElement('button');
        button.innerHTML = 'Align center';
        button.onclick = this.onAlignCenter;

        this.toolbar.appendChild(button);
    };

    onAlignCenter = () => {
        if (this.img.getAttribute('data-align') === 'center') {
            this.clearAlignmentStyles();
            return;
        }

        this.clearAlignmentStyles();

        this.img.style.display = 'block';
        this.img.style.margin = 'auto';
        this.img.setAttribute('data-align', 'center');
        this.requestUpdate();
    };

    clearAlignmentStyles = () => {
        this.img.style.display = 'inline-block';
        this.img.style.margin = '';
        this.img.style.float = '';
        this.img.removeAttribute('data-align');
        this.requestUpdate();
    };
}
