var quill = new Quill('#editor', {
	theme: 'snow',
	modules: {
		imageResize: {},
		iframeResize: {},
	},
	formats: ['image', 'video'],
});
