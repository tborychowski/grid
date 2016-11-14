import data from './data';
import events from './events';
import html from './html';
import columns from './columns';
import rows from './rows';

class Grid {
	constructor (cfg) {
		let _defaults = {
			theme: 'dark',
			target: document.body,
			sort: { by: 'id', order: 'asc' },
			dataSource: null,
			items: { label: 'items', root: 'items', itemId: 'id' },
			columns: []
		};
		this.cfg = Object.assign(_defaults, cfg);
		this.processColumns().draw().initEvents();
	}
}

Object.assign(Grid.prototype, data, events, html, columns, rows);

export default Grid;
