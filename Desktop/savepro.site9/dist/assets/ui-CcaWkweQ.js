import{r as y,g as v,a as b}from"./vendor-C8w-UNLI.js";function g(n,i){for(var s=0;s<i.length;s++){const t=i[s];if(typeof t!="string"&&!Array.isArray(t)){for(const o in t)if(o!=="default"&&!(o in n)){const u=Object.getOwnPropertyDescriptor(t,o);u&&Object.defineProperty(n,o,u.get?u:{enumerable:!0,get:()=>t[o]})}}}return Object.freeze(Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}))}var _={exports:{}},a={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var d;function j(){if(d)return a;d=1;var n=y(),i=Symbol.for("react.element"),s=Symbol.for("react.fragment"),t=Object.prototype.hasOwnProperty,o=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,u={key:!0,ref:!0,__self:!0,__source:!0};function m(f,e,l){var r,c={},p=null,R=null;l!==void 0&&(p=""+l),e.key!==void 0&&(p=""+e.key),e.ref!==void 0&&(R=e.ref);for(r in e)t.call(e,r)&&!u.hasOwnProperty(r)&&(c[r]=e[r]);if(f&&f.defaultProps)for(r in e=f.defaultProps,e)c[r]===void 0&&(c[r]=e[r]);return{$$typeof:i,type:f,key:p,ref:R,props:c,_owner:o.current}}return a.Fragment=s,a.jsx=m,a.jsxs=m,a}var x;function E(){return x||(x=1,_.exports=j()),_.exports}var S=E(),O=y();const q=v(O),h=g({__proto__:null,default:q},[O]);var D=b();const k=v(D);export{h as R,q as a,k as b,S as j,O as r};
