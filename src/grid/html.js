var frameTpl = require('./templates/grid-frame.html');
var rowTpl = require('./templates/body-row.html');
var headerCellTpl = require('./templates/header-cell.html');
var footerCellTpl = require('./templates/footer-cell.html');


function _getRowIcons (icons) {
	var iconHtml = '', icon;
	for (icon of Object.keys(icons)) {
		iconHtml += '<a href="#" class="row-action" data-action="' + icon +
			'"><i class="fa fa-' + icon + '"></i></a>';
	}
	return iconHtml;
}


function _getHeaderRow () {
	var cells = [];
	for (let col of this.cfg.columns) {
		let sortCls = (col.sortable ? 'sort' : '');
		col.headerCls = ['grid-cell', 'grid-header-cell', col.field, sortCls].join(' ');
		cells.push(headerCellTpl(col));
	}
	return cells.join('');
}


function _getFooterRow () {
	var cells = [];
	for (let col of this.cfg.columns) {
		col.footerCls = ['grid-cell', 'grid-footer-cell', col.field].join(' ');
		if (typeof col.footer === 'function') col.footerText = col.footer.call(this, this.data);
		else col.footerText = col.footer || '';
		cells.push(footerCellTpl(col));
	}
	return cells.join('');
}

function _getBodyRow (item) {
	var cells = [];
	for (let col of this.cfg.columns) {
		let cls = [col.field, col.icons ? 'action' : ''].join(' ');
		let text = item[col.field];

		if (typeof col.renderer === 'function') text = col.renderer.call(this, text, item);
		else if (col.icons) text = _getRowIcons(col.icons);

		cells.push({ cls, text });
	}
	return cells;
}



function _getBody () {
	return this.items
		.map(item => rowTpl({ id: item.id, cells: _getBodyRow.call(this, item) }), this)
		.join('');
}


function populate () {
	if (!this.isRendered) {
		this.el.head.innerHTML = _getHeaderRow.call(this);
		this.el.foot.innerHTML = _getFooterRow.call(this);
		this.isRendered = true;
	}
	this.el.body.innerHTML = _getBody.call(this);
	return this.updateColumnWidths();
}


function draw () {
	this.isRendered = false;
	this.cfg.target.innerHTML = frameTpl();
	this.el = {
		target: this.cfg.target,
		scroller: this.cfg.target.querySelector('.grid-scroller'),
		head: this.cfg.target.querySelector('.grid-header'),
		body: this.cfg.target.querySelector('.grid-body'),
		foot: this.cfg.target.querySelector('.grid-footer'),
		headTable: this.cfg.target.querySelector('.grid-header-table'),
		bodyTable: this.cfg.target.querySelector('.grid-body-table')
	};
	return this;
}


export default {
	populate,
	draw
};

