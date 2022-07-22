"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.className = exports.App = void 0;var App = function App() {
  function func() {};
  var obj = { a: 0, b: 1 };

  return (
    <div x={'no'} className={"Block"}>
            <span className={`${"Block"}`} />
            <span className={`${"Block"}`} />
            <span className={`${"Block"}`} />
            <span className={`${"Block"}`} />
            <span className={`${"Block"}`} />
        </div>);

};exports.App = App;

var className = function className() {
  return (
    <div className={"0ClassName"}>
            <div className={`${"1ClassName"}`} />
            <div className={`${'2ClassName0'}${'2ClassName1'}`} />
            <div className={`${'3ClassName0'}${`${''}`}`} />
            <div className={`${'4ClassName0'}${`${null}`}`} />
            <div className={`${`${''}`}${`${''}`}`} />
            <div className={`${`${''}`}${'6ClassName1'}`} />
            <div className={``} />
            <div className={`${`${func()}`}`} />
            <div className={`${`${func()}`}`} />
            <div className={`${`PRE ${func()} POST`}`} />
            <div className={`${`${func()}`}${`${obj}`}`} />
            <div className={`${`PRE ${func()}${obj} POST`}`} />
        </div>);

};exports.className = className;