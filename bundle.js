/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/downloader-machine/from-fetch.js":
/*!**********************************************!*\
  !*** ./src/downloader-machine/from-fetch.js ***!
  \**********************************************/
/*! exports provided: fromFetch */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fromFetch\", function() { return fromFetch; });\n/* harmony import */ var _state_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state-machine */ \"./src/state-machine/index.js\");\n\nconst fromFetch = (urlMapper, resultMapper, updateResults) => {\n  const id = Symbol('downloader');\n  return {\n    id: id,\n    initialState: 'ready',\n    context: {\n      abortController: new AbortController()\n    },\n    states: {\n      ready: {\n        onEntry: data => {\n          console.log('downloaded');\n          updateResults(data);\n        },\n        on: {\n          load: {\n            action: 'load'\n          }\n        }\n      },\n      downloading: {\n        onEntry: () => {\n          console.log('downloading');\n        },\n        on: {\n          load: {\n            action: 'load'\n          }\n        }\n      }\n    },\n    actions: {\n      load: payload => {\n        const [context, setContext] = Object(_state_machine__WEBPACK_IMPORTED_MODULE_0__[\"useContext\"])();\n        const [state, setState] = Object(_state_machine__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])();\n        const url = urlMapper(payload.text);\n        context.abortController.abort();\n        const abortController = new AbortController();\n        setContext({\n          abortController\n        });\n        fetch(url, {\n          signal: abortController.signal\n        }).then(val => val.json()).catch(err => {\n          console.log(err);\n          return {\n            items: []\n          };\n        }).then(data => setState('ready', resultMapper(data)));\n        setState('downloading');\n      }\n    }\n  };\n};\n\n//# sourceURL=webpack:///./src/downloader-machine/from-fetch.js?");

/***/ }),

/***/ "./src/downloader-machine/from-list.js":
/*!*********************************************!*\
  !*** ./src/downloader-machine/from-list.js ***!
  \*********************************************/
/*! exports provided: fromList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fromList\", function() { return fromList; });\n/* harmony import */ var _state_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state-machine */ \"./src/state-machine/index.js\");\n\nconst fromList = (data, updateResults) => {\n  const id = Symbol('downloader');\n  return {\n    id: id,\n    initialState: 'ready',\n    context: {\n      data: data\n    },\n    states: {\n      ready: {\n        onEntry: updateResults,\n        on: {\n          load: {\n            action: 'load'\n          }\n        }\n      },\n      downloading: {\n        onEntry: () => {\n          console.log('downloading');\n        },\n        on: {\n          load: {\n            action: 'load'\n          }\n        }\n      }\n    },\n    actions: {\n      load: event => {\n        const [context, setContext] = Object(_state_machine__WEBPACK_IMPORTED_MODULE_0__[\"useContext\"])();\n        const [state, setState] = Object(_state_machine__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])();\n        setState('ready', context.data.filter(value => value.text.includes(event.text)));\n      }\n    }\n  };\n};\n\n//# sourceURL=webpack:///./src/downloader-machine/from-list.js?");

/***/ }),

/***/ "./src/downloader-machine/index.js":
/*!*****************************************!*\
  !*** ./src/downloader-machine/index.js ***!
  \*****************************************/
/*! exports provided: createDownloaderMachine */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createDownloaderMachine\", function() { return createDownloaderMachine; });\n/* harmony import */ var _from_list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./from-list */ \"./src/downloader-machine/from-list.js\");\n/* harmony import */ var _from_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./from-fetch */ \"./src/downloader-machine/from-fetch.js\");\n/* harmony import */ var _state_machine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../state-machine */ \"./src/state-machine/index.js\");\n\n\n\nconst createDownloaderMachine = (config, onLoad) => {\n  switch (config.type) {\n    case 'fetch':\n      return Object(_state_machine__WEBPACK_IMPORTED_MODULE_2__[\"machine\"])(Object(_from_fetch__WEBPACK_IMPORTED_MODULE_1__[\"fromFetch\"])(config.urlMapper, config.resultMapper, onLoad));\n\n    case 'local':\n      return Object(_state_machine__WEBPACK_IMPORTED_MODULE_2__[\"machine\"])(Object(_from_list__WEBPACK_IMPORTED_MODULE_0__[\"fromList\"])({ ...config.data\n      }, onLoad));\n  }\n\n  throw new Error('unknown datasource');\n};\n\n//# sourceURL=webpack:///./src/downloader-machine/index.js?");

/***/ }),

/***/ "./src/helpers/debounce.js":
/*!*********************************!*\
  !*** ./src/helpers/debounce.js ***!
  \*********************************/
