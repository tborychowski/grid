function processColumns () {
	var actions = {}, colWidths = [];
	for (let col of this.cfg.columns) {
		col.name = col.name || '';
		col.field = col.field || '';
		col.sortable = (col.sortable !== false && !col.icons);

		if (col.icons) {														// column icons
			for (let icon in col.icons) actions[icon] = col.icons[icon];
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
	var autos = 0, sumW = 0, remainingW, autoPercent = 100, autoW,
		headCols = this.el.head.querySelectorAll('.grid-cell'),
		bodyCols = this.el.body.querySelectorAll('.grid-row:first-of-type .grid-cell'),
		footCols = this.el.foot.querySelectorAll('.grid-cell');

	// calculate columns widths
	for (let col of this.columnWidths) {
		if (typeof col === 'number') sumW += col;
		else if (col === 'auto') autos++;
		else if (col.indexOf('%') > -1) autoPercent -= parseInt(col, 10);
	}
	remainingW = this.el.head.offsetWidth - sumW;
	autoPercent = autoPercent / autos;
	autoW = remainingW * autoPercent / 100;

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

