document.addEventListener("DOMContentLoaded", function() {
	registerEventListeners();
});

function registerEventListeners() {
	_getColorPickerSelectElement().onchange = onChangeColorPickerSelect;
	_getRingContainerElements().forEach(x => x.onclick = onClickRingContainer);
	_getRingContainerElements().forEach(x => x.oncontextmenu = onContextMenuRingContainer);
	_getAddRowElement().onclick = onClickAddRow;
	//_getRemoveRowElement().onclick = onClickRemoveRow;
	_getAddColumnElement().onclick = onClickAddColumn;
	//_getRemoveColumnElement().onclick = onClickRemoveColumn;
}

function onChangeColorPickerSelect(event) {
    var newValue = _getColorPickerSelectElement().value;
	setColorPickerPreviewValue(newValue);
}

function onClickRingContainer(event) {
	var ringContainer = event.target.closest('.ring-container');
	ringContainer.style['border-color'] = _getColorPickerSelectElement().value;
}

function onContextMenuRingContainer(event) {
	event.preventDefault();
	var ringContainer = event.target.closest('.ring-container');
	ringContainer.style['border-color'] = '';
}

function setColorPickerPreviewValue (value) {
	_getColorPickerPreviewElement().value = value;
}

function onClickAddRow() {
	var rows = _getChainmailRowElements();
	var rowCount = rows.length;
	
	if(rowCount === 0) {
		_appendRowToChainmail(1);
	}
	
	if(rowCount === 1) {
		var previousRingCount = rows[0].children.length;
		
		if(previousRingCount === 1) {
		    _appendRowToChainmail(1);
		}
		
		if(previousRingCount >= 2) {
			_appendRowToChainmail(previousRingCount-1);
		}
		// todo:
		// if first row has only one ring, then:
		//   - add a ring to the first row
		//   - add a new row
		// if first row has more than one ring
		//   - add new row with 1 ring fewer
	}
	
	if(rowCount >= 2) {
		var newRowRingCount = rows[rowCount-2].children.length;
		_appendRowToChainmail(newRowRingCount);
	}
	
	// todo: consider doing this at DOMParser time to avoid so many reregistrations
	registerEventListeners();
}

function onClickAddColumn() {
	var rows = _getChainmailRowElements();
	var rowCount = rows.length;
	
	if(rowCount === 0 || rowCount === 1) {
		_appendRowToChainmail(1);
	}
	
	if(rowCount >= 2) {
		// todo: address assumption that this condition will always pick the right rows
		// or maybe just make it more readable
		var isRowRingCountEqual = rows[0].children.length === rows[1].children.length;
		var targetRows = [];
		
		// if odd and even rows have the same ring count, it's even's turn
		// todo: make a _get* convenience method out of this (even / odd)
		if(!isRowRingCountEqual) {
			console.log(rows);
			targetRows = [...rows].filter((row, index) => !!(index % 2));
		}
		
		if(isRowRingCountEqual) {
			targetRows = [...rows].filter((row, index) => !(index % 2));
		}
		
		targetRows.forEach((row, index) => _appendRingToRow(row));
	}
	
	// todo: consider doing this at DOMParser time to avoid so many reregistrations
	registerEventListeners();
}

function _getRingTemplate() {
	// todo: apply default metal
	return `
		<div class="ring-container">
			<div class="ring-partial ring-partial_top"><div class="ring"></div></div>
			<div class="ring-partial ring-partial_middle"><div class="ring"></div></div>
			<div class="ring-partial ring-partial_bottom"><div class="ring"></div></div>
		</div>	
	`;
}

function _getRowTemplate(ringCount = 1) {
	return `
		<div class="row">
			${Array(ringCount).fill(_getRingTemplate()).join('')}
		</div>
	`;
}

function _appendRowToChainmail(ringCount = 1) {
	var parser = new DOMParser();
	var rowTemplate = _getRowTemplate(ringCount);
	var rowElement = parser.parseFromString(rowTemplate, 'text/html').body.children[0];
	_getChainmailContainerElement().appendChild(rowElement);
}

function _appendRingToRow(rowElement) {
	var parser = new DOMParser();
	var ringTemplate = _getRingTemplate();
	var ringElement = parser.parseFromString(ringTemplate, 'text/html').body.children[0];
	
	rowElement.appendChild(ringElement);
}

// todo: make constants out of selector strings
function _getColorPickerSelectElement() {
	return document.getElementById('color-picker_select');
}

function _getColorPickerPreviewElement() {
	return document.getElementById('color-picker_preview');
}

function _getRingContainerElements() {
	return document.querySelectorAll('.ring-container');
}

function _getChainmailRowElements() {
	return document.querySelectorAll('.row');
}

function _getChainmailContainerElement() {
	return document.getElementById('chainmail-container');
}

function _getAddRowElement() {
	return document.getElementById('add-row');
}

function _getAddColumnElement() {
	return document.getElementById('add-column');
}
/*
  form action wishlist:
    - click and drag to change metals as you hover
	- toggle corner rings (those ones with only one connection, stragglers)
*/