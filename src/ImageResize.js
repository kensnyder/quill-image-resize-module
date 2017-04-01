import { defaultsDeep } from 'lodash';
import DefaultOptions from './DefaultOptions';
/**
 * Custom module for quilljs to allow user to resize <img> elements
 * (Works on Chrome, Edge, Safari and replaces Firefox's native resize behavior)
 * @see https://quilljs.com/blog/building-a-custom-module/
 */
export default class ImageResize {

    constructor(quill, options = {}) {
        // save the quill reference and options
        this.quill = quill;

        // Apply the options to our defaults, and stash them for later
        this.options = defaultsDeep({}, options, DefaultOptions);

        // track resize handles
        this.boxes = [];

        // disable native image resizing on firefox
        document.execCommand('enableObjectResizing', false, 'false');

        // respond to clicks inside the editor
        this.quill.root.addEventListener('click', this.handleClick, false);
    }

    handleClick = (evt) => {
        if (evt.target && evt.target.tagName && evt.target.tagName.toUpperCase() === 'IMG') {
            if (this.img === evt.target) {
                // we are already focused on this image
                return;
            }
            if (this.img) {
                // we were just focused on another image
                this.hide();
            }
            // clicked on an image inside the editor
            this.show(evt.target);
        } else if (this.img) {
            // clicked on a non image
            this.hide();
        }
    };

    show = (img) => {
        // keep track of this img element
        this.img = img;

        this.showOverlay();

        this.showToolbar();
        this.showSizeDisplay();
        this.showResizers();
    };

    showOverlay = () => {
        if (this.overlay) {
            this.hideOverlay();
        }

        this.overlay = document.createElement('div');
        Object.assign(this.overlay.style, this.options.overlayStyles);

        document.body.appendChild(this.overlay);

        this.repositionElements();
    };

    hideOverlay = () => {
        if (!this.overlay) {
            return;
        }

        document.body.removeChild(this.overlay);
        this.overlay = undefined;
    };

