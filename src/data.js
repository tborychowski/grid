function _type (items, field) {
	if (!items || !items.length) return 'str';
	var i, v, t, item;
	for (i = 0; item = items[i]; i++) {
		if (item && item[field]) v = (typeof item[field]);
		if (v === 'number' || v === 'string') t = v.substr(0, 3);
		if (t) break;
	}
	return t || 'str';
}


function _sortFn (sort, items) {
	var by = sort.by, order = sort.order, sortType = _type(items, by),
		strCmp = (a, b) => ('' + a[by]).toLowerCase().localeCompare(('' + b[by]).toLowerCase());

	// compare as numbers
	if (sortType === 'num') {
		if (order === 'asc') return (a, b) => a[by] - b[by];
		else return (a, b) => b[by] - a[by];
	}
	// compare as strings
	else {
		if (order === 'asc') return (a, b) => strCmp(a, b);
		else return (a, b) => strCmp(b, a);
	}
}


function load (params = {}) {
	this.data = {};
	this.items = [];
	if (!this.cfg.dataSource) throw 'No data source';
	var src = this.cfg.dataSource(params);
	if (src instanceof Promise) src.then(this.setData.bind(this));
	else this.setData(src);
	return this;
}


function setData (data) {
	if (!data) throw 'No data!';
	this.data = data;
	if (this.cfg.items.root && data[this.cfg.items.root]) {
		this.items = data[this.cfg.items.root] || [];
	}
	else this.items = Array.isArray(data) ? data : [];
	this.originalItems = Object.assign([], this.items);
	return this.sortItems();
}


function sortItems (sortBy, order) {
	if (sortBy) this.cfg.sort.by = sortBy;
	if (order) this.cfg.sort.order = order;

	if (this.items.length) {
		this.items.sort(_sortFn({ by: 'id', order: 'desc'}, this.items));
		if (sortBy) this.items.sort(_sortFn(this.cfg.sort, this.items));
	}
	this.populate();

	var all = this.el.head.querySelectorAll('.sort .fa-sort'),
		cur = this.el.head.querySelector('.sort.' + this.cfg.sort.by + ' .fa-sort');
	for (let i = 0, l = all.length; i < l; i++) {
		all[i].classList.remove('fa-sort-asc', 'fa-sort-desc');
	}
	if (cur) cur.classList.add('fa-sort-' + this.cfg.sort.order);
	return this;
}


function getItemById (id) {
	id = id.toString();
	return this.items.filter(item => item.id.toString() === id)[0];
}

function fuzzy (haystack, s) {
    var hay = ('' + haystack).toLowerCase(), i = 0, n = -1, l;
    s = ('' + s).toLowerCase();
    for (; l = s[i++] ;) if (!~(n = hay.indexOf(l, n + 1))) return false;
    return true;
};


function filterData () {
	if (!this.filter) {
		this.items = Object.assign([], this.originalItems);
		return
	}
	this.items = [];
	for (let item of this.originalItems) {
		for (let f in item) {
			if (fuzzy(item[f], this.filter)) {
				this.items.push(item);
				break;
			}
		}
	}
}

export default {
	load,
	setData,
	sortItems,
	getItemById,
	filterData
};