/*! exports provided: debounce */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"debounce\", function() { return debounce; });\nconst debounce = (handler, delay) => {\n  let timeout;\n  return (...args) => {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => handler(...args), delay);\n  };\n};\n\n//# sourceURL=webpack:///./src/helpers/debounce.js?");

/***/ }),

/***/ "./src/hh-select/handlers.js":
/*!***********************************!*\
  !*** ./src/hh-select/handlers.js ***!
  \***********************************/
/*! exports provided: onInput, keyboardControl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"onInput\", function() { return onInput; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"keyboardControl\", function() { return keyboardControl; });\n/* harmony import */ var _select_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./select-view */ \"./src/hh-select/select-view/index.js\");\n\nconst onInput = (selectorMachine, downloaderMachine, minLength) => {\n  let prevState = '';\n  return event => {\n    const newState = event.target.value;\n\n    if (newState.length >= minLength && newState !== prevState) {\n      prevState = newState;\n      downloaderMachine.transition('load', {\n        text: newState\n      });\n    }\n\n    event.preventDefault();\n  };\n};\nconst keyboardControl = svm => event => {\n  switch (event.code) {\n    case 'ArrowUp':\n      svm.transition('move', _select_view__WEBPACK_IMPORTED_MODULE_0__[\"MOVE_UP\"]);\n      event.preventDefault();\n      break;\n\n    case 'ArrowDown':\n      svm.transition('move', _select_view__WEBPACK_IMPORTED_MODULE_0__[\"MOVE_DOWN\"]);\n      event.preventDefault();\n      break;\n\n    case 'Escape':\n      svm.transition('close');\n      event.preventDefault();\n      break;\n\n    case 'Enter':\n      svm.transition('choose');\n      event.preventDefault();\n      break;\n\n    default:\n      break;\n  }\n};\n\n//# sourceURL=webpack:///./src/hh-select/handlers.js?");

/***/ }),

/***/ "./src/hh-select/index.js":
/*!********************************!*\
  !*** ./src/hh-select/index.js ***!
  \********************************/
/*! exports provided: setSelectable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setSelectable\", function() { return setSelectable; });\n/* harmony import */ var _select_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./select-view */ \"./src/hh-select/select-view/index.js\");\n/* harmony import */ var _select_machine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./select-machine */ \"./src/hh-select/select-machine/index.js\");\n/* harmony import */ var _state_machine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../state-machine */ \"./src/state-machine/index.js\");\n/* harmony import */ var _downloader_machine__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../downloader-machine */ \"./src/downloader-machine/index.js\");\n/* harmony import */ var _helpers_debounce__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers/debounce */ \"./src/helpers/debounce.js\");\n/* harmony import */ var _list__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./list */ \"./src/hh-select/list/index.js\");\n/* harmony import */ var _handlers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./handlers */ \"./src/hh-select/handlers.js\");\n\n\n\n\n\n\n\n\nconst defaultConfig = {\n  debounceDelay: 2000,\n  minInputLength: 2\n};\nconst setSelectable = (wrapper, config) => {\n  const {\n    downloader\n  } = config;\n  const viewConfig = { ...defaultConfig,\n    ...config.queryInput\n  };\n  const selectWrapper = document.createElement('div');\n  const selectedWrapper = document.createElement('div');\n  wrapper.appendChild(selectWrapper);\n  wrapper.appendChild(selectedWrapper);\n  const list = new _list__WEBPACK_IMPORTED_MODULE_5__[\"List\"](selectedWrapper, { ...config.selectedList\n  });\n  const selectView = new _select_view__WEBPACK_IMPORTED_MODULE_0__[\"SelectView\"](selectWrapper, viewConfig);\n  const svm = Object(_select_machine__WEBPACK_IMPORTED_MODULE_1__[\"createSelectMachine\"])(selectView, list);\n  const downloaderMachine = Object(_downloader_machine__WEBPACK_IMPORTED_MODULE_3__[\"createDownloaderMachine\"])(downloader, res => svm.transition('update', {\n    res\n  }));\n  selectView.onClick(() => svm.transition('open'));\n  selectView.onInput(Object(_helpers_debounce__WEBPACK_IMPORTED_MODULE_4__[\"debounce\"])(Object(_handlers__WEBPACK_IMPORTED_MODULE_6__[\"onInput\"])(svm, downloaderMachine, viewConfig.minInputLength), viewConfig.debounceDelay));\n  selectView.onChange(key => {\n    svm.transition('addSelected', key).then(([state, context]) => {\n      changeHandlers.forEach(handler => handler(context));\n    });\n  });\n  list.onRemove(key => {\n    svm.transition('removeSelected', key).then(([state, context]) => {\n      changeHandlers.forEach(handler => handler(context));\n    });\n  });\n  selectView.onKeyDown(Object(_handlers__WEBPACK_IMPORTED_MODULE_6__[\"keyboardControl\"])(svm));\n  const changeHandlers = [];\n  return {\n    onChange: fun => {\n      changeHandlers.push(fun);\n    },\n    getSelected: () => {\n      return svm.getContext();\n    }\n  };\n};\n\n//# sourceURL=webpack:///./src/hh-select/index.js?");

