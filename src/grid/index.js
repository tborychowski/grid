import data from './data';
import events from './events';
import html from './html';
import columns from './columns';
import rows from './rows';


class Grid {
	constructor (cfg) {
		let _defaults = {
			target: document.body,
			sort: { by: 'id', order: 'asc' },
			dataSource: null,
			items: { label: 'items', root: '', itemId: 'id' },
			columns: []
		};
		this.cfg = Object.assign(_defaults, cfg);
		this.processColumns().draw().initEvents();
	}
}

Object.assign(Grid.prototype, data, events, html, columns, rows);
export default Grid;



/*** Object assign shim ***/
if (!Object.assign) Object.defineProperty(Object, 'assign', {
	enumerable: false,
	configurable: true,
	writable: true,
	value: function (target, ...sources) {
		if (!target) throw new TypeError('Cannot convert first argument to object');
		var to = Object(target);
		for (let source of sources) {
			let keys = Object.keys(Object(source));
			for (let key of keys) {
				let desc = Object.getOwnPropertyDescriptor(source, key);
				if (desc !== undefined && desc.enumerable) to[key] = source[key];
			}
		}
		return to;
	}
});

