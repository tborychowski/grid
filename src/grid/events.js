function _closest (el, selector) {
	var has = false;
	while (!has && el) {
		has = el.matches(selector);
		if (has) return el;
		el = el.parentNode;
		if (el.tagName === 'HTML') return null;
	}
	return null;
}


function _onClick (e) {
	var target = e.target;

	if (_closest(target, 'td.sort')) {
		target = _closest(target, 'td.sort');
		let icon = target.querySelector('.fa-sort');
		let isDesc = icon.classList.contains('fa-sort-desc');
		this.sortItems(target.dataset.sortby, isDesc ? 'asc' : 'desc');
	}

	else if (_closest(target, '.row-action')) {
		target = _closest(target, '.row-action');
		e.preventDefault();
		let row = _closest(target, '.grid-row'),
			action = target.dataset.action,
			id = +row.dataset.id,
			item = this.getItemById(id);
		this.iconHandlers[action].call(this, item, row);
	}
}


function _onScroll () {
	var scrld = this.el.scroller.scrollTop > 0;
	this.el.headTable.classList.toggle('grid-header-scroll-over', scrld);
}


function initEvents () {
	this.el.scroller.addEventListener('scroll', _onScroll.bind(this));
	this.el.target.addEventListener('click', _onClick.bind(this));
}


export default {
	initEvents
};
