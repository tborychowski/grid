const frameTpl = require('./templates/grid-frame.html');
const rowTpl = require('./templates/body-row.html');
const headerCellTpl = require('./templates/header-cell.html');
const footerCellTpl = require('./templates/footer-cell.html');


function _getRowIcons (icons) {
	let iconHtml = '';
	for (let icon in icons) {
		let title = icons[icon] && icons[icon].title || icon;
		iconHtml += '<a href="#" class="row-action" ' +
			'data-action="' + icon + '" ' +
			'title="' + title + '" ' +
			'><i class="fa fa-' + icon + '"></i></a>';
	}
	return iconHtml;
}


function _getHeaderRow () {
	const cells = [];
	const hasFilter = (this.cfg.filter === true || typeof this.cfg.filter === 'undefined');
	for (let col of this.cfg.columns) {
		let sortCls = (col.sortable ? 'sort' : '');
		col.headerCls = ['grid-cell', 'grid-header-cell', col.field, sortCls];
		if (!col.name && (col.icons && hasFilter)) {
			col.headerCls.push('action');
			col.name = '<a href="#" class="row-action filter-btn" data-action="search" ' +
				'title="Search"><i class="fa fa-search"></i></a>' +
				'<div class="filter-box"><input class="filter-input" type="text"></div>';
			this.hasFilter = true;
		}
		else this.hasFilter = !!this.cfg.filter;
		col.headerCls = col.headerCls.join(' ');
		cells.push(headerCellTpl(col));
	}
	return cells.join('');
}


function _getFooterRow () {
	const cells = [];
	for (let col of this.cfg.columns) {
		col.footerCls = ['grid-cell', 'grid-footer-cell', col.field].join(' ');
		if (typeof col.footer === 'function') col.footerText = col.footer.call(this, this.data);
		else col.footerText = col.footer || '';
		cells.push(footerCellTpl(col));
	}
	return cells.join('');
}

function _getBodyRow (item) {
	const cells = [];
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
	return `<tr class="grid-row"><td class="grid-no-items" colspan="${this.cfg.columns.length}">No entries</td><tr>`;
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
		if (this.hasFilter) {
			if (this.cfg.filter) {
				if (this.cfg.filter.input) this.el.filterInput = document.querySelector(this.cfg.filter.input);
				if (this.cfg.filter.box) this.el.filterBox = this.el.target.querySelector(this.cfg.filter.box);
				if (this.cfg.filter.btn) this.el.filterBtn = document.querySelector(this.cfg.filter.btn);

				if (!this.el.filterInput) console.error(`External filter input not found: ${this.cfg.filter.input}`);
			}
			else {
				this.el.filterBox = this.el.target.querySelector('.filter-box');
				this.el.filterInput = this.el.target.querySelector('.filter-input');
				this.el.filterBtn = this.el.target.querySelector('.filter-btn');
			}
			this.initFilterEvents();
		}
		this.isRendered = true;
	}
	this.filter = filter;
	this.filterData();
	this.el.body.innerHTML = _getBody.call(this);
	this.el.foot.innerHTML = _getFooterRow.call(this);
	return this.updateColumnWidths();
}


function draw () {
	const theme = (this.cfg.theme ? 'grid-' + this.cfg.theme : '');
	const target = this.cfg.target;

	this.isRendered = false;
	target.innerHTML = frameTpl({theme});
	this.el = {
		target,
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
	if (!this.hasFilter || !this.el.filterBox) return;
	const filterCell = this.el.filterBox.parentNode.classList;
	filterCell.toggle('filter-visible');
	if (filterCell.contains('filter-visible')) this.el.filterInput.focus();
}

export default {
	populate,
	draw,
	toggleSearchBox
};