/***/ }),

/***/ "./src/hh-select/list/index.js":
/*!*************************************!*\
  !*** ./src/hh-select/list/index.js ***!
  \*************************************/
/*! exports provided: List */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"List\", function() { return List; });\nconst defaultConfig = {\n  listClass: 'hh-select__selected-list',\n  rowClass: 'hh-select__selected-row',\n  removeClass: 'hh-select__selected-remove',\n  removeText: 'X'\n};\nclass List {\n  constructor(wrapper, config) {\n    this.config = { ...defaultConfig,\n      ...config\n    };\n    const list = document.createElement('ul');\n    list.className = this.config.listClass;\n    this.dom = {\n      wrapper: wrapper,\n      list: list,\n      items: {}\n    };\n    wrapper.appendChild(this.dom.list);\n    this.removeHandlers = [];\n  }\n\n  add(key, text) {\n    const remove = document.createElement('span');\n    remove.className = this.config.removeClass;\n    remove.textContent = this.config.removeText;\n    remove.addEventListener('click', () => this.remove(key));\n\n    if (key in this.dom.items) {\n      this.dom.items[key].textContent = text;\n      this.dom.items[key].prepend(remove);\n    } else {\n      const element = document.createElement('li');\n      element.className = this.config.rowClass;\n      element.textContent = text;\n      element.prepend(remove);\n      this.dom.list.appendChild(element);\n      this.dom.items[key] = element;\n    }\n  }\n\n  remove(key) {\n    const item = this.dom.items[key];\n\n    if (item) {\n      this.dom.list.removeChild(item);\n      delete this.dom.items[key];\n    }\n\n    const restKeys = Object.keys(this.dom.items);\n    this.removeHandlers.forEach(handler => handler(key, restKeys));\n  }\n\n  onRemove(handler) {\n    this.removeHandlers.push(handler);\n  }\n\n}\n\n//# sourceURL=webpack:///./src/hh-select/list/index.js?");

/***/ }),

/***/ "./src/hh-select/select-machine/index.js":
/*!***********************************************!*\
  !*** ./src/hh-select/select-machine/index.js ***!
  \***********************************************/
/*! exports provided: fromView, createSelectMachine */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fromView\", function() { return fromView; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createSelectMachine\", function() { return createSelectMachine; });\n/* harmony import */ var _state_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../state-machine */ \"./src/state-machine/index.js\");\n\n\nconst arrayToMap = raw => {\n  const res = {};\n  raw.forEach(element => {\n    res[element.id] = element;\n  });\n  return res;\n};\n\nconst fromView = (selectView, selectedList) => {\n  return {\n    id: Symbol('select'),\n    initialState: 'empty',\n    context: {\n      data: {},\n      selected: {}\n    },\n    states: {\n      empty: {\n        on: {\n          open: {\n            action: 'initial'\n          },\n          update: {\n            action: 'update'\n          }\n        },\n        default: {\n          action: 'ignored'\n        }\n      },\n      opened: {\n        onEntry: () => {\n          const [context, setContext] = Object(_state_machine__WEBPACK_IMPORTED_MODULE_0__[\"useContext\"])();\n          selectView.open();\n        },\n        on: {\n          close: {\n            target: 'closed'\n          },\n          update: {\n            action: 'update'\n          },\n          addSelected: {\n            action: 'addSelected'\n          },\n          removeSelected: {\n            action: 'removeSelected'\n          },\n          move: {\n            action: 'move'\n          },\n          choose: {\n            action: 'choose'\n          }\n        },\n        default: {\n          action: 'ignored'\n        }\n      },\n      closed: {\n        onEntry: () => {\n          const [context, setContext] = Object(_state_machine__WEBPACK_IMPORTED_MODULE_0__[\"useContext\"])();\n          selectView.close();\n        },\n        on: {\n          open: {\n            target: 'opened'\n          },\n          update: {\n            action: 'update'\n          },\n          move: {\n            target: 'opened'\n          },\n          removeSelected: {\n            action: 'removeSelected'\n          }\n        },\n        default: {\n          action: 'ignored'\n        }\n      }\n    },\n    actions: {\n      ignored: () => {},\n      removeSelected: key => {\n        const [context, setContext] = Object(_state_machine__WEBPACK_IMPORTED_MODULE_0__[\"useContext\"])();\n        const [state, setState] = Object(_state_machine__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])();\n        const selected = { ...context.selected\n        };\n        delete selected[key];\n        setContext({\n          selected\n        });\n        setState('closed');\n      },\n      addSelected: key => {\n        const [context, setContext] = Object(_state_machine__WEBPACK_IMPORTED_MODULE_0__[\"useContext\"])();\n        const [state, setState] = Object(_state_machine__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])();\n        const selected = { ...context.selected\n        };\n        selected[key] = context.data[key];\n        setContext({\n          selected\n        });\n        selectedList.add(key, context.data[key].text);\n        setState('closed');\n      },\n      choose: () => {\n        selectView.chooseCurrent();\n      },\n      initial: () => {\n        const [state, setState] = Object(_state_machine__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])();\n        selectView.placeholder('Start typing');\n        setState('opened');\n      },\n      update: payload => {\n        const [context, setContext] = Object(_state_machine__WEBPACK_IMPORTED_MODULE_0__[\"useContext\"])();\n        const [state, setState] = Object(_state_machine__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])();\n\n        if (payload.res.length === 0) {\n          selectView.placeholder('nothing found');\n        } else {\n          selectView.clearPlaceholder();\n        }\n\n        const data = arrayToMap(payload.res);\n        setContext({\n          data\n        });\n        selectView.updateItems(data);\n        setState('opened');\n      },\n      move: direction => {\n        selectView.move(direction);\n      }\n    }\n  };\n};\nconst createSelectMachine = (selectView, selectedView) => Object(_state_machine__WEBPACK_IMPORTED_MODULE_0__[\"machine\"])(fromView(selectView, selectedView));\n\n//# sourceURL=webpack:///./src/hh-select/select-machine/index.js?");

