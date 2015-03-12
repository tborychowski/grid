function selectRow (row, unselectOther) {
	if (unselectOther) this.unselectRows();
	row.classList.add('selected');
	return this;
}


function unselectRows () {
	var rows = this.el.body.querySelectorAll('.grid-row.selected'), i = 0, l = rows.length;
	for (; i < l; i++) rows[i].classList.remove('selected');
	return this;
}


export default {
	selectRow,
	unselectRows
};

