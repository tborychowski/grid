/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var Grid = _interopRequire(__webpack_require__(1));
	
	var data = {
		total: 10,
		totalAmount: 100,
		items: [{ id: 1, date: "2015-01-01", amount: 21 }, { id: 2, date: "2015-01-02", amount: 22 }, { id: 3, date: "2015-01-03", amount: 23 }, { id: 4, date: "2015-01-04", amount: 24 }, { id: 5, date: "2015-01-05", amount: 25 }, { id: 6, date: "2015-01-05", amount: 26 }, { id: 7, date: "2015-01-05", amount: 27 }, { id: 8, date: "2015-01-05", amount: 28 }, { id: 9, date: "2015-01-05", amount: 29 }, { id: 10, date: "2015-01-05", amount: 30 }, { id: 11, date: "2015-01-05", amount: 31 }]
	};
	
	var grid = new Grid({
		target: document.getElementById("grid"),
		sort: { by: "date", order: "desc" },
		dataSource: function dataSource(params) {
			return data;
		},
		columns: [{ name: "Date", field: "date", cls: "date", sortable: true, footer: "Total" }, { name: "Amount", field: "amount", cls: "amount", sortable: true,
			renderer: function renderer(txt) {
				return "€" + txt;
			},
			footer: function footer(data) {
				return "€" + data.totalAmount;
			}
		}, { width: 70, cls: "action", icons: {
				info: { cls: "info", action: function action(item, row) {
						this.selectRow(row, true);
						console.log(item, row);
					} }
			} }]
	});
	
	grid.setData(data);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };
	
	var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };
	
	var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
	
	var util = _interopRequire(__webpack_require__(2));
	
	var Grid = (function () {
		function Grid(cfg) {
			_classCallCheck(this, Grid);
	
			var _defaults = {
				target: document.body,
				sort: { by: "id", order: "asc" },
				dataSource: null,
				items: { label: "items", root: "items", itemId: "id" },
				columns: []
			};
			this.tpl = {
				frame: __webpack_require__(3),
				row: __webpack_require__(4)
			};
			this.isRendered = false;
			this.cfg = Object.assign({}, _defaults, cfg);
			this.cfg.target.classList.add("grid");
			this.cfg.target.innerHTML = this.tpl.frame();
			this.el = {
				target: this.cfg.target,
				scroller: this.cfg.target.querySelector(".grid-scroller"),
				head: this.cfg.target.querySelector(".grid-header"),
				body: this.cfg.target.querySelector(".grid-body"),
				foot: this.cfg.target.querySelector(".grid-footer"),
				headTable: this.cfg.target.querySelector(".grid-header-table"),
				bodyTable: this.cfg.target.querySelector(".grid-body-table")
			};
			this.processColumns();
			this.el.target.addEventListener("click", this.onClick.bind(this));
			this.el.scroller.addEventListener("scroll", this.onScroll.bind(this));
		}
	
		_prototypeProperties(Grid, null, {
			load: {
				value: function load() {
					this.data = {};
					this.items = [];
					if (!this.cfg.dataSource) throw "No data source";
					if (this.cfg.dataSource instanceof Promise) this.cfg.dataSource().then(this.setData);else this.setData(this.cfg.dataSource());
					return this;
				},
				writable: true,
				configurable: true
			},
			setData: {
				value: function setData(data) {
					if (!data) throw "No data!";
					this.data = data;
					this.items = data[this.cfg.items.root];
					this.sortItems();
					return this;
				},
				writable: true,
				configurable: true
			},
			sortItems: {
				value: function sortItems(sortBy, order) {
					if (sortBy) this.cfg.sort.by = sortBy;
					if (order) this.cfg.sort.order = order;
	
					if (this.items && this.items.length) {
						if (sortBy) this.items.sort(util.sortFn(this.cfg.sort, this.items));
					}
					this.populate();
	
					var col,
					    all = this.el.head.querySelectorAll(".sort");
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;
	
					try {
						for (var _iterator = all[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							col = _step.value;
							col.classList.remove("sort-asc", "sort-desc");
						}
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator["return"]) {
								_iterator["return"]();
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError;
							}
						}
					}
	
					this.el.head.querySelector(".sort." + this.cfg.sort.by).classList.add("sort-" + this.cfg.sort.order);
				},
				writable: true,
				configurable: true
			},
			processColumns: {
				value: function processColumns() {
					var actions = {},
					    colWidths = [];
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;
	
					try {
						for (var _iterator = this.cfg.columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var col = _step.value;
	
							if (col.icons) {
								for (var icon in col.icons) {
									actions[icon] = col.icons[icon].action;
								}
							}
							if (typeof col.width === "string" && col.width.indexOf("%") === -1) {
								col.width = parseInt(col.width, 10);
							}
							colWidths.push(col.width || "auto");
						}
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator["return"]) {
								_iterator["return"]();
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError;
							}
						}
					}
	
					this.columnWidths = colWidths;
					this.iconHandlers = actions;
				},
				writable: true,
				configurable: true
			},
			updateColumnWidths: {
				value: function updateColumnWidths() {
					var autos = 0,
					    sumW = 0,
					    remainingW,
					    autoPercent = 100,
					    autoW,
					    headCols = this.el.head.querySelectorAll(".grid-cell"),
					    bodyCols = this.el.body.querySelectorAll(".grid-row:first-child .grid-cell"),
					    footCols = this.el.foot.querySelectorAll(".grid-cell");
	
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;
	
					try {
						for (var _iterator = this.columnWidths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var col = _step.value;
	
							if (typeof col === "number") sumW += col;else if (col === "auto") autos++;else if (col.indexOf("%") > -1) {
								autoPercent -= parseInt(col, 10);
								autos++;
							}
						}
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator["return"]) {
								_iterator["return"]();
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError;
							}
						}
					}
	
					remainingW = this.el.head.offsetWidth - sumW;
					autoPercent = autoPercent / autos;
					autoW = remainingW * autoPercent / 100;
	
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;
	
					try {
						for (var _iterator2 = this.columnWidths.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var _step2$value = _slicedToArray(_step2.value, 2);
	
							var i = _step2$value[0];
							var col = _step2$value[1];
	
							if (col === "auto") col = autoPercent + "%";else if (typeof col === "number") col = col + "px";
	
							if (headCols[i]) headCols[i].style.width = col;
							if (bodyCols[i]) bodyCols[i].style.width = col;
							if (footCols[i]) footCols[i].style.width = col;
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
								_iterator2["return"]();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}
	
					this.el.bodyTable.style.width = this.el.headTable.offsetWidth + "px";
				},
				writable: true,
				configurable: true
			},
			onClick: {
				value: function onClick(e) {
					var target = e.target,
					    newTarget = util.closest(target, "td.sort");
					if (newTarget) {
						target = newTarget;
						var isAsc = target.classList.contains("sort-asc");
						this.sortItems(target.dataset.sortby, isAsc ? "desc" : "asc");
					} else if (target.matches(".row-action")) {
						e.preventDefault();
						var row = util.closest(target, ".grid-row"),
						    action = target.dataset.action,
						    id = +row.dataset.id,
						    item = this.getItemById(id);
						this.iconHandlers[action].call(this, item, row);
					}
				},
				writable: true,
				configurable: true
			},
			onScroll: {
				value: function onScroll() {
					var scrld = this.el.scroller.scrollTop > 0;
					this.el.headTable.classList.toggle("grid-header-scroll-over", scrld);
				},
				writable: true,
				configurable: true
			},
			getItemById: {
				value: function getItemById(id) {
					return this.items.filter(function (item) {
						return item.id === id;
					})[0];
				},
				writable: true,
				configurable: true
			},
			getItemRow: {
				value: function getItemRow(item) {
					var _this = this;
	
					return this.cfg.columns.map(function (col) {
						var text = item[col.field];
						var cls = col.cls ? " " + col.cls : "";
						if (typeof col.renderer === "function") text = col.renderer.call(_this, text, item);else if (col.icons) {
							text = Object.keys(col.icons).map(function (i) {
								var icon = col.icons[i];
								var cls = "row-action fa fa-" + icon.cls;
								return "<a href=\"#\" class=\"" + cls + "\" data-action=\"" + i + "\">" + i + "</a>";
							}).join("");
						}
						return { cls: cls, text: text };
					}, this);
				},
				writable: true,
				configurable: true
			},
			getHeader: {
				value: function getHeader() {
					var cells = this.cfg.columns.map(function (col) {
						var text = col.name || "";
						var cls = "grid-cell grid-header-cell" + (col.cls ? " " + col.cls : "");
						if (col.sortable) cls += " sort";
						return "<td class=\"" + cls + "\" data-sortby=\"" + col.field + "\">" + "<em></em><span class=\"grid-header-cell-inner\">" + text + "</span></td>";
					}, this);
					return cells.join("");
				},
				writable: true,
				configurable: true
			},
			getFooter: {
				value: function getFooter() {
					var _this = this;
	
					var cells = this.cfg.columns.map(function (col) {
						var text = "";
						var cls = "grid-cell grid-footer-cell" + (col.cls ? " " + col.cls : "");
						if (typeof col.footer === "function") text = col.footer.call(_this, _this.data);else if (typeof col.footer === "string") text = col.footer;
						return "<td class=\"" + cls + "\"><span class=\"grid-footer-cell-inner\">" + text + "</span></td>";
					}, this);
					return cells.join("");
				},
				writable: true,
				configurable: true
			},
			getBody: {
				value: function getBody() {
					var _this = this;
	
					return this.items.map(function (item) {
						return _this.tpl.row({ id: item.id, cells: _this.getItemRow(item) });
					}, this).join("");
				},
				writable: true,
				configurable: true
			},
			populate: {
				value: function populate() {
					if (!this.isRendered) {
						this.el.head.innerHTML = this.getHeader();
						this.el.foot.innerHTML = this.getFooter();
						this.isRendered = true;
					}
					this.el.body.innerHTML = this.getBody();
					this.updateColumnWidths();
				},
				writable: true,
				configurable: true
			},
			selectRow: {
				value: function selectRow(row, unselectOther) {
					if (unselectOther) this.unselectRows();
					row.classList.add("selected");
				},
				writable: true,
				configurable: true
			},
			unselectRows: {
				value: function unselectRows() {
					var row,
					    rows = this.el.body.querySelectorAll(".grid-row.selected");
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;
	
					try {
						for (var _iterator = rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							row = _step.value;
							row.classList.remove("selected");
						}
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator["return"]) {
								_iterator["return"]();
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError;
							}
						}
					}
				},
				writable: true,
				configurable: true
			}
		});
	
		return Grid;
	})();
	
	module.exports = Grid;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	function type(items, field) {
		if (!items || !items.length) {
			return "str";
		}var i, v, t, item;
		for (i = 0; item = items[i]; i++) {
			if (item && item[field]) v = typeof item[field];
			if (v === "number" || v === "string") t = v.substr(0, 3);
			if (t) break;
		}
		return t || "str";
	}
	
	function sortFn(sort, items) {
		var by = sort.by,
		    order = sort.order,
		    sortType = type(items, by),
		    strCmp = function strCmp(a, b, by) {
			return ("" + a[by]).toLowerCase().localeCompare(("" + b[by]).toLowerCase());
		};
	
		if (sortType === "num") {
			if (order === "asc") {
				return function (a, b) {
					return a[by] - b[by];
				};
			} else {
				return function (a, b) {
					return b[by] - a[by];
				};
			}
		} else {
			if (order === "asc") {
				return function (a, b) {
					return strCmp(a, b, by);
				};
			} else {
				return function (a, b) {
					return strCmp(b, a, by);
				};
			}
		}
	}
	
	function closest(el, selector) {
		var has = false;
		while (!has && el) {
			has = el.matches(selector);
			if (has) {
				return el;
			}el = el.parentNode;
			if (el.tagName === "HTML") {
				return null;
			}
		}
		return null;
	}
	
	function merge(target) {
		for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			sources[_key - 1] = arguments[_key];
		}
	
		if (!target) throw new TypeError("Cannot convert first argument to object");
		var to = Object(target);
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;
	
		try {
			for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var source = _step.value;
	
				var keys = Object.keys(Object(source));
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;
	
				try {
					for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var key = _step2.value;
	
						var desc = Object.getOwnPropertyDescriptor(source, key);
						if (desc !== undefined && desc.enumerable) to[key] = source[key];
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
							_iterator2["return"]();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator["return"]) {
					_iterator["return"]();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	
		return to;
	}
	
	if (!Object.assign) Object.defineProperty(Object, "assign", { value: merge,
		enumerable: false, configurable: true, writable: true
	});
	
	module.exports = {
		type: type,
		sortFn: sortFn,
		closest: closest
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var H = __webpack_require__(5);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<table class=\"grid-table grid-header-table\">\r");t.b("\n" + i);t.b("	<thead><tr class=\"grid-header\"></tr></thead>\r");t.b("\n" + i);t.b("</table>\r");t.b("\n" + i);t.b("<div class=\"grid-scroller\">\r");t.b("\n" + i);t.b("	<table class=\"grid-table grid-body-table\">\r");t.b("\n" + i);t.b("		<tbody class=\"grid-body\"></tbody>\r");t.b("\n" + i);t.b("	</table>\r");t.b("\n" + i);t.b("</div>\r");t.b("\n" + i);t.b("<table class=\"grid-table grid-footer-table\">\r");t.b("\n" + i);t.b("	<tfoot><tr class=\"grid-footer\"></tr></tfoot>\r");t.b("\n" + i);t.b("</table>");return t.fl(); },partials: {}, subs: {  }}, "<table class=\"grid-table grid-header-table\">\r\n\t<thead><tr class=\"grid-header\"></tr></thead>\r\n</table>\r\n<div class=\"grid-scroller\">\r\n\t<table class=\"grid-table grid-body-table\">\r\n\t\t<tbody class=\"grid-body\"></tbody>\r\n\t</table>\r\n</div>\r\n<table class=\"grid-table grid-footer-table\">\r\n\t<tfoot><tr class=\"grid-footer\"></tr></tfoot>\r\n</table>", H); return T.render.apply(T, arguments); };

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var H = __webpack_require__(5);
	module.exports = function() { var T = new H.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<tr data-id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"grid-row\">\r");t.b("\n" + i);if(t.s(t.f("cells",c,p,1),c,p,0,51,140,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("		<td class=\"grid-cell ");t.b(t.v(t.f("cls",c,p,0)));t.b("\"><span class=\"grid-cell-inner\">");t.b(t.t(t.f("text",c,p,0)));t.b("</span></td>\r");t.b("\n" + i);});c.pop();}t.b("</tr>");return t.fl(); },partials: {}, subs: {  }}, "<tr data-id=\"{{id}}\" class=\"grid-row\">\r\n\t{{#cells}}\r\n\t\t<td class=\"grid-cell {{cls}}\"><span class=\"grid-cell-inner\">{{{text}}}</span></td>\r\n\t{{/cells}}\r\n</tr>", H); return T.render.apply(T, arguments); };

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
	})(true ? exports : Hogan);


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
	
	})(true ? exports : Hogan);


/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map