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

var f = function f() {return 'F';};
var f1 = function f1() {return 'F1';};
var f2 = function f2() {return 'F2';};
var f3 = function f3() {return 'F3';};
var o = {
  p0: 'P0',
  p1: 'P1',
  p2: 'P2' };


var BLOCK = function BLOCK() {
  return (
    <main className={"B"}>
            <span />
            <span className={"B"} />
            <span className={`B`} />
            <span />
            <span className={`${f()}`} />
            <span className={`PRE${f()}`} />
            <span className={`${f()}POST`} />
            <span className={`PRE${f()}POST`} />
            <span className={`${f()}`} />
            <span className={`${p}`} />
            <span className={`PRE${p}POST`} />
            <span className={"B0 B1 B2"} />
            <span className={"B0 B2"} />
            <span className={`B0 B1${` ${f()}`}`} />
            <span className={`B0${` ${f()}`} B2`} />
            <span className={`${`${f()}`} B1 B2`} />
            <span className={`${`${f()}`} B2`} />
            <span className={`B1${` ${f()}`}`} />
            <span className={`${`${f()}`} B1`} />
            <span className={`B0 B1${` ${o}`}`} />
            <span className={`B0${` ${f()}`}${`${o}`}`} />
            <span className={`${`${f1()}${`${[f2(), f3()].some((f) => !!f())() ? " " : ""}`}`}${`${f2()}${`${[f3()].some((f) => !!f())() ? " " : ""}`}`}${`${f3()}`}`} />
            <span className={`${`${`${f1()}`}${`${[f2(), f3()].some((f) => !!f())() ? " " : ""}`}`}${`${f2()}${`${[f3()].some((f) => !!f())() ? " " : ""}`}`}${`${f3()}`}`} />
            <span className={`${`${`${f1()}`}${`${[f2(), f3()].some((f) => !!f())() ? " " : ""}`}`}${`${`${f2()}`}${`${[f3()].some((f) => !!f())() ? " " : ""}`}`}${`${`${f3()}`}`}`} />
        </main>);

};exports.BLOCK = BLOCK;