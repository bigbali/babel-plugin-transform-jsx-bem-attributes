"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.className = exports.BLOCK = exports.App = void 0;var App = function App() {
  function func() {};
  var obj = { a: 0, b: 1 };

  return (
    <div x={'no'} className={"Block0"}>
            <span />
            <span />
            <span />
            <span />
            <span />
            <div x={'yes'} className={"Block1"}>
                <span />
                <span />
                <span />
                <span />
                <span />
            </div>
            <div x={'maybe'} className={`${func()}`}>
                <span />
                <span />
                <span />
                <span />
                <span />
            </div>
            <div x={'maybe'} className={"B0 B1 B2"}>
                <span />
                <span />
                <span />
                <span />
                <span />
            </div>
        </div>);

};exports.App = App;

var className = function className() {
  return (
    <div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
        </div>);

};exports.className = className;

var BLOCK = function BLOCK() {
  return (
    <main className={"B"}>
            <span className={`${func()}`} />
            <span className={`${obj}`} />
            <span className={`PRE ${func()} POST`} />
            <span className={`${`${`PRE0 ${func()} POST0`}`}${`${`PRE1 ${func()} POST1`}`}`} />
            <span className={"B0 B1 B2"} />
            <span className={"B0 B2"} />
            <span className={`B0${` ${func()}`} B2`} />
            <span className={`${`${func()}`} B2`} />
            <span className={`${`${func()}`} B1 B2`} />
            <span className={`${`${func()}`} B1`} />
            <span className={`${`${func()}${`${[func(), func()].some((f) => !!f())() ? " " : ""}`}`}${`${func()}${`${[func()].some((f) => !!f())() ? " " : ""}`}`}${`${func()}`}`} />
        </main>);

};exports.BLOCK = BLOCK;