/***/ }),

/***/ "./src/hh-select/select-view/SelectView.js":
/*!*************************************************!*\
  !*** ./src/hh-select/select-view/SelectView.js ***!
  \*************************************************/
/*! exports provided: MOVE_UP, MOVE_DOWN, SelectView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MOVE_UP\", function() { return MOVE_UP; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MOVE_DOWN\", function() { return MOVE_DOWN; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"SelectView\", function() { return SelectView; });\n/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers.js */ \"./src/hh-select/select-view/helpers.js\");\n\nconst defaultConfig = {\n  wrapperClass: 'hh-select',\n  wrapperOpenClass: 'hh-select hh-select_open',\n  rowClass: 'hh-select__row',\n  listClass: 'hh-select__list',\n  hoverClass: 'hh-select__row hh-select__row_hover',\n  inputClass: 'hh-select__input',\n  placeholderClass: 'hh-select__placeholder'\n};\nconst MOVE_UP = -1;\nconst MOVE_DOWN = +1;\n\nconst bindEventHandlers = selectView => {\n  selectView.dom.input.addEventListener('keyup', event => {\n    selectView.inputHandlers.forEach(handler => {\n      handler(event);\n    });\n  });\n  selectView.dom.input.addEventListener('click', event => {\n    selectView.clickHandlers.forEach(handler => {\n      handler(event);\n    });\n  });\n  selectView.dom.input.addEventListener('keydown', event => {\n    selectView.keyDownHandlers.forEach(handler => {\n      handler(event);\n    });\n  });\n};\n\nclass SelectView {\n  constructor(wrapper, config) {\n    this.config = { ...defaultConfig,\n      ...config\n    };\n    this.dom = {\n      wrapper: wrapper,\n      input: document.createElement('input'),\n      list: document.createElement('ul'),\n      items: {},\n      placeholder: null\n    };\n    this.dom.wrapper.appendChild(this.dom.input);\n    this.dom.wrapper.appendChild(this.dom.list);\n    this.dom.wrapper.className = this.config.wrapperClass;\n    this.dom.input.className = this.config.inputClass;\n    this.dom.list.className = this.config.listClass;\n    this.dom.list.addEventListener('mouseleave', () => {\n      Object(_helpers_js__WEBPACK_IMPORTED_MODULE_0__[\"clearHighlights\"])(this);\n    });\n    this.inputHandlers = [];\n    this.keyDownHandlers = [];\n    this.changeHandlers = [];\n    this.clickHandlers = [() => this.open()];\n    this.posToKey = {};\n    bindEventHandlers(this);\n    Object(_helpers_js__WEBPACK_IMPORTED_MODULE_0__[\"resetPosition\"])(this);\n  }\n\n  updateItems(items) {\n    this.posToKey = {};\n    this.keyToPos = {}; // удалим узлы, которых нет в новых данных\n\n    Object.keys(this.dom.items).filter(el => !Object.keys(items).includes(el)).map(el => {\n      this.dom.list.removeChild(this.dom.items[el]);\n      delete this.dom.items[el];\n    }); // обновим оставшиеся / добавим новые\n\n    let pos = 0;\n    Object.keys(items).forEach(id => {\n      const item = items[id];\n\n      if (id in this.dom.items) {\n        this.dom.items[id].textContent = item.text;\n      } else {\n        const li = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_0__[\"createRow\"])(this, id, item.text);\n        this.dom.list.appendChild(li);\n        this.dom.items[id] = li;\n      }\n\n      this.keyToPos[id] = pos;\n      this.posToKey[pos++] = id;\n    });\n    Object(_helpers_js__WEBPACK_IMPORTED_MODULE_0__[\"resetPosition\"])(this);\n  }\n\n  placeholder(text) {\n    this.clear();\n    const placeholder = document.createElement('li');\n    placeholder.className = this.config.placeholderClass;\n    placeholder.textContent = text;\n    this.dom.placeholder = placeholder;\n    this.dom.list.appendChild(placeholder);\n  }\n\n  clearPlaceholder() {\n    if (this.dom.placeholder !== null) {\n      this.dom.list.removeChild(this.dom.placeholder);\n      this.dom.placeholder = null;\n    }\n  }\n\n  clear() {\n    this.clearPlaceholder();\n\n    while (this.dom.list.firstChild) {\n      this.dom.list.removeChild(this.dom.list.firstChild);\n    }\n\n    this.dom.items = {};\n  }\n\n  onInput(fun) {\n    this.inputHandlers.push(fun);\n  }\n\n  onKeyDown(fun) {\n    this.keyDownHandlers.push(fun);\n  }\n\n  onChange(fun) {\n    this.changeHandlers.push(fun);\n  }\n\n  onClick(fun) {\n    this.clickHandlers.push(fun);\n  }\n\n  choose(key) {\n    if (key) {\n      this.changeHandlers.forEach(handler => handler(key));\n    }\n  }\n\n  chooseCurrent() {\n    this.choose(this.posToKey[this.currentPos]);\n  }\n\n  open() {\n    this.dom.wrapper.className = this.config.wrapperOpenClass;\n    this.dom.list.style.display = 'block';\n  }\n\n  close() {\n    this.dom.wrapper.className = this.config.wrapperClass;\n    this.dom.list.style.display = 'none';\n  }\n\n  move(step) {\n    Object(_helpers_js__WEBPACK_IMPORTED_MODULE_0__[\"move\"])(this, step);\n  }\n\n}\n\n//# sourceURL=webpack:///./src/hh-select/select-view/SelectView.js?");

/***/ }),

/***/ "./src/hh-select/select-view/helpers.js":
/*!**********************************************!*\
  !*** ./src/hh-select/select-view/helpers.js ***!
  \**********************************************/
/*! exports provided: resetPosition, createRow, clearHighlights, move, moveTo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"resetPosition\", function() { return resetPosition; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createRow\", function() { return createRow; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"clearHighlights\", function() { return clearHighlights; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"move\", function() { return move; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"moveTo\", function() { return moveTo; });\nconst NULL_POS = -1;\n\nconst getNextPos = (selectView, position, step) => {\n  const mod = Object.keys(selectView.posToKey).length; // NULL_POS перед первым элементом и после последнего\n  // иначе - циклическая прокрутка\n\n  if (mod === 0) {\n    return NULL_POS;\n  }\n\n  if (mod === 1 && position === NULL_POS) {\n    return 0;\n  }\n\n  return ((position - NULL_POS + step) % mod + mod) % mod + NULL_POS;\n};\n\nconst resetPosition = selectView => {\n  selectView.currentPos = NULL_POS;\n};\nconst createRow = (selectView, key, value) => {\n  const onClick = event => {\n    const {\n      target\n    } = event;\n\n    if (target instanceof HTMLElement) {\n      const key = target.getAttribute('data-key');\n\n      if (key) {\n        selectView.choose(key);\n      }\n    }\n  };\n\n  const onHover = event => {\n    moveTo(selectView, key);\n  };\n\n  const li = document.createElement('li');\n  li.setAttribute('data-key', key);\n  li.textContent = value;\n  li.className = selectView.config.rowClass;\n  li.addEventListener('click', onClick);\n  li.addEventListener('mouseenter', onHover);\n  return li;\n};\nconst clearHighlights = selectView => {\n  const currentPos = selectView.currentPos;\n\n  if (currentPos !== NULL_POS) {\n    selectView.dom.items[selectView.posToKey[currentPos]].className = selectView.config.rowClass;\n  }\n};\nconst move = (selectView, step) => {\n  const currentPos = selectView.currentPos;\n  clearHighlights(selectView);\n  const newPos = getNextPos(selectView, currentPos, step);\n  selectView.currentPos = newPos;\n\n  if (newPos !== NULL_POS) {\n    moveTo(selectView, selectView.posToKey[newPos]);\n  }\n};\nconst moveTo = (selectView, id) => {\n  clearHighlights(selectView);\n  selectView.currentPos = selectView.keyToPos[id];\n  selectView.dom.items[id].className = selectView.config.hoverClass;\n};\n\n//# sourceURL=webpack:///./src/hh-select/select-view/helpers.js?");

/***/ }),

