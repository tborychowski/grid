(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["lite-grid"] = factory();
	else
		root["lite-grid"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _data = __webpack_require__(1);

	var _data2 = _interopRequireDefault(_data);

	var _events = __webpack_require__(2);

	var _events2 = _interopRequireDefault(_events);

	var _html = __webpack_require__(3);

	var _html2 = _interopRequireDefault(_html);

	var _columns = __webpack_require__(11);

	var _columns2 = _interopRequireDefault(_columns);

	var _rows = __webpack_require__(12);

	var _rows2 = _interopRequireDefault(_rows);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Grid = function Grid(cfg) {
		_classCallCheck(this, Grid);

		var _defaults = {
			theme: 'dark',
			target: document.body,
			sort: { by: 'id', order: 'asc' },
			dataSource: null,
			onRowClick: function onRowClick(item, row) {},
			items: { label: 'items', root: 'items', itemId: 'id' },
			columns: []
		};
		this.cfg = Object.assign(_defaults, cfg);
		this.processColumns().draw().initEvents();
	};

	Object.assign(Grid.prototype, _data2.default, _events2.default, _html2.default, _columns2.default, _rows2.default);

	exports.default = Grid;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	function _type(items, field) {
		if (!items || !items.length) return 'str';
		var i = void 0,
		    v = void 0,
		    t = void 0,
		    item = void 0;
		for (i = 0; item = items[i]; i++) {
			if (item && item[field]) v = _typeof(item[field]);
			if (v === 'number' || v === 'string') t = v.substr(0, 3);
			if (t) break;
		}
		return t || 'str';
	}

	function _sortFn(sort, items) {
		var by = sort.by;
		var order = sort.order;
		var sortType = _type(items, by);
		var strCmp = function strCmp(a, b) {
			return ('' + a[by]).toLowerCase().localeCompare(('' + b[by]).toLowerCase());
		};

		// compare as numbers
		if (sortType === 'num') {
			if (order === 'asc') return function (a, b) {
				return a[by] - b[by];
			};
			return function (a, b) {
				return b[by] - a[by];
			};
		}
		// compare as strings
		if (order === 'asc') return function (a, b) {
			return strCmp(a, b);
		};
		return function (a, b) {
			return strCmp(b, a);
		};
	}

	function _fuzzy(hay, s) {
		s = ('' + s).toLowerCase();
		hay = ('' + hay).toLowerCase();
		var n = -1;
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = s[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var l = _step.value;
				if (!~(n = hay.indexOf(l, n + 1))) return false;
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		return true;
	}

	function load() {
		var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		this.data = {};
		this.items = [];
		if (!this.cfg.dataSource) throw new Error('No data source');
		var src = this.cfg.dataSource(params);
		if (src instanceof Promise) src.then(this.setData.bind(this));else this.setData(src);
		return this;
	}

	function setData(data) {
		if (!data) throw new Error('No data!');
		this.data = data;
		if (this.cfg.items.root && data[this.cfg.items.root]) {
			this.items = data[this.cfg.items.root] || [];
		} else this.items = Array.isArray(data) ? data : [];
		this.originalItems = Object.assign([], this.items);
		return this.sortItems();
	}

	function sortItems(sortBy, order) {
		if (sortBy) this.cfg.sort.by = sortBy;
		if (order) this.cfg.sort.order = order;

		if (this.originalItems.length) {
			this.originalItems.sort(_sortFn({ by: 'id', order: 'desc' }, this.originalItems));
			if (sortBy) this.originalItems.sort(_sortFn(this.cfg.sort, this.originalItems));
		}
		this.populate();

		var all = this.el.head.querySelectorAll('.sort .fa-sort');
		var cur = this.el.head.querySelector('.sort.' + this.cfg.sort.by + ' .fa-sort');

		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = all[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var el = _step2.value;
				el.classList.remove('fa-sort-asc', 'fa-sort-desc');
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}

		if (cur) cur.classList.add('fa-sort-' + this.cfg.sort.order);

		return this;
	}

	function getItemById(id) {
		id = id.toString();
		return this.items.filter(function (item) {
			return item.id.toString() === id;
		})[0];
	}

	function filterData() {
		if (!this.filter) {
			this.items = Object.assign([], this.originalItems);
			return;
		}
		this.items = [];
		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = this.originalItems[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var item = _step3.value;

				for (var f in item) {
					if (_fuzzy(item[f], this.filter)) {
						this.items.push(item);
						break;
					}
				}
			}
		} catch (err) {
			_didIteratorError3 = true;
			_iteratorError3 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion3 && _iterator3.return) {
					_iterator3.return();
				}
			} finally {
				if (_didIteratorError3) {
					throw _iteratorError3;
				}
			}
		}
	}

	exports.default = {
		load: load,
		setData: setData,
		sortItems: sortItems,
		getItemById: getItemById,
		filterData: filterData
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function _closest(el, selector) {
		var has = false;
		while (!has && el) {
			has = el.matches(selector);
			if (has) return el;
			el = el.parentNode;
			if (el.tagName === 'HTML') return null;
		}
		return null;
	}

	function _onClick(e) {
		var target = e.target,
		    action = '';

		if (_closest(target, 'td.sort')) {
			target = _closest(target, 'td.sort');
			var icon = target.querySelector('.fa-sort');
			var isDesc = icon.classList.contains('fa-sort-desc');
			this.sortItems(target.dataset.sortby, isDesc ? 'asc' : 'desc');
		} else if (_closest(target, '.grid-header-cell.action')) {
			target = _closest(target, '.row-action');
			if (target && target.dataset) action = target.dataset.action;
			if (action === 'search') this.toggleSearchBox();
			e.preventDefault();
		} else if (_closest(target, '.row-action')) {
			target = _closest(target, '.row-action');
			e.preventDefault();
			var row = _closest(target, '.grid-row'),
			    id = row && +row.dataset.id,
			    item = row && this.getItemById(id);
			if (target.dataset) action = target.dataset.action;
			this.iconHandlers[action].call(this, item || null, row || null);
		} else if (_closest(target, '.grid-row')) {
			var _row = _closest(target, '.grid-row'),
			    _id = _row && +_row.dataset.id,
			    _item = _row && this.getItemById(_id);
			this.cfg.onRowClick.call(this, _item || null, _row || null);
		}
	}

	function _onScroll() {
		var scrld = this.el.scroller.scrollTop > 0;
		this.el.headTable.classList.toggle('grid-header-scroll-over', scrld);
	}

	function _onResize() {
		if (this.resizeThrottle) window.clearTimeout(this.resizeThrottle);
		this.resizeThrottle = setTimeout(this.updateTableWidths.bind(this), 200);
	}

	function initEvents() {
		this.el.scroller.addEventListener('scroll', _onScroll.bind(this));
		this.el.target.addEventListener('click', _onClick.bind(this));
		window.addEventListener('resize', _onResize.bind(this));
	}

	function initFilterEvents() {
		var _this = this;

		if (!this.hasFilter) return;
		this.el.filterInput.addEventListener('input', function () {
			_this.populate(_this.el.filterInput.value);
		});

		this.el.filterInput.addEventListener('keyup', function (e) {
			if (e.keyCode === 27) {
				_this.el.filterInput.value = '';
				if (_this.el.filterBtn) _this.el.filterBtn.focus();
				_this.populate();
			}
		});
		this.el.filterInput.addEventListener('blur', function (e) {
			if (!e.target.value) _this.toggleSearchBox();
		});
	}

	exports.default = {
		initEvents: initEvents,
		initFilterEvents: initFilterEvents
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var frameTpl = __webpack_require__(4);
	var rowTpl = __webpack_require__(8);
	var headerCellTpl = __webpack_require__(9);
	var footerCellTpl = __webpack_require__(10);

	function _getRowIcons(icons) {
		var iconHtml = '';
		for (var icon in icons) {
			var title = icons[icon] && icons[icon].title || icon;
			iconHtml += '<a href="#" class="row-action" ' + 'data-action="' + icon + '" ' + 'title="' + title + '" ' + '><i class="fa fa-' + icon + '"></i></a>';
		}
		return iconHtml;
	}

	function _getHeaderRow() {
		var cells = [];
		var hasFilter = this.cfg.filter === true || typeof this.cfg.filter === 'undefined' || _typeof(this.cfg.filter) === 'object';

		this.hasFilter = hasFilter;
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = this.cfg.columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var col = _step.value;

				var sortCls = col.sortable ? 'sort' : '';
				col.headerCls = ['grid-cell', 'grid-header-cell', col.field, sortCls];
				if (!col.name && col.icons && hasFilter) {
					col.headerCls.push('action');
					col.name = '<a href="#" class="row-action filter-btn" data-action="search" ' + 'title="Search"><i class="fa fa-search"></i></a>' + '<div class="filter-box"><input class="filter-input" type="text"></div>';
					this.hasFilter = true;
				}
				col.headerCls = col.headerCls.join(' ');
				cells.push(headerCellTpl(col));
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		return cells.join('');
	}

	function _getFooterRow() {
		var cells = [];
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = this.cfg.columns[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var col = _step2.value;

				col.footerCls = ['grid-cell', 'grid-footer-cell', col.field].join(' ');
				if (typeof col.footer === 'function') col.footerText = col.footer.call(this, this.data);else col.footerText = col.footer || '';
				cells.push(footerCellTpl(col));
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}

		return cells.join('');
	}

	function _getBodyRow(item) {
		var cells = [];
		var _iteratorNormalCompletion3 = true;
		var _didIteratorError3 = false;
		var _iteratorError3 = undefined;

		try {
			for (var _iterator3 = this.cfg.columns[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
				var col = _step3.value;

				var cls = [col.field, col.icons ? 'action' : ''].join(' ');
				var text = item[col.field];

				if (typeof col.renderer === 'function') text = col.renderer.call(this, text, item);else if (col.icons) text = _getRowIcons(col.icons);

				cells.push({ cls: cls, text: text });
			}
		} catch (err) {
			_didIteratorError3 = true;
			_iteratorError3 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion3 && _iterator3.return) {
					_iterator3.return();
				}
			} finally {
				if (_didIteratorError3) {
					throw _iteratorError3;
				}
			}
		}

		return cells;
	}

	function _getEmptyRow() {
		return '<tr class="grid-row"><td class="grid-no-items" colspan="' + this.cfg.columns.length + '">No entries</td><tr>';
	}

	function _getBody() {
		var _this = this;

		if (!this.items.length) return _getEmptyRow.call(this);
		return this.items.map(function (item) {
			return rowTpl({ id: item.id, cells: _getBodyRow.call(_this, item) });
		}, this).join('');
	}

	function populate(filter) {
		if (!this.isRendered) {
			this.el.head.innerHTML = _getHeaderRow.call(this);
			if (this.hasFilter) {
				if (this.cfg.filter) {
					if (this.cfg.filter.input) this.el.filterInput = document.querySelector(this.cfg.filter.input);
					if (this.cfg.filter.box) this.el.filterBox = this.el.target.querySelector(this.cfg.filter.box);
					if (!this.el.filterInput) console.error('External filter input not found: ' + this.cfg.filter.input);
				} else {
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

	function draw() {
		var theme = this.cfg.theme ? 'grid-' + this.cfg.theme : '';
		var target = this.cfg.target;

		this.isRendered = false;
		target.innerHTML = frameTpl({ theme: theme });
		this.el = {
			target: target,
			scroller: target.querySelector('.grid-scroller'),
			head: target.querySelector('.grid-header'),
			body: target.querySelector('.grid-body'),
			foot: target.querySelector('.grid-footer'),
			headTable: target.querySelector('.grid-header-table'),
			bodyTable: target.querySelector('.grid-body-table')
		};
		return this;
	}

	function toggleSearchBox() {
		if (!this.hasFilter || !this.el.filterBox) return;
		var filterCell = this.el.filterBox.parentNode.classList;
		filterCell.toggle('filter-visible');
		if (filterCell.contains('filter-visible')) this.el.filterInput.focus();
	}

	exports.default = {
		populate: populate,
		draw: draw,
		toggleSearchBox: toggleSearchBox
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var H = __webpack_require__(5);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"grid ");t.b(t.v(t.f("theme",c,p,0)));t.b("\">");t.b("\n" + i);t.b("	<table class=\"grid-table grid-header-table\">");t.b("\n" + i);t.b("		<thead><tr class=\"grid-header\"></tr></thead>");t.b("\n" + i);t.b("	</table>");t.b("\n" + i);t.b("	<div class=\"grid-scroller\">");t.b("\n" + i);t.b("		<table class=\"grid-table grid-body-table\">");t.b("\n" + i);t.b("			<tbody class=\"grid-body\"></tbody>");t.b("\n" + i);t.b("		</table>");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("	<table class=\"grid-table grid-footer-table\">");t.b("\n" + i);t.b("		<tfoot><tr class=\"grid-footer\"></tr></tfoot>");t.b("\n" + i);t.b("	</table>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }}, "<div class=\"grid {{theme}}\">\n\t<table class=\"grid-table grid-header-table\">\n\t\t<thead><tr class=\"grid-header\"></tr></thead>\n\t</table>\n\t<div class=\"grid-scroller\">\n\t\t<table class=\"grid-table grid-body-table\">\n\t\t\t<tbody class=\"grid-body\"></tbody>\n\t\t</table>\n\t</div>\n\t<table class=\"grid-table grid-footer-table\">\n\t\t<tfoot><tr class=\"grid-footer\"></tr></tfoot>\n\t</table>\n</div>", H);return T.render.apply(T, arguments); };

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */

	// This file is for use with Node.js. See dist/ for browser files.

	var Hogan = __webpack_require__(6);
	Hogan.Template = __webpack_require__(7).Template;
	Hogan.template = Hogan.Template;
	module.exports = Hogan;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */

	(function (Hogan) {
	  // Setup regex  assignments
	  // remove whitespace according to Mustache spec
	  var rIsWhitespace = /\S/,
	      rQuot = /\"/g,
	      rNewline =  /\n/g,
	      rCr = /\r/g,
	      rSlash = /\\/g,
	      rLineSep = /\u2028/,
	      rParagraphSep = /\u2029/;

	  Hogan.tags = {
	    '#': 1, '^': 2, '<': 3, '$': 4,
	    '/': 5, '!': 6, '>': 7, '=': 8, '_v': 9,
	    '{': 10, '&': 11, '_t': 12
	  };

	  Hogan.scan = function scan(text, delimiters) {
	    var len = text.length,
	        IN_TEXT = 0,
	        IN_TAG_TYPE = 1,
	        IN_TAG = 2,
	        state = IN_TEXT,
	        tagType = null,
	        tag = null,
	        buf = '',
	        tokens = [],
	        seenTag = false,
	        i = 0,
	        lineStart = 0,
	        otag = '{{',
	        ctag = '}}';

	    function addBuf() {
	      if (buf.length > 0) {
	        tokens.push({tag: '_t', text: new String(buf)});
	        buf = '';
	      }
	    }

	    function lineIsWhitespace() {
	      var isAllWhitespace = true;
	      for (var j = lineStart; j < tokens.length; j++) {
	        isAllWhitespace =
	          (Hogan.tags[tokens[j].tag] < Hogan.tags['_v']) ||
	          (tokens[j].tag == '_t' && tokens[j].text.match(rIsWhitespace) === null);
	        if (!isAllWhitespace) {
	          return false;
	        }
	      }

	      return isAllWhitespace;
	    }

	    function filterLine(haveSeenTag, noNewLine) {
	      addBuf();

	      if (haveSeenTag && lineIsWhitespace()) {
	        for (var j = lineStart, next; j < tokens.length; j++) {
	          if (tokens[j].text) {
	            if ((next = tokens[j+1]) && next.tag == '>') {
	              // set indent to token value
	              next.indent = tokens[j].text.toString()
	            }
	            tokens.splice(j, 1);
	          }
	        }
	      } else if (!noNewLine) {
	        tokens.push({tag:'\n'});
	      }

	      seenTag = false;
	      lineStart = tokens.length;
	    }

	    function changeDelimiters(text, index) {
	      var close = '=' + ctag,
	          closeIndex = text.indexOf(close, index),
	          delimiters = trim(
	            text.substring(text.indexOf('=', index) + 1, closeIndex)
	          ).split(' ');

	      otag = delimiters[0];
	      ctag = delimiters[delimiters.length - 1];

	      return closeIndex + close.length - 1;
	    }

	    if (delimiters) {
	      delimiters = delimiters.split(' ');
	      otag = delimiters[0];
	      ctag = delimiters[1];
	    }

	    for (i = 0; i < len; i++) {
	      if (state == IN_TEXT) {
	        if (tagChange(otag, text, i)) {
	          --i;
	          addBuf();
	          state = IN_TAG_TYPE;
	        } else {
	          if (text.charAt(i) == '\n') {
	            filterLine(seenTag);
	          } else {
	            buf += text.charAt(i);
	          }
	        }
	      } else if (state == IN_TAG_TYPE) {
	        i += otag.length - 1;
	        tag = Hogan.tags[text.charAt(i + 1)];
	        tagType = tag ? text.charAt(i + 1) : '_v';
	        if (tagType == '=') {
	          i = changeDelimiters(text, i);
	          state = IN_TEXT;
	        } else {
	          if (tag) {
	            i++;
	          }
	          state = IN_TAG;
	        }
	        seenTag = i;
	      } else {
	        if (tagChange(ctag, text, i)) {
	          tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,
	                       i: (tagType == '/') ? seenTag - otag.length : i + ctag.length});
	          buf = '';
	          i += ctag.length - 1;
	          state = IN_TEXT;
	          if (tagType == '{') {
	            if (ctag == '}}') {
	              i++;
	            } else {
	              cleanTripleStache(tokens[tokens.length - 1]);
	            }
	          }
	        } else {
	          buf += text.charAt(i);
	        }
	      }
	    }

	    filterLine(seenTag, true);

	    return tokens;
	  }

	  function cleanTripleStache(token) {
	    if (token.n.substr(token.n.length - 1) === '}') {
	      token.n = token.n.substring(0, token.n.length - 1);
	    }
	  }

	  function trim(s) {
	    if (s.trim) {
	      return s.trim();
	    }

	    return s.replace(/^\s*|\s*$/g, '');
	  }

	  function tagChange(tag, text, index) {
	    if (text.charAt(index) != tag.charAt(0)) {
	      return false;
	    }

	    for (var i = 1, l = tag.length; i < l; i++) {
	      if (text.charAt(index + i) != tag.charAt(i)) {
	        return false;
	      }
	    }

	    return true;
	  }

	  // the tags allowed inside super templates
	  var allowedInSuper = {'_t': true, '\n': true, '$': true, '/': true};

	  function buildTree(tokens, kind, stack, customTags) {
	    var instructions = [],
	        opener = null,
	        tail = null,
	        token = null;

	    tail = stack[stack.length - 1];

	    while (tokens.length > 0) {
	      token = tokens.shift();

	      if (tail && tail.tag == '<' && !(token.tag in allowedInSuper)) {
	        throw new Error('Illegal content in < super tag.');
	      }

	      if (Hogan.tags[token.tag] <= Hogan.tags['$'] || isOpener(token, customTags)) {
	        stack.push(token);
	        token.nodes = buildTree(tokens, token.tag, stack, customTags);
	      } else if (token.tag == '/') {
	        if (stack.length === 0) {
	          throw new Error('Closing tag without opener: /' + token.n);
	        }
	        opener = stack.pop();
	        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
	          throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);
	        }
	        opener.end = token.i;
	        return instructions;
	      } else if (token.tag == '\n') {
	        token.last = (tokens.length == 0) || (tokens[0].tag == '\n');
	      }

	      instructions.push(token);
	    }

	    if (stack.length > 0) {
	      throw new Error('missing closing tag: ' + stack.pop().n);
	    }

	    return instructions;
	  }

	  function isOpener(token, tags) {
	    for (var i = 0, l = tags.length; i < l; i++) {
	      if (tags[i].o == token.n) {
	        token.tag = '#';
	        return true;
	      }
	    }
	  }

	  function isCloser(close, open, tags) {
	    for (var i = 0, l = tags.length; i < l; i++) {
	      if (tags[i].c == close && tags[i].o == open) {
	        return true;
	      }
	    }
	  }

	  function stringifySubstitutions(obj) {
	    var items = [];
	    for (var key in obj) {
	      items.push('"' + esc(key) + '": function(c,p,t,i) {' + obj[key] + '}');
	    }
	    return "{ " + items.join(",") + " }";
	  }

	  function stringifyPartials(codeObj) {
	    var partials = [];
	    for (var key in codeObj.partials) {
	      partials.push('"' + esc(key) + '":{name:"' + esc(codeObj.partials[key].name) + '", ' + stringifyPartials(codeObj.partials[key]) + "}");
	    }
	    return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs);
	  }

	  Hogan.stringify = function(codeObj, text, options) {
	    return "{code: function (c,p,i) { " + Hogan.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) +  "}";
	  }

	  var serialNo = 0;
	  Hogan.generate = function(tree, text, options) {
	    serialNo = 0;
	    var context = { code: '', subs: {}, partials: {} };
	    Hogan.walk(tree, context);

	    if (options.asString) {
	      return this.stringify(context, text, options);
	    }

	    return this.makeTemplate(context, text, options);
	  }

	  Hogan.wrapMain = function(code) {
	    return 'var t=this;t.b(i=i||"");' + code + 'return t.fl();';
	  }

	  Hogan.template = Hogan.Template;

	  Hogan.makeTemplate = function(codeObj, text, options) {
	    var template = this.makePartials(codeObj);
	    template.code = new Function('c', 'p', 'i', this.wrapMain(codeObj.code));
	    return new this.template(template, text, this, options);
	  }

	  Hogan.makePartials = function(codeObj) {
	    var key, template = {subs: {}, partials: codeObj.partials, name: codeObj.name};
	    for (key in template.partials) {
	      template.partials[key] = this.makePartials(template.partials[key]);
	    }
	    for (key in codeObj.subs) {
	      template.subs[key] = new Function('c', 'p', 't', 'i', codeObj.subs[key]);
	    }
	    return template;
	  }

	  function esc(s) {
	    return s.replace(rSlash, '\\\\')
	            .replace(rQuot, '\\\"')
	            .replace(rNewline, '\\n')
	            .replace(rCr, '\\r')
	            .replace(rLineSep, '\\u2028')
	            .replace(rParagraphSep, '\\u2029');
	  }

	  function chooseMethod(s) {
	    return (~s.indexOf('.')) ? 'd' : 'f';
	  }

	  function createPartial(node, context) {
	    var prefix = "<" + (context.prefix || "");
	    var sym = prefix + node.n + serialNo++;
	    context.partials[sym] = {name: node.n, partials: {}};
	    context.code += 't.b(t.rp("' +  esc(sym) + '",c,p,"' + (node.indent || '') + '"));';
	    return sym;
	  }

	  Hogan.codegen = {
	    '#': function(node, context) {
	      context.code += 'if(t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),' +
	                      'c,p,0,' + node.i + ',' + node.end + ',"' + node.otag + " " + node.ctag + '")){' +
	                      't.rs(c,p,' + 'function(c,p,t){';
	      Hogan.walk(node.nodes, context);
	      context.code += '});c.pop();}';
	    },

	    '^': function(node, context) {
	      context.code += 'if(!t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){';
	      Hogan.walk(node.nodes, context);
	      context.code += '};';
	    },

	    '>': createPartial,
	    '<': function(node, context) {
	      var ctx = {partials: {}, code: '', subs: {}, inPartial: true};
	      Hogan.walk(node.nodes, ctx);
	      var template = context.partials[createPartial(node, context)];
	      template.subs = ctx.subs;
	      template.partials = ctx.partials;
	    },

	    '$': function(node, context) {
	      var ctx = {subs: {}, code: '', partials: context.partials, prefix: node.n};
	      Hogan.walk(node.nodes, ctx);
	      context.subs[node.n] = ctx.code;
	      if (!context.inPartial) {
	        context.code += 't.sub("' + esc(node.n) + '",c,p,i);';
	      }
	    },

	    '\n': function(node, context) {
	      context.code += write('"\\n"' + (node.last ? '' : ' + i'));
	    },

	    '_v': function(node, context) {
	      context.code += 't.b(t.v(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
	    },

	    '_t': function(node, context) {
	      context.code += write('"' + esc(node.text) + '"');
	    },

	    '{': tripleStache,

	    '&': tripleStache
	  }

	  function tripleStache(node, context) {
	    context.code += 't.b(t.t(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
	  }

	  function write(s) {
	    return 't.b(' + s + ');';
	  }

	  Hogan.walk = function(nodelist, context) {
	    var func;
	    for (var i = 0, l = nodelist.length; i < l; i++) {
	      func = Hogan.codegen[nodelist[i].tag];
	      func && func(nodelist[i], context);
	    }
	    return context;
	  }

	  Hogan.parse = function(tokens, text, options) {
	    options = options || {};
	    return buildTree(tokens, '', [], options.sectionTags || []);
	  }

	  Hogan.cache = {};

	  Hogan.cacheKey = function(text, options) {
	    return [text, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join('||');
	  }

	  Hogan.compile = function(text, options) {
	    options = options || {};
	    var key = Hogan.cacheKey(text, options);
	    var template = this.cache[key];

	    if (template) {
	      var partials = template.partials;
	      for (var name in partials) {
	        delete partials[name].instance;
	      }
	      return template;
	    }

	    template = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
	    return this.cache[key] = template;
	  }
	})( true ? exports : Hogan);


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */

	var Hogan = {};

	(function (Hogan) {
	  Hogan.Template = function (codeObj, text, compiler, options) {
	    codeObj = codeObj || {};
	    this.r = codeObj.code || this.r;
	    this.c = compiler;
	    this.options = options || {};
	    this.text = text || '';
	    this.partials = codeObj.partials || {};
	    this.subs = codeObj.subs || {};
	    this.buf = '';
	  }

	  Hogan.Template.prototype = {
	    // render: replaced by generated code.
	    r: function (context, partials, indent) { return ''; },

	    // variable escaping
	    v: hoganEscape,

	    // triple stache
	    t: coerceToString,

	    render: function render(context, partials, indent) {
	      return this.ri([context], partials || {}, indent);
	    },

	    // render internal -- a hook for overrides that catches partials too
	    ri: function (context, partials, indent) {
	      return this.r(context, partials, indent);
	    },

	    // ensurePartial
	    ep: function(symbol, partials) {
	      var partial = this.partials[symbol];

	      // check to see that if we've instantiated this partial before
	      var template = partials[partial.name];
	      if (partial.instance && partial.base == template) {
	        return partial.instance;
	      }

	      if (typeof template == 'string') {
	        if (!this.c) {
	          throw new Error("No compiler available.");
	        }
	        template = this.c.compile(template, this.options);
	      }

	      if (!template) {
	        return null;
	      }

	      // We use this to check whether the partials dictionary has changed
	      this.partials[symbol].base = template;

	      if (partial.subs) {
	        // Make sure we consider parent template now
	        if (!partials.stackText) partials.stackText = {};
	        for (key in partial.subs) {
	          if (!partials.stackText[key]) {
	            partials.stackText[key] = (this.activeSub !== undefined && partials.stackText[this.activeSub]) ? partials.stackText[this.activeSub] : this.text;
	          }
	        }
	        template = createSpecializedPartial(template, partial.subs, partial.partials,
	          this.stackSubs, this.stackPartials, partials.stackText);
	      }
	      this.partials[symbol].instance = template;

	      return template;
	    },

	    // tries to find a partial in the current scope and render it
	    rp: function(symbol, context, partials, indent) {
	      var partial = this.ep(symbol, partials);
	      if (!partial) {
	        return '';
	      }

	      return partial.ri(context, partials, indent);
	    },

	    // render a section
	    rs: function(context, partials, section) {
	      var tail = context[context.length - 1];

	      if (!isArray(tail)) {
	        section(context, partials, this);
	        return;
	      }

	      for (var i = 0; i < tail.length; i++) {
	        context.push(tail[i]);
	        section(context, partials, this);
	        context.pop();
	      }
	    },

	    // maybe start a section
	    s: function(val, ctx, partials, inverted, start, end, tags) {
	      var pass;

	      if (isArray(val) && val.length === 0) {
	        return false;
	      }

	      if (typeof val == 'function') {
	        val = this.ms(val, ctx, partials, inverted, start, end, tags);
	      }

	      pass = !!val;

	      if (!inverted && pass && ctx) {
	        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
	      }

	      return pass;
	    },

	    // find values with dotted names
	    d: function(key, ctx, partials, returnFound) {
	      var found,
	          names = key.split('.'),
	          val = this.f(names[0], ctx, partials, returnFound),
	          doModelGet = this.options.modelGet,
	          cx = null;

	      if (key === '.' && isArray(ctx[ctx.length - 2])) {
	        val = ctx[ctx.length - 1];
	      } else {
	        for (var i = 1; i < names.length; i++) {
	          found = findInScope(names[i], val, doModelGet);
	          if (found !== undefined) {
	            cx = val;
	            val = found;
	          } else {
	            val = '';
	          }
	        }
	      }

	      if (returnFound && !val) {
	        return false;
	      }

	      if (!returnFound && typeof val == 'function') {
	        ctx.push(cx);
	        val = this.mv(val, ctx, partials);
	        ctx.pop();
	      }

	      return val;
	    },

	    // find values with normal names
	    f: function(key, ctx, partials, returnFound) {
	      var val = false,
	          v = null,
	          found = false,
	          doModelGet = this.options.modelGet;

	      for (var i = ctx.length - 1; i >= 0; i--) {
	        v = ctx[i];
	        val = findInScope(key, v, doModelGet);
	        if (val !== undefined) {
	          found = true;
	          break;
	        }
	      }

	      if (!found) {
	        return (returnFound) ? false : "";
	      }

	      if (!returnFound && typeof val == 'function') {
	        val = this.mv(val, ctx, partials);
	      }

	      return val;
	    },

	    // higher order templates
	    ls: function(func, cx, partials, text, tags) {
	      var oldTags = this.options.delimiters;

	      this.options.delimiters = tags;
	      this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials));
	      this.options.delimiters = oldTags;

	      return false;
	    },

	    // compile text
	    ct: function(text, cx, partials) {
	      if (this.options.disableLambda) {
	        throw new Error('Lambda features disabled.');
	      }
	      return this.c.compile(text, this.options).render(cx, partials);
	    },

	    // template result buffering
	    b: function(s) { this.buf += s; },

	    fl: function() { var r = this.buf; this.buf = ''; return r; },

	    // method replace section
	    ms: function(func, ctx, partials, inverted, start, end, tags) {
	      var textSource,
	          cx = ctx[ctx.length - 1],
	          result = func.call(cx);

	      if (typeof result == 'function') {
	        if (inverted) {
	          return true;
	        } else {
	          textSource = (this.activeSub && this.subsText && this.subsText[this.activeSub]) ? this.subsText[this.activeSub] : this.text;
	          return this.ls(result, cx, partials, textSource.substring(start, end), tags);
	        }
	      }

	      return result;
	    },

	    // method replace variable
	    mv: function(func, ctx, partials) {
	      var cx = ctx[ctx.length - 1];
	      var result = func.call(cx);

	      if (typeof result == 'function') {
	        return this.ct(coerceToString(result.call(cx)), cx, partials);
	      }

	      return result;
	    },

	    sub: function(name, context, partials, indent) {
	      var f = this.subs[name];
	      if (f) {
	        this.activeSub = name;
	        f(context, partials, this, indent);
	        this.activeSub = false;
	      }
	    }

	  };

	  //Find a key in an object
	  function findInScope(key, scope, doModelGet) {
	    var val;

	    if (scope && typeof scope == 'object') {

	      if (scope[key] !== undefined) {
	        val = scope[key];

	      // try lookup with get for backbone or similar model data
	      } else if (doModelGet && scope.get && typeof scope.get == 'function') {
	        val = scope.get(key);
	      }
	    }

	    return val;
	  }

	  function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
	    function PartialTemplate() {};
	    PartialTemplate.prototype = instance;
	    function Substitutions() {};
	    Substitutions.prototype = instance.subs;
	    var key;
	    var partial = new PartialTemplate();
	    partial.subs = new Substitutions();
	    partial.subsText = {};  //hehe. substext.
	    partial.buf = '';

	    stackSubs = stackSubs || {};
	    partial.stackSubs = stackSubs;
	    partial.subsText = stackText;
	    for (key in subs) {
	      if (!stackSubs[key]) stackSubs[key] = subs[key];
	    }
	    for (key in stackSubs) {
	      partial.subs[key] = stackSubs[key];
	    }

	    stackPartials = stackPartials || {};
	    partial.stackPartials = stackPartials;
	    for (key in partials) {
	      if (!stackPartials[key]) stackPartials[key] = partials[key];
	    }
	    for (key in stackPartials) {
	      partial.partials[key] = stackPartials[key];
	    }

	    return partial;
	  }

	  var rAmp = /&/g,
	      rLt = /</g,
	      rGt = />/g,
	      rApos = /\'/g,
	      rQuot = /\"/g,
	      hChars = /[&<>\"\']/;

	  function coerceToString(val) {
	    return String((val === null || val === undefined) ? '' : val);
	  }

	  function hoganEscape(str) {
	    str = coerceToString(str);
	    return hChars.test(str) ?
	      str
	        .replace(rAmp, '&amp;')
	        .replace(rLt, '&lt;')
	        .replace(rGt, '&gt;')
	        .replace(rApos, '&#39;')
	        .replace(rQuot, '&quot;') :
	      str;
	  }

	  var isArray = Array.isArray || function(a) {
	    return Object.prototype.toString.call(a) === '[object Array]';
	  };

	})( true ? exports : Hogan);


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var H = __webpack_require__(5);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<tr data-id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"grid-row\">");t.b("\n" + i);if(t.s(t.f("cells",c,p,1),c,p,0,50,137,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("		<td class=\"grid-cell ");t.b(t.v(t.f("cls",c,p,0)));t.b("\"><span class=\"grid-cell-inner\">");t.b(t.t(t.f("text",c,p,0)));t.b("</span></td>");t.b("\n" + i);});c.pop();}t.b("</tr>");return t.fl(); },partials: {}, subs: {  }}, "<tr data-id=\"{{id}}\" class=\"grid-row\">\n\t{{#cells}}\n\t\t<td class=\"grid-cell {{cls}}\"><span class=\"grid-cell-inner\">{{{text}}}</span></td>\n\t{{/cells}}\n</tr>", H);return T.render.apply(T, arguments); };

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var H = __webpack_require__(5);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<td class=\"");t.b(t.v(t.f("headerCls",c,p,0)));t.b("\" data-sortby=\"");t.b(t.v(t.f("field",c,p,0)));t.b("\">");t.b("\n" + i);t.b("	");if(t.s(t.f("sortable",c,p,1),c,p,0,65,91,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<i class=\"fa fa-sort\"></i>");});c.pop();}t.b("\n" + i);t.b("	<span class=\"grid-header-cell-inner\">");t.b(t.t(t.f("name",c,p,0)));t.b("</span>");t.b("\n" + i);t.b("</td>");return t.fl(); },partials: {}, subs: {  }}, "<td class=\"{{headerCls}}\" data-sortby=\"{{field}}\">\n\t{{#sortable}}<i class=\"fa fa-sort\"></i>{{/sortable}}\n\t<span class=\"grid-header-cell-inner\">{{{name}}}</span>\n</td>", H);return T.render.apply(T, arguments); };

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var H = __webpack_require__(5);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<td class=\"");t.b(t.v(t.f("footerCls",c,p,0)));t.b("\">");t.b("\n" + i);t.b("	<span class=\"grid-footer-cell-inner\">");t.b(t.t(t.f("footerText",c,p,0)));t.b("</span>");t.b("\n" + i);t.b("</td>");return t.fl(); },partials: {}, subs: {  }}, "<td class=\"{{footerCls}}\">\n\t<span class=\"grid-footer-cell-inner\">{{{footerText}}}</span>\n</td>", H);return T.render.apply(T, arguments); };

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function processColumns() {
		var actions = {};
		var colWidths = [];

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = this.cfg.columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var col = _step.value;

				col.name = col.name || '';
				col.field = col.field || '';
				col.sortable = col.sortable !== false && !col.icons;

				if (col.icons) {
					// column icons
					for (var icon in col.icons) {
						var cb = function cb() {};
						if (typeof col.icons[icon] === 'function') cb = col.icons[icon];else if (typeof col.icons[icon].cb === 'function') cb = col.icons[icon].cb;
						actions[icon] = cb;
					}
				}
				if (typeof col.width === 'string' && col.width.indexOf('%') === -1) {
					// column widths
					col.width = parseInt(col.width, 10);
				}
				colWidths.push(col.width || 'auto');
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		this.columnWidths = colWidths;
		this.iconHandlers = actions;
		return this;
	}

	function updateColumnWidths() {
		var headCols = this.el.head.querySelectorAll('.grid-cell');
		var bodyCols = this.el.body.querySelectorAll('.grid-row:first-of-type .grid-cell');
		var footCols = this.el.foot.querySelectorAll('.grid-cell');
		var autos = 0;
		var autoPercent = 100;

		// calculate columns widths
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = this.columnWidths[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var col = _step2.value;

				if (typeof col === 'number') continue;else if (col === 'auto') autos++;else if (col.indexOf('%') > -1) autoPercent -= parseInt(col, 10);
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}

		autoPercent = autoPercent / autos;

		this.columnWidths.forEach(function (col, i) {
			if (col === 'auto') col = autoPercent + '%';else if (typeof col === 'number') col = col + 'px';

			if (headCols[i]) headCols[i].style.width = col;
			if (bodyCols[i]) bodyCols[i].style.width = col;
			if (footCols[i]) footCols[i].style.width = col;
		});

		return this.updateTableWidths();
	}

	function updateTableWidths() {
		var headW = void 0,
		    bodyW = void 0,
		    tabStyle = this.el.bodyTable.style;
		tabStyle.width = '100%';
		headW = this.el.headTable.offsetWidth;
		bodyW = this.el.bodyTable.offsetWidth;
		tabStyle.width = bodyW === headW ? '100%' : headW + 'px';
		return this;
	}

	exports.default = {
		processColumns: processColumns,
		updateColumnWidths: updateColumnWidths,
		updateTableWidths: updateTableWidths
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function selectRow(row, unselectOther) {
		if (unselectOther) this.unselectRows();
		row.classList.add('selected');
		return this;
	}

	function unselectRows() {
		var rows = this.el.body.querySelectorAll('.grid-row.selected');
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var row = _step.value;
				row.classList.remove('selected');
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		return this;
	}

	exports.default = {
		selectRow: selectRow,
		unselectRows: unselectRows
	};

/***/ }
/******/ ])
});
;