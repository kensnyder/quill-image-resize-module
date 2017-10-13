import Quill from 'quill';
import defaultsDeep from 'lodash/defaultsDeep';
import DefaultOptions from './DefaultOptions';
import { alignAttribute } from '../AlignmentHelper';

const attributes = {
    proxyId: 'data-iframe-proxy-id',
};

export default class IframeResize {

    constructor(quill, options = {}) {
        this.quill = quill;
        this.options = defaultsDeep({}, options, DefaultOptions);
        this.proxyImageObserver = new MutationObserver(this.handleProxyImageMutations);

        this.quill.root.addEventListener('click', this.handleClick, false);
        this.quill.root.addEventListener('input', this.handleInput, true);
        this.quill.on('text-change', this.handleTextChange);

        document.addEventListener('keyup', this.handleInput, true);
    }

    handleClick = (evt) => {
        const isImage = evt.target && evt.target.tagName && evt.target.tagName === 'IMG';
        if (!isImage || (isImage && !this.isProxyImage(evt.target))) {
            this.removeProxyImages();
        }
    };

    handleInput = (evt) => {
        if (evt.keyCode === 46 || evt.keyCode === 8) {
            this.deleteActiveIframes();
        }

        this.removeProxyImages();
    };

    handleTextChange = () => {
        const iframes = Array.from(document.querySelectorAll(this.options.iframeSelector));
        let needsReindex = false;

        for (const iframe of iframes) {
            if (!iframe.hasAttribute(attributes.proxyId)) {
                needsReindex = true;
                break;
            }
        }

        if (needsReindex) {
            iframes.forEach((iframe, index) => {
                this.removeMouseEnterListener(iframe);
                iframe.setAttribute(attributes.proxyId, `iframe-proxy-${index}`);
                this.addMouseEnterListener(iframe);
            });
        }
    };

    handleVideoMouseEnter = (evt) => {
        const iframe = evt.target;
        let proxyImage = this.getProxyImageForIframe(iframe);

        if (!proxyImage) {
            proxyImage = this.createProxyImage(iframe);
        }

        this.repositionProxyImage(proxyImage);
        document.body.appendChild(proxyImage);
        this.observe(proxyImage);

        proxyImage.addEventListener('click', this.getImageResize().handleClick, false);
    };

    handleProxyImageMutations = (mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type !== 'attributes' || !mutation.target) {
                return;
            }

            const proxyImage = mutation.target;
            const iframe = this.getIframeForProxyImage(proxyImage);

            this.proxyImageObserver.disconnect();

            if (mutation.attributeName === 'width') {
                this.onProxyImageWidthChange(proxyImage, iframe);
            } else if (mutation.attributeName === alignAttribute) {
                this.onProxyImageAlignChange(proxyImage, iframe);
            }

            this.repositionProxyImage(proxyImage);
            this.observe(proxyImage);
        });
    };

    onProxyImageWidthChange = (proxyImage, iframe) => {
        iframe.height = proxyImage.height;
        iframe.width = proxyImage.width;
    };

    onProxyImageAlignChange = (proxyImage, iframe) => {
    	const alignmentHelper = this.getAlignmentHelper();
        const nextIframeAlignment = alignmentHelper.getCurrentAlignment(proxyImage);
        alignmentHelper.clear(iframe);

        if (nextIframeAlignment !== null) {
            nextIframeAlignment.apply(iframe);
        }

        alignmentHelper.clearStyles(proxyImage);
        this.repositionProxyImage(proxyImage);
        this.getImageResize().repositionElements();
    };

    createProxyImage = (iframe) => {
        const canvas = this.createProxyImageCanvas(iframe.getBoundingClientRect());
        const proxyImage = document.createElement('img');

        proxyImage.src = canvas.toDataURL('image/png');
        proxyImage.className = this.options.proxyImageClass;
        proxyImage.setAttribute(attributes.proxyId, iframe.getAttribute(attributes.proxyId));

        return proxyImage;
    };

    createProxyImageCanvas = ({ width, height }) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.globalAlpha = 0;
        context.fillRect(0, 0, width, height);

        return canvas;
    };

    repositionProxyImage = (proxyImage) => {
        const iframe = this.getIframeForProxyImage(proxyImage);
        const rect = iframe.getBoundingClientRect();

        this.removeMouseEnterListener(iframe);

        Object.assign(
            proxyImage.style,
            {
                position: 'absolute',
                margin: '0',
                left: `${rect.left + window.pageXOffset}px`,
                top: `${rect.top + window.pageYOffset}px`,
            },
            this.options.proxyImageStyle
        );

        proxyImage.width = rect.width;
        this.addMouseEnterListener(iframe);
    };

    deleteActiveIframes = () => {
        Array.from(document.querySelectorAll(`img[${attributes.proxyId}]`)).forEach((proxyImage) => {
            const iframe = this.getIframeForProxyImage(proxyImage);

            if (iframe) {
                this.getDeleteHelper().deleteBlot(iframe);
            }
        });
    };

    getAlignmentHelper = () => this.getImageResize().options.alignmentHelper;
    getDeleteHelper = () => this.getImageResize().options.deleteHelper;
    isProxyImage = img => img.hasAttribute(attributes.proxyId);
    removeMouseEnterListener = iframe => iframe.removeEventListener('mouseenter', this.handleVideoMouseEnter);
    addMouseEnterListener = iframe => iframe.addEventListener('mouseenter', this.handleVideoMouseEnter);
    observe = proxyImage => this.proxyImageObserver.observe(proxyImage, { attributes: true });
    getIframeForProxyImage = proxyImage => document.querySelector(`iframe[${attributes.proxyId}=${proxyImage.getAttribute(attributes.proxyId)}]`);
    getProxyImageForIframe = iframe => document.querySelector(`img[${attributes.proxyId}=${iframe.getAttribute(attributes.proxyId)}]`);
    getImageResize = () => this.quill.getModule('imageResize');
    removeProxyImages = () => Array.from(document.querySelectorAll(`.${this.options.proxyImageClass}`)).forEach(proxy => proxy.remove());
}

if (window.Quill) {
    window.Quill.register('modules/iframeResize', IframeResize);
}
