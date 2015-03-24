var frameTpl = require('./templates/grid-frame.html');
var rowTpl = require('./templates/body-row.html');
var headerCellTpl = require('./templates/header-cell.html');
var footerCellTpl = require('./templates/footer-cell.html');


function _getRowIcons (icons) {
	var iconHtml = '', icon;
	for (icon in icons) {
		let title = icons[icon] && icons[icon].title || icon;
		iconHtml += '<a href="#" class="row-action" ' +
			'data-action="' + icon + '" ' +
			'title="' + title + '" ' +
			'><i class="fa fa-' + icon + '"></i></a>';
	}
	return iconHtml;
}


function _getHeaderRow () {
	var cells = [];
	for (let col of this.cfg.columns) {
		let sortCls = (col.sortable ? 'sort' : '');
		col.headerCls = ['grid-cell', 'grid-header-cell', col.field, sortCls];
		if (!col.name && col.icons) {
			col.headerCls.push('action');
			col.name = '<a href="#" class="row-action" data-action="search" ' +
				'title="Search"><i class="fa fa-search"></i></a>' +
				'<div class="filter-box"><input class="filter-input" type="text"></div>';
			this.hasFilter = true;
		}
		col.headerCls = col.headerCls.join(' ');
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

function _getEmptyRow () {
	return '<tr class="grid-row">' +
		'<td class="grid-no-items" colspan="' + this.cfg.columns.length + '">' +
			'No entries</td><tr>';

}


function _getBody () {
	if (!this.items.length) return _getEmptyRow.call(this);
	return this.items
		.map(item => rowTpl({ id: item.id, cells: _getBodyRow.call(this, item) }), this)
		.join('');
}


function populate (filter) {
	if (!this.isRendered) {
		this.el.head.innerHTML = _getHeaderRow.call(this);
		this.isRendered = true;
		if (this.hasFilter) {
			this.el.filterBox = this.el.head.querySelector('.filter-box');
			this.el.filterInput = this.el.head.querySelector('.filter-input');
			this.initFilterEvents();
		}
	}
	this.filter = filter;
	this.filterData();
	this.el.body.innerHTML = _getBody.call(this);
	this.el.foot.innerHTML = _getFooterRow.call(this);
	return this.updateColumnWidths();
}


function draw () {
	var theme = (this.cfg.theme ? 'grid-' + this.cfg.theme : ''),
		target = this.cfg.target;

	this.isRendered = false;
	target.innerHTML = frameTpl({theme});
	this.el = {
		target: target,
		scroller: target.querySelector('.grid-scroller'),
		head: target.querySelector('.grid-header'),
		body: target.querySelector('.grid-body'),
		foot: target.querySelector('.grid-footer'),
		headTable: target.querySelector('.grid-header-table'),
		bodyTable: target.querySelector('.grid-body-table')
	};
	return this;
}

function toggleSearchBox () {
	if (!this.hasFilter) return;
	this.el.filterBox.classList.toggle('visible');
	if (this.el.filterBox.classList.contains('visible')) {
		this.el.filterInput.focus();
	}
}

export default {
	populate,
	draw,
	toggleSearchBox
};