/***/ "./src/hh-select/select-view/index.js":
/*!********************************************!*\
  !*** ./src/hh-select/select-view/index.js ***!
  \********************************************/
/*! exports provided: SelectView, MOVE_DOWN, MOVE_UP */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _SelectView__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SelectView */ \"./src/hh-select/select-view/SelectView.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"SelectView\", function() { return _SelectView__WEBPACK_IMPORTED_MODULE_0__[\"SelectView\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MOVE_DOWN\", function() { return _SelectView__WEBPACK_IMPORTED_MODULE_0__[\"MOVE_DOWN\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MOVE_UP\", function() { return _SelectView__WEBPACK_IMPORTED_MODULE_0__[\"MOVE_UP\"]; });\n\n\n\n//# sourceURL=webpack:///./src/hh-select/select-view/index.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _hh_select__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hh-select */ \"./src/hh-select/index.js\");\n\nconst select = Object(_hh_select__WEBPACK_IMPORTED_MODULE_0__[\"setSelectable\"])(window.document.getElementById('select-wrapper'), {\n  queryInput: {\n    debounceDelay: 400,\n    minInputLength: 2\n  },\n  selectedList: {\n    removeText: ''\n  },\n  downloader: {\n    type: 'fetch',\n    urlMapper: input => `https://api.hh.ru/suggests/areas?text=${input}`,\n    resultMapper: data => data.items\n  }\n});\nselect.onChange(console.log);\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/state-machine/domain/MachineBox.js":
/*!************************************************!*\
  !*** ./src/state-machine/domain/MachineBox.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return MachineBox; });\n/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./errors */ \"./src/state-machine/domain/errors.js\");\n\n\nconst getActionOrBreakMachine = (machineBox, transitionName) => {\n  const transitions = machineBox.machine.states[machineBox.state].on;\n  const defaultHandler = machineBox.machine.states[machineBox.state].default;\n\n  if (transitions !== undefined && transitions[transitionName] !== undefined) {\n    return transitions[transitionName];\n  } else if (defaultHandler !== undefined) {\n    return defaultHandler;\n  }\n\n  machineBox.broken = true;\n  throw new _errors__WEBPACK_IMPORTED_MODULE_0__[\"UnknownTransition\"](transitionName, machineBox.state);\n}; // позволяет тригернуть обработчики события on стейта state машины machine с данными event\n\n\nconst trigger = (machineBox, on, state, event) => {\n  const maybeMapActionNameToHandler = action => {\n    if (typeof action === 'string') {\n      if (action in machine.actions) {\n        return machine.actions[action];\n      } else {\n        machineBox.broken = true;\n        throw new _errors__WEBPACK_IMPORTED_MODULE_0__[\"UnknownAction\"](action, on, state);\n      }\n    }\n\n    return action;\n  };\n\n  const machine = machineBox.machine;\n  const handlers = [machine.states[state][on]]; // дабы не обрабатывать отдельно случаи array / not array\n\n  handlers.reduce((acc, val) => acc.concat(val), []) // flatMap in stage-3 :(\n  .map(maybeMapActionNameToHandler).filter(handler => typeof handler === 'function').forEach(handler => handler(event));\n};\n\nclass MachineBox {\n  constructor(machine, context, state) {\n    this.machine = machine;\n    this.context = context;\n    this.state = state;\n    this.broken = false;\n  }\n\n  transition(transitionName, event) {\n    const action = getActionOrBreakMachine(this, transitionName);\n\n    if ('service' in action) {\n      action.service(event);\n    } else if ('target' in action) {\n      this.setState(action.target, event);\n    } else if ('action' in action) {\n      this.machine.actions[action.action](event);\n    }\n  }\n\n  setContext(context) {\n    const currentContext = this.context;\n    const updated = { ...currentContext,\n      ...context\n    };\n    this.context = updated;\n    return { ...updated\n    };\n  }\n\n  setState(state, event) {\n    if (!(state in this.machine.states)) {\n      throw new _errors__WEBPACK_IMPORTED_MODULE_0__[\"UnknownTransition\"]('target to', state);\n    }\n\n    trigger(this, 'onExit', this.state, event);\n    this.state = state;\n    trigger(this, 'onEntry', state, event);\n    return this.state;\n  }\n\n}\n\n//# sourceURL=webpack:///./src/state-machine/domain/MachineBox.js?");

