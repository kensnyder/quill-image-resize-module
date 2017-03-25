# Quill ImageResize Module

A module for Quill rich text editor to allow images to be resized.

Also see [quill-image-drop-module](https://github.com/kensnyder/quill-image-drop-module),
a module that enables copy-paste and drag/drop for Quill.

## Demo

[Plunker](https://plnkr.co/edit/gq708AOrSBOWSlHcFslG?p=preview)

## Usage

### Webpack/ES6

```javascript
import Quill from 'quill';
import { ImageResize } from 'quill-image-resize-module';

Quill.register('modules/imageResize', ImageResize);

const quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        imageResize: true
    }
});
```

### Script Tag

Copy image-resize.min.js into your web root or include from node_modules

```html
<script src="/node_modules/quill-image-resize-module/image-resize.min.js"></script>
```

```javascript
var quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        ImageResize: true
    }
});
```

### Display pixel size

Use the option `displaySize` to enable the display of pixel size.

```javascript
var quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        ImageResize: {
            displaySize: true
        }
    }
});
```

### Advanced Options

The look and feel of the image resize can be controlled with options.

```javascript
var quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        ImageResize: {
            handleStyles: {
                backgroundColor: 'black',
                border: 'none',
                borderRadius: '6px'
                // other camelCase styles for resize handles
            },
            displaySize: true,
            displayStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: white
                // other camelCase styles for size display
            }
        }
    }
});
```

