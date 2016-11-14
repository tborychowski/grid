function selectRow (row, unselectOther) {
	if (unselectOther) this.unselectRows();
	row.classList.add('selected');
	return this;
}


function unselectRows () {
	const rows = this.el.body.querySelectorAll('.grid-row.selected');
	for (let row of rows) row.classList.remove('selected');
	return this;
}


export default {
	selectRow,
	unselectRows
};

