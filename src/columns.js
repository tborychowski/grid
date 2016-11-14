function processColumns () {
	const actions = {};
	const colWidths = [];

	for (let col of this.cfg.columns) {
		col.name = col.name || '';
		col.field = col.field || '';
		col.sortable = (col.sortable !== false && !col.icons);

		if (col.icons) {														// column icons
			for (let icon in col.icons) {
				let cb = function () {};
				if (typeof col.icons[icon] === 'function') cb = col.icons[icon];
				else if (typeof col.icons[icon].cb === 'function') cb = col.icons[icon].cb;
				actions[icon] = cb;
			}
		}
		if (typeof col.width === 'string' && col.width.indexOf('%') === -1) {	// column widths
			col.width = parseInt(col.width, 10);
		}
		colWidths.push(col.width || 'auto');
	}
	this.columnWidths = colWidths;
	this.iconHandlers = actions;
	return this;
}


function updateColumnWidths () {
	const headCols = this.el.head.querySelectorAll('.grid-cell');
	const bodyCols = this.el.body.querySelectorAll('.grid-row:first-of-type .grid-cell');
	const footCols = this.el.foot.querySelectorAll('.grid-cell');
	let autos = 0;
	let autoPercent = 100;

	// calculate columns widths
	for (let col of this.columnWidths) {
		if (typeof col === 'number') continue;
		else if (col === 'auto') autos++;
		else if (col.indexOf('%') > -1) autoPercent -= parseInt(col, 10);
	}
	autoPercent = autoPercent / autos;

	this.columnWidths.forEach(function (col, i) {
		if (col === 'auto') col = autoPercent + '%';
		else if (typeof col === 'number') col = col + 'px';

		if (headCols[i]) headCols[i].style.width = col;
		if (bodyCols[i]) bodyCols[i].style.width = col;
		if (footCols[i]) footCols[i].style.width = col;
	});

	return this.updateTableWidths();
}

function updateTableWidths () {
	let headW, bodyW, tabStyle = this.el.bodyTable.style;
	tabStyle.width = '100%';
	headW = this.el.headTable.offsetWidth;
	bodyW = this.el.bodyTable.offsetWidth;
	tabStyle.width = (bodyW === headW ? '100%' : headW + 'px');
	return this;
}



export default {
	processColumns,
	updateColumnWidths,
	updateTableWidths
};

