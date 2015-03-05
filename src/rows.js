function selectRow (row, unselectOther) {
	if (unselectOther) this.unselectRows();
	row.classList.add('selected');
	return this;
}


function unselectRows () {
	var row, rows = this.el.body.querySelectorAll('.grid-row.selected');
	for (row of rows) row.classList.remove('selected');
	return this;
}


export default {
	selectRow,
	unselectRows
};

