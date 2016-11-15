function _closest (el, selector) {
	let has = false;
	while (!has && el) {
		has = el.matches(selector);
		if (has) return el;
		el = el.parentNode;
		if (el.tagName === 'HTML') return null;
	}
	return null;
}


function _onClick (e) {
	let target = e.target, action = '';

	if (_closest(target, 'td.sort')) {
		target = _closest(target, 'td.sort');
		let icon = target.querySelector('.fa-sort');
		let isDesc = icon.classList.contains('fa-sort-desc');
		this.sortItems(target.dataset.sortby, isDesc ? 'asc' : 'desc');
	}

	else if (_closest(target, '.grid-header-cell.action')) {
		target = _closest(target, '.row-action');
		if (target && target.dataset) action = target.dataset.action;
		if (action === 'search') this.toggleSearchBox();
		e.preventDefault();
	}

	else if (_closest(target, '.row-action')) {
		target = _closest(target, '.row-action');
		e.preventDefault();
		let row = _closest(target, '.grid-row'),
			id = row && +row.dataset.id,
			item = row && this.getItemById(id);
		if (target.dataset) action = target.dataset.action;
		this.iconHandlers[action].call(this, item || null, row || null);
	}
	else if (_closest(target, '.grid-row')) {
		let row = _closest(target, '.grid-row'),
			id = row && +row.dataset.id,
			item = row && this.getItemById(id);
		this.cfg.onRowClick.call(this, item || null, row || null);
	}
}

function _onScroll () {
	const scrld = this.el.scroller.scrollTop > 0;
	this.el.headTable.classList.toggle('grid-header-scroll-over', scrld);
}

function _onResize () {
	if (this.resizeThrottle) window.clearTimeout(this.resizeThrottle);
	this.resizeThrottle = setTimeout(this.updateTableWidths.bind(this), 200);
}

function initEvents () {
	this.el.scroller.addEventListener('scroll', _onScroll.bind(this));
	this.el.target.addEventListener('click', _onClick.bind(this));
	window.addEventListener('resize', _onResize.bind(this));
}

function initFilterEvents () {
	if (!this.hasFilter) return;
	this.el.filterInput.addEventListener('input', () => {
		this.populate(this.el.filterInput.value);
	});

	this.el.filterInput.addEventListener('keyup', (e) => {
		if (e.keyCode === 27) {
			this.el.filterInput.value = '';
			if (this.el.filterBtn) this.el.filterBtn.focus();
			this.populate();
		}
	});
	this.el.filterInput.addEventListener('blur', (e) => {
		if (!e.target.value) this.toggleSearchBox();
	});
}


export default {
	initEvents,
	initFilterEvents
};