/***/ }),

/***/ "./src/state-machine/domain/MachineDescription.js":
/*!********************************************************!*\
  !*** ./src/state-machine/domain/MachineDescription.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return MachineDescription; });\nclass MachineDescription {\n  constructor(desc) {\n    this.id = desc.id;\n    this.states = { ...desc.states\n    };\n    this.actions = { ...desc.actions\n    };\n  }\n\n}\n\n//# sourceURL=webpack:///./src/state-machine/domain/MachineDescription.js?");

/***/ }),

/***/ "./src/state-machine/domain/StateMachine.js":
/*!**************************************************!*\
  !*** ./src/state-machine/domain/StateMachine.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return StateMachine; });\n/* harmony import */ var _transactions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../transactions */ \"./src/state-machine/transactions.js\");\n\nfunction StateMachine(box) {\n  this.id = box.machine.id;\n\n  this.getState = () => box.state;\n\n  this.getContext = () => ({ ...box.context\n  });\n\n  this.isBroken = () => box.broken;\n\n  this.syncTransition = (...args) => Object(_transactions__WEBPACK_IMPORTED_MODULE_0__[\"transaction\"])(box, ...args)(box => box.transition(...args));\n\n  this.transition = (...args) => {\n    return new Promise((resolve, reject) => {\n      try {\n        this.syncTransition(...args);\n        resolve([this.getState(), this.getContext()]);\n      } catch (err) {\n        reject(err);\n      }\n    });\n  };\n}\n\n//# sourceURL=webpack:///./src/state-machine/domain/StateMachine.js?");

/***/ }),

/***/ "./src/state-machine/domain/errors.js":
/*!********************************************!*\
  !*** ./src/state-machine/domain/errors.js ***!
  \********************************************/
/*! exports provided: StateMachineError, StateMachineInitializeError, UnknownTransition, UnknownAction, NoSuchMachineBox, NoOpenTransaction, StateMachineWasBroken */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"StateMachineError\", function() { return StateMachineError; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"StateMachineInitializeError\", function() { return StateMachineInitializeError; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"UnknownTransition\", function() { return UnknownTransition; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"UnknownAction\", function() { return UnknownAction; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NoSuchMachineBox\", function() { return NoSuchMachineBox; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NoOpenTransaction\", function() { return NoOpenTransaction; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"StateMachineWasBroken\", function() { return StateMachineWasBroken; });\nclass StateMachineError extends Error {\n  constructor(message) {\n    super(message);\n    this.name = this.constructor.name;\n\n    if (typeof Error.captureStackTrace === 'function') {\n      Error.captureStackTrace(this, this.constructor);\n      this.stack = message.stack;\n    } else {\n      this.stack = new Error(message).stack;\n    }\n  }\n\n}\n\nclass StateMachineInitializeError extends StateMachineError {}\n\nclass UnknownTransition extends StateMachineError {\n  constructor(transition, state) {\n    super('Unknown transition ' + transition + ' for state ' + state);\n  }\n\n}\n\nclass UnknownAction extends StateMachineError {\n  constructor(action, transition, state) {\n    super('Unknown action ' + action + ' on ' + transition + ' in ' + state);\n  }\n\n}\n\nclass NoOpenTransaction extends StateMachineError {\n  constructor() {\n    super('No open transaction');\n  }\n\n}\n\nclass StateMachineWasBroken extends StateMachineError {\n  constructor() {\n    super('machine was broken');\n  }\n\n}\n\nclass NoSuchMachineBox extends StateMachineError {\n  constructor() {\n    super('no such machineBox');\n  }\n\n}\n\n\n\n//# sourceURL=webpack:///./src/state-machine/domain/errors.js?");

/***/ }),

/***/ "./src/state-machine/index.js":
/*!************************************!*\
  !*** ./src/state-machine/index.js ***!
  \************************************/
