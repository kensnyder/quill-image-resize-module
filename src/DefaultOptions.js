import DisplaySize from './modules/DisplaySize';
import Toolbar from './modules/Toolbar';
import Resize from './modules/Resize';

export default {
    modules: [
        DisplaySize,
        Toolbar,
        Resize,
    ],
    overlayStyles: {
        position: 'absolute',
        boxSizing: 'border-box',
    },
    handleStyles: {
        position: 'absolute',
        height: 12,
        width: 12,
        backgroundColor: 'white',
        border: '1px solid #777',
        boxSizing: 'border-box',
        opacity: '0.80',
    },
    displayStyles: {
        position: 'absolute',
        font: '12px/1.0 Arial, Helvetica, sans-serif',
        padding: '4px 8px',
        textAlign: 'center',
        backgroundColor: 'white',
        color: '#333',
        border: '1px solid #777',
        boxSizing: 'border-box',
        opacity: '0.80',
        cursor: 'default',
    },
    toolbarButtons: {
        alignLeft: true,
        alignRight: true,
    },
    toolbarStyles: {
        position: 'absolute',
        font: '12px/1.0 Arial, Helvetica, sans-serif',
        padding: '4px 8px',
        textAlign: 'center',
        backgroundColor: 'white',
        color: '#333',
        border: '1px solid #777',
        boxSizing: 'border-box',
        boxShadow: '2px 2px 2px rgba(0,0,0,0.25)',
        cursor: 'default',
        display: 'flex',
        justifyContent: 'space-between',
    },
    toolbarButtonStyles: {
        alignLeft: {
            width: '32px',
            height: '32px',
            background: 'white',
            border: '1px solid #999',
        },
        alignCenter: {
            width: '32px',
            height: '32px',
            background: 'white',
            border: '1px solid #999',
        },
        alignRight: {
            width: '32px',
            height: '32px',
            background: 'white',
            border: '1px solid #999',
        },
    },
    toolbarButtonSvgStyles: {
        fill: '#444',
        stroke: '#444',
    },
};
