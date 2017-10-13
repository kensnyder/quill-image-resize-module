import Quill from 'quill';

export default class DeleteHelper {
	deleteBlot(el) {
		const blot = Quill.find(el);
		if (blot) {
			blot.deleteAt(0);
		}
	}
}

export const defaultDeleteHelper = new DeleteHelper();