/*! exports provided: machine, useContext, useState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"machine\", function() { return machine; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"useContext\", function() { return useContext; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"useState\", function() { return useState; });\n/* harmony import */ var _domain_MachineDescription__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domain/MachineDescription */ \"./src/state-machine/domain/MachineDescription.js\");\n/* harmony import */ var _domain_StateMachine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./domain/StateMachine */ \"./src/state-machine/domain/StateMachine.js\");\n/* harmony import */ var _domain_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./domain/errors */ \"./src/state-machine/domain/errors.js\");\n/* harmony import */ var _transactions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./transactions */ \"./src/state-machine/transactions.js\");\n\n\n\n\n\nconst machine = desc => {\n  if (desc.states === undefined || desc.initialState === undefined || desc.states[desc.initialState] === undefined) {\n    throw new _domain_errors__WEBPACK_IMPORTED_MODULE_2__[\"StateMachineInitializeError\"]('you should provide initial state from states');\n  }\n\n  const machineDesc = new _domain_MachineDescription__WEBPACK_IMPORTED_MODULE_0__[\"default\"](desc);\n  const box = Object(_transactions__WEBPACK_IMPORTED_MODULE_3__[\"initializeBox\"])(machineDesc, desc.context, desc.initialState);\n  return new _domain_StateMachine__WEBPACK_IMPORTED_MODULE_1__[\"default\"](box);\n};\n\nconst useContext = () => {\n  const box = Object(_transactions__WEBPACK_IMPORTED_MODULE_3__[\"getCurrentMachineBox\"])();\n  return [{ ...box.context\n  }, (...args) => box.setContext(...args)];\n};\n\nconst useState = () => {\n  const box = Object(_transactions__WEBPACK_IMPORTED_MODULE_3__[\"getCurrentMachineBox\"])();\n  return [box.state, (state, event) => Object(_transactions__WEBPACK_IMPORTED_MODULE_3__[\"transaction\"])(box, state, event)((box, ...args) => box.setState(...args))];\n};\n\n\n\n//# sourceURL=webpack:///./src/state-machine/index.js?");

/***/ }),

/***/ "./src/state-machine/transactions.js":
/*!*******************************************!*\
  !*** ./src/state-machine/transactions.js ***!
  \*******************************************/
/*! exports provided: getMachineBox, initializeBox, getCurrentMachineBox, transaction, unregisterBox */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getMachineBox\", function() { return getMachineBox; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initializeBox\", function() { return initializeBox; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getCurrentMachineBox\", function() { return getCurrentMachineBox; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"transaction\", function() { return transaction; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"unregisterBox\", function() { return unregisterBox; });\n/* harmony import */ var _domain_MachineBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domain/MachineBox */ \"./src/state-machine/domain/MachineBox.js\");\n/* harmony import */ var _domain_errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./domain/errors */ \"./src/state-machine/domain/errors.js\");\n\n // при выполнении транзакции возможен вызов операций другого автомата,\n// поэтому нам нужен стэк автоматов\n\nconst current = [];\n\nconst getCurrentMachineBox = () => {\n  if (current.length === 0) {\n    throw new _domain_errors__WEBPACK_IMPORTED_MODULE_1__[\"NoOpenTransaction\"]();\n  }\n\n  return current[current.length - 1];\n};\n\nconst transaction = (machineBox, ...args) => fun => {\n  if (machineBox.broken) {\n    throw new _domain_errors__WEBPACK_IMPORTED_MODULE_1__[\"StateMachineWasBroken\"]();\n  }\n\n  try {\n    current.push(machineBox);\n    const retVal = fun(machineBox, ...args);\n    return retVal;\n  } catch (err) {\n    machineBox.broken = true;\n\n    if (err instanceof _domain_errors__WEBPACK_IMPORTED_MODULE_1__[\"StateMachineError\"]) {\n      throw err;\n    } else {\n      throw new _domain_errors__WEBPACK_IMPORTED_MODULE_1__[\"StateMachineError\"](err);\n    }\n  } finally {\n    current.pop();\n  }\n};\n\nconst machineBoxes = new WeakSet();\n\nconst getMachineBox = machine => {\n  if (machineBoxes.has(machine)) {\n    return machine;\n  } else {\n    throw new _domain_errors__WEBPACK_IMPORTED_MODULE_1__[\"NoSuchMachineBox\"]();\n  }\n};\n\nconst initializeBox = (machine, initialContext, initialState) => {\n  if (machineBoxes.has(machine)) {\n    throw new _domain_errors__WEBPACK_IMPORTED_MODULE_1__[\"StateMachineInitializeError\"]('Machine ' + machine.id.toString() + ' already exists');\n  }\n\n  const machineBox = new _domain_MachineBox__WEBPACK_IMPORTED_MODULE_0__[\"default\"](machine, { ...initialContext\n  }, initialState);\n  machineBoxes.add(machineBox);\n  return machineBox;\n};\n\nconst unregisterBox = box => {\n  machineBoxes.delete(box);\n};\n\n\n\n//# sourceURL=webpack:///./src/state-machine/transactions.js?");

/***/ })

/******/ });