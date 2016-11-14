function _type (items, field) {
	if (!items || !items.length) return 'str';
	let i, v, t, item;
	for (i = 0; item = items[i]; i++) {
		if (item && item[field]) v = (typeof item[field]);
		if (v === 'number' || v === 'string') t = v.substr(0, 3);
		if (t) break;
	}
	return t || 'str';
}


function _sortFn (sort, items) {
	const by = sort.by;
	const order = sort.order;
	const sortType = _type(items, by);
	const strCmp = (a, b) => ('' + a[by]).toLowerCase().localeCompare(('' + b[by]).toLowerCase());

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

function _fuzzy (hay, s) {
	s = ('' + s).toLowerCase();
	hay = ('' + hay).toLowerCase();
	let n = -1;
	for (let l of s) if (!~(n = hay.indexOf(l, n + 1))) return false;
	return true;
}



function load (params = {}) {
	this.data = {};
	this.items = [];
	if (!this.cfg.dataSource) throw new Error('No data source');
	const src = this.cfg.dataSource(params);
	if (src instanceof Promise) src.then(this.setData.bind(this));
	else this.setData(src);
	return this;
}


function setData (data) {
	if (!data) throw new Error('No data!');
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

	if (this.originalItems.length) {
		this.originalItems.sort(_sortFn({ by: 'id', order: 'desc' }, this.originalItems));
		if (sortBy) this.originalItems.sort(_sortFn(this.cfg.sort, this.originalItems));
	}
	this.populate();

	const all = this.el.head.querySelectorAll('.sort .fa-sort');
	const cur = this.el.head.querySelector('.sort.' + this.cfg.sort.by + ' .fa-sort');

	for (let el of all) el.classList.remove('fa-sort-asc', 'fa-sort-desc');
	if (cur) cur.classList.add('fa-sort-' + this.cfg.sort.order);

	return this;
}


function getItemById (id) {
	id = id.toString();
	return this.items.filter(item => item.id.toString() === id)[0];
}


function filterData () {
	if (!this.filter) {
		this.items = Object.assign([], this.originalItems);
		return;
	}
	this.items = [];
	for (let item of this.originalItems) {
		for (let f in item) {
			if (_fuzzy(item[f], this.filter)) {
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
