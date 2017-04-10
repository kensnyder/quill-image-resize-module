import BaseModule from './BaseModule';

export default class DisplaySize extends BaseModule {
    onCreate = () => {
        // Create the container to hold the size display
        this.display = document.createElement('div');

        // Apply styles
        Object.assign(this.display.style, this.options.displayStyles);

        // Attach it
        this.overlay.appendChild(this.display);
    };

    onDestroy = () => {
        if (this.display) {
            this.display.parentNode.removeChild(this.display);
        }
        this.display = undefined;
    };

    onUpdate = () => {
        if (!this.display || !this.img) {
            return;
        }

        const size = this.getCurrentSize();
        this.display.innerHTML = size.join(' &times; ');
        if (size[0] > 120 && size[1] > 30) {
            // position on top of image
            Object.assign(this.display.style, {
                right: '4px',
                bottom: '4px',
            });
        } else {
            // position off bottom right
            const dispRect = this.display.getBoundingClientRect();
            Object.assign(this.display.style, {
                right: `-${dispRect.width + 4}px`,
                bottom: `-${dispRect.height + 4}px`,
            });
        }
    };

    getCurrentSize = () => [
        this.img.width,
        Math.round((this.img.width / this.img.naturalWidth) * this.img.naturalHeight),
    ];
}