    repositionElements = () => {
        if (!this.overlay || !this.img) {
            return;
        }

        // position the overlay over the image
        const rect = this.img.getBoundingClientRect();

        Object.assign(this.overlay.style, {
            left: `${rect.left + window.pageXOffset}px`,
            top: `${rect.top + window.pageYOffset}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
        });

        this.positionSizeDisplay();
    };

    hide = () => {
        this.hideResizers();
        this.hideSizeDisplay();
        this.hideToolbar();
        this.hideOverlay();
        this.img = undefined;
    };

    showResizers = () => {
        // prevent spurious text selection
        this.setUserSelect('none');
        // add 4 resize handles
        this.addBox('nwse-resize'); // top left
        this.addBox('nesw-resize'); // top right
        this.addBox('nwse-resize'); // bottom right
        this.addBox('nesw-resize'); // bottom left
        // listen for the image being deleted or moved
        document.addEventListener('keyup', this.checkImage, true);
        this.quill.root.addEventListener('input', this.checkImage, true);
        this.positionBoxes();
    };

    hideResizers = () => {
        // stop listening for image deletion or movement
        document.removeEventListener('keyup', this.checkImage);
        this.quill.root.removeEventListener('input', this.checkImage);
        // reset user-select
        this.setUserSelect('');
        this.setCursor('');
        // remove boxes
        this.boxes.forEach(box => box.parentNode.removeChild(box));
        // release memory
        this.dragBox = undefined;
        this.dragStartX = undefined;
        this.preDragWidth = undefined;
        this.boxes = [];
    };

    addBox = (cursor) => {
        // create div element for resize handle
        const box = document.createElement('div');

        // Star with the specified styles
        Object.assign(box.style, this.options.handleStyles);
        box.style.cursor = cursor;

        // Set the width/height to use 'px'
        box.style.width = `${this.options.handleStyles.width}px`;
        box.style.height = `${this.options.handleStyles.height}px`;

        // listen for mousedown on each box
        box.addEventListener('mousedown', this.handleMousedown, false);
        // add drag handle to document
        this.overlay.appendChild(box);
        // keep track of drag handle
        this.boxes.push(box);
    };

    positionBoxes = () => {
        const handleXOffset = `${-this.options.handleStyles.width / 2}px`;
        const handleYOffset = `${-this.options.handleStyles.height / 2}px`;

        // set the top and left for each drag handle
        [
            { left: handleXOffset, top: handleYOffset },        // top left
            { right: handleXOffset, top: handleYOffset },       // top right
            { right: handleXOffset, bottom: handleYOffset },    // bottom right
            { left: handleXOffset, bottom: handleYOffset },     // bottom left
        ].forEach((pos, idx) => {
            Object.assign(this.boxes[idx].style, pos);
        });
    };

    handleMousedown = (evt) => {
        // note which box
        this.dragBox = evt.target;
        // note starting mousedown position
        this.dragStartX = evt.clientX;
        // store the width before the drag
        this.preDragWidth = this.img.width || this.img.naturalWidth;
        // set the proper cursor everywhere
        this.setCursor(this.dragBox.style.cursor);
        // listen for movement and mouseup
        document.addEventListener('mousemove', this.handleDrag, false);
        document.addEventListener('mouseup', this.handleMouseup, false);
    };

    handleMouseup = () => {
        // reset cursor everywhere
        this.setCursor('');
        // stop listening for movement and mouseup
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.handleMouseup);
    };

    handleDrag = (evt) => {
        if (!this.img) {
            // image not set yet
            return;
        }
        // update image size
        if (this.dragBox === this.boxes[0] || this.dragBox === this.boxes[3]) {
            // left-side resize handler; dragging right shrinks image
            this.img.width = Math.round((this.preDragWidth - evt.clientX) - this.dragStartX);
        } else {
            // right-side resize handler; dragging right enlarges image
            this.img.width = Math.round((this.preDragWidth + evt.clientX) - this.dragStartX);
        }
        this.repositionElements();
    };

    setUserSelect = (value) => {
        [
            'userSelect',
            'mozUserSelect',
            'webkitUserSelect',
            'msUserSelect',
        ].forEach((prop) => {
                // set on contenteditable element and <html>
            this.quill.root.style[prop] = value;
            document.documentElement.style[prop] = value;
        });
    };

    setCursor = (value) => {
        [
            document.body,
            this.img,
            this.quill.root,
        ].forEach((el) => {
            el.style.cursor = value;   // eslint-disable-line no-param-reassign
        });
    };

    checkImage = () => {
        if (this.img) {
            this.hide();
        }
    };

    showSizeDisplay = () => {
        if (!this.options.displaySize || !this.overlay) {
            return;
        }

        // Create the container to hold the size display
        this.display = document.createElement('div');

        // Apply styles
        Object.assign(this.display.style, this.options.displayStyles);

        // Attach it
        this.overlay.appendChild(this.display);
        this.positionSizeDisplay();
    };

    hideSizeDisplay = () => {
        if (this.display) {
            this.display.parentNode.removeChild(this.display);
        }
        this.display = undefined;
    };

    positionSizeDisplay = () => {
        if (!this.display || !this.img) {
            return;
        }

        const size = this.getCurrentSize();
        this.display.innerHTML = size.join(' &times; ');
        if (size[0] > 120 && size[1] > 30) {
            // position on top of image
            Object.assign(this.display.style, {
                top: 'initial',
                left: 'initial',
                bottom: 0,
                right: 0,
            });
        } else {
            // position off top right
            const dispRect = this.display.getBoundingClientRect();
            Object.assign(this.display.style, {
                top: 0,
                right: `-${dispRect.width}px`,
                left: 'initial',
                bottom: 'initial',
            });
        }
    };

    getCurrentSize = () => [
        this.img.width,
        Math.round((this.img.width / this.img.naturalWidth) * this.img.naturalHeight),
    ];

    showToolbar = () => {
        if (this.options.displayToolbar === false) {
            return;
        }

        this.toolbar = document.createElement('div');

        this.addToolbarButtons();

        // Apply styles
        Object.assign(this.toolbar.style, this.options.toolbarStyles);

        // Attach it
        this.overlay.appendChild(this.toolbar);

        this.positionToolbar();
    };

    positionToolbar = () => {
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
        this.repositionElements();
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
        this.repositionElements();
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
        this.repositionElements();
    };

    clearAlignmentStyles = () => {
        this.img.style.display = 'inline-block';
        this.img.style.margin = '';
        this.img.style.float = '';
        this.img.removeAttribute('data-align');
        this.repositionElements();
    };

    hideToolbar = () => {
        if (this.toolbar) {
            this.toolbar.parentNode.removeChild(this.toolbar);
        }
        this.toolbar = undefined;
    };
}
