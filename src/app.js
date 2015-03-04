import Grid from 'grid';

var data = {
	total: 10,
	totalAmount: 100,
	items: [
		{ id: 1, date: '2015-01-01', amount: 21 },
		{ id: 2, date: '2015-01-02', amount: 22 },
		{ id: 3, date: '2015-01-03', amount: 23 },
		{ id: 4, date: '2015-01-04', amount: 24 },
		{ id: 5, date: '2015-01-05', amount: 25 },
		{ id: 6, date: '2015-01-05', amount: 26 },
		{ id: 7, date: '2015-01-05', amount: 27 },
		{ id: 8, date: '2015-01-05', amount: 28 },
		{ id: 9, date: '2015-01-05', amount: 29 },
		{ id: 10, date: '2015-01-05', amount: 30 },
		{ id: 11, date: '2015-01-05', amount: 31 }
	]
};

var grid = new Grid({
	target: document.getElementById('grid'),
	sort: { by: 'date', order: 'desc' },
	dataSource: function (params) {
		//return $.ajax('data.json', params);
		return data;
	},
	columns: [
		{ name: 'Date', field: 'date', cls: 'date', sortable: true, footer: 'Total' },
		{ name: 'Amount', field: 'amount', cls: 'amount', sortable: true,
			renderer: function (txt) { return '€' + txt; /*rec.amount*/ },
			footer: function (data) { return '€' + data.totalAmount; }
		},
		{ width: 70, cls: 'action', icons: {
			info: { cls: 'info', action: function (item, row) {
				this.selectRow(row, true);
				console.log(item, row);

			}}
		}}
	]
});

// grid.load();
grid.setData(data);
