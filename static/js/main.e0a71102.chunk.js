/*! For license information please see main.e0a71102.chunk.js.LICENSE.txt */
(this["webpackJsonptimberborn-save-editor"]=this["webpackJsonptimberborn-save-editor"]||[]).push([[0],{11:function(e,t,n){},12:function(e,t,n){},16:function(e,t,n){"use strict";n.r(t);var a={};n.r(a),n.d(a,"BeaverCopier",(function(){return x})),n.d(a,"DownloadPlugin",(function(){return p})),n.d(a,"MapSizePlugin",(function(){return N}));var c=n(1),r=n.n(c),s=n(6),i=n.n(s),l=(n(11),n(2)),o=(n(12),n(0));function b(e){var t=e.onSaveLoaded,n=Object(c.useState)(),a=Object(l.a)(n,2),r=a[0],s=a[1],i=Object(c.useCallback)((function(e){try{var n,a=null===(n=e.target)||void 0===n?void 0:n.files,c=null===a||void 0===a?void 0:a.item(0);if(!c)throw new Error("Expected file to be uploaded, found none");var i=new FileReader;i.onload=function(e){try{var n=JSON.parse(i.result);t(n)}catch(r){throw s(r),r}},i.readAsText(c,"utf-8")}catch(r){throw s(r),r}}),[t,s]);return Object(o.jsx)("div",{className:"container my-4",children:Object(o.jsx)("div",{className:"row",children:Object(o.jsx)("div",{className:"col-md-6 offset-md-3",children:Object(o.jsx)("label",{className:"card",children:Object(o.jsxs)("div",{className:"card-body",children:[Object(o.jsx)("h1",{className:"card-title",children:"Timberborn Save Editor"}),Object(o.jsxs)("div",{className:"mb-3",children:[Object(o.jsxs)("span",{className:"form-label",children:["Upload your ",Object(o.jsx)("b",{children:"Demo save"})," to start"]}),Object(o.jsx)("input",{type:"file",name:"save",accept:".json",onInput:i,className:"form-control"}),r?Object(o.jsx)("small",{className:"form-text",children:"#{error}"}):Object(o.jsxs)("small",{className:"form-text",children:["Default directory: ",Object(o.jsx)("code",{children:"%USERPROFILE%\\Documents\\Timberborn\\DemoSaves\\"})]})]})]})})})})})}function j(e){e.saveData;var t=e.onHome;return Object(o.jsx)("nav",{className:"navbar navbar-light bg-light",children:Object(o.jsx)("div",{className:"container",children:Object(o.jsx)("a",{href:"#",onClick:function(e){e.preventDefault(),t()},className:"navbar-brand",children:"Timberborn Save Editor"})})})}var d=Object(c.createContext)(void 0),u=n(3),m=n(4);function h(e){return JSON.parse(JSON.stringify(e))}for(var O=[],v=0;v<256;v++)O[v]=(v<16?"0":"")+v.toString(16);var x={id:"BeaverCopier",name:"Beaver copier",group:"Beavers",enabled:!0,read:function(e){return e},write:function(e,t){return t},Preview:function(e){var t=e.saveData;return Object(o.jsx)(f,{entities:t.Entities})},Editor:function(e){var t=e.initialData,n=e.onClose,a=e.onSubmit,r=t.Singletons.NameService.Names,s=t.Singletons.DayNightCycle.DayNumber,i=Object(c.useState)((function(){return t.Entities.filter((function(e){return"BeaverChild"===e.TemplateName||"BeaverAdult"===e.TemplateName}))})),b=Object(l.a)(i,2),j=b[0],d=b[1],v=Object(c.useState)(0),x=Object(l.a)(v,2),p=x[0],N=x[1],g=Object(c.useState)(10),S=Object(l.a)(g,2),y=S[0],C=S[1],D=Object(c.useState)(70),w=Object(l.a)(D,2),B=w[0],M=w[1],k=Object(m.sortBy)(j.slice(),(function(e){return-e.Components.Beaver.DayOfBirth})),z=p*y,E=Object(c.useCallback)((function(e){var t=h(e),n=function(){var e=4294967295*Math.random()|0,t=4294967295*Math.random()|0,n=4294967295*Math.random()|0,a=4294967295*Math.random()|0;return O[255&e]+O[e>>8&255]+O[e>>16&255]+O[e>>24&255]+"-"+O[255&t]+O[t>>8&255]+"-"+O[t>>16&15|64]+O[t>>24&255]+"-"+O[63&n|128]+O[n>>8&255]+"-"+O[n>>16&255]+O[n>>24&255]+O[255&a]+O[a>>8&255]+O[a>>16&255]+O[a>>24&255]}();return t.Id=n,t.Components.BehaviorManager={},"BeaverAdult"===t.TemplateName&&(t.Components.Beaver.DayOfBirth=s-5),t.Components.Beaver.Name=Object(m.sample)(r),t}),[r,s]),P=Object(c.useCallback)((function(e){d(j.slice().concat([E(e)]))}),[j,d,E]),I=Object(c.useCallback)((function(){var e=t.Entities.filter((function(e){return"BeaverChild"!==e.TemplateName&&"BeaverAdult"!==e.TemplateName})).concat(j);a(Object(u.a)(Object(u.a)({},t),{},{Entities:e}))}),[a,j,t]),T=y+z<j.length,F=Object(c.useCallback)((function(){for(var e=j.slice(0,B);e.length<B;)e.push(E(Object(m.sample)(j)));d(e)}),[j,B,E]);return Object(o.jsx)("div",{className:"container my-4",children:Object(o.jsxs)("div",{className:"card",children:[Object(o.jsxs)("div",{className:"card-body",children:[Object(o.jsx)("h1",{className:"card-title",children:"Beaver Copier"}),Object(o.jsxs)("div",{className:"d-flex",children:[Object(o.jsx)("div",{children:Object(o.jsx)(f,{entities:j})}),Object(o.jsxs)("div",{className:"ms-auto",children:[Object(o.jsx)("button",{type:"button",onClick:n,className:"btn btn-light",children:"Discard changes"})," ",Object(o.jsx)("button",{type:"button",onClick:I,className:"btn btn-primary",children:"Submit"})]})]}),j.length>80?Object(o.jsxs)("div",{className:"alert alert-danger mt-1",children:[Object(o.jsx)("b",{children:"WARNING:"})," You have ",j.length," beavers. Newer versions of the Timberborn Demo will randomly crash with over 80 beavers."]}):null]}),Object(o.jsxs)("table",{className:"table my-0",children:[Object(o.jsx)("thead",{children:Object(o.jsxs)("tr",{children:[Object(o.jsx)("th",{children:"Name"}),Object(o.jsxs)("th",{children:["Age ",Object(o.jsx)("small",{style:{fontWeight:"normal"},children:"a-z"})]}),Object(o.jsx)("th",{children:"Coordinates"}),Object(o.jsx)("th",{})]})}),Object(o.jsx)("tbody",{children:k.slice(z,z+y).map((function(e){return Object(o.jsxs)("tr",{children:[Object(o.jsx)("td",{children:e.Components.Beaver.Name}),Object(o.jsxs)("td",{children:[t.Singletons.DayNightCycle.DayNumber-e.Components.Beaver.DayOfBirth," ","BeaverChild"===e.TemplateName?Object(o.jsx)("small",{children:"(child)"}):null]}),Object(o.jsxs)("td",{children:["x: ",Object(o.jsx)("b",{children:Math.round(e.Components.Beaver.Position.X)})," ","y: ",Object(o.jsx)("b",{children:Math.round(e.Components.Beaver.Position.Y)})," ","z: ",Object(o.jsx)("b",{children:Math.round(e.Components.Beaver.Position.Z)})," "]}),Object(o.jsx)("td",{className:"text-end py-1",children:Object(o.jsx)("button",{type:"button",className:"btn btn-light btn-sm",onClick:function(){return P(e)},children:"Copy"})})]},e.Id)}))}),Object(o.jsx)("tfoot",{children:Object(o.jsx)("tr",{children:Object(o.jsx)("td",{colSpan:4,className:"py-1",children:Object(o.jsxs)("div",{className:"d-flex",children:[Object(o.jsxs)("div",{className:"me-auto",children:["Showing ",Object(o.jsx)("strong",{children:z})," - ",Object(o.jsx)("strong",{children:Math.min(j.length,z+y)})," of ",Object(o.jsx)("strong",{children:j.length})]}),Object(o.jsxs)("form",{className:"me-3 d-flex",onSubmit:function(e){e.preventDefault(),F()},children:[Object(o.jsx)("label",{className:"form-label me-1 mt-1 mb-0",htmlFor:"addRandom",children:"Set beavers"}),Object(o.jsx)("input",{type:"number",id:"addRandom",className:"form-control form-control-sm",value:B,onChange:function(e){M(parseInt(e.target.value,10))},width:3,style:{width:60}}),Object(o.jsx)("button",{type:"submit",className:"ms-1 btn btn-primary btn-sm",children:"Set"})]}),Object(o.jsxs)("div",{className:"me-3 d-flex",children:[Object(o.jsx)("label",{className:"form-label me-1 mt-1 mb-0",htmlFor:"pageSize",children:"Pagesize"}),Object(o.jsxs)("select",{id:"pageSize",className:"form-control form-control-sm",value:y,onChange:function(e){N(0),C(parseInt(e.target.value,10))},children:[Object(o.jsx)("option",{children:"10"}),Object(o.jsx)("option",{children:"25"}),Object(o.jsx)("option",{children:"100"}),Object(o.jsx)("option",{children:"250"}),Object(o.jsx)("option",{children:"1000"}),Object(o.jsx)("option",{value:"".concat(Number.MAX_SAFE_INTEGER),children:"ALL"})]})]}),Object(o.jsxs)("div",{children:[Object(o.jsx)("button",{className:"btn btn-sm btn-light",disabled:p<=0,onClick:function(){return N(p-1)},children:"\u2039 prev"})," ",Object(o.jsx)("button",{className:"btn btn-sm btn-light",disabled:!T,onClick:function(){return N(p+1)},children:"next \u203a"})]})]})})})})]})]})})}};function f(e){var t=e.entities.reduce((function(e,t){return"BeaverAdult"===t.TemplateName&&e.adultCount++,"BeaverChild"===t.TemplateName&&e.childCount++,e}),{adultCount:0,childCount:0}),n=t.adultCount,a=t.childCount,c=n+a;return Object(o.jsxs)("span",{children:["You have ",Object(o.jsx)("strong",{children:c})," beavers: ",Object(o.jsx)("strong",{children:a})," kits and ",Object(o.jsx)("strong",{children:n})," adults."]})}var p={id:"DownloadPlugin",name:"Download",group:"General",enabled:!0,read:function(e){return e},write:function(e,t){throw new Error("Not implemented")},Preview:function(e){e.saveData;return null},Editor:function(e){var t=e.initialData,n=e.onClose,a=Object(c.useMemo)((function(){return new Blob([JSON.stringify(t,null,2)],{type:"application/json"})}),[t]),r=URL.createObjectURL(a),s=new Date,i="".concat(s.toISOString().substr(0,10)," ").concat(s.getHours(),"h").concat(s.getMinutes(),"m, Day ").concat(t.Singletons.CycleService.Cycle,"-").concat(t.Singletons.CycleService.CycleDay," MODDED.json");return Object(o.jsx)("div",{className:"container",children:Object(o.jsx)("div",{className:"card my-4",children:Object(o.jsxs)("div",{className:"card-body",children:[Object(o.jsx)("h1",{className:"card-title",children:"Download"}),Object(o.jsxs)("div",{className:"d-flex",children:[Object(o.jsx)("a",{href:r,download:i,className:"btn btn-primary",onClick:function(){return n()},children:"Download"}),Object(o.jsx)("button",{type:"button",className:"btn btn-light ms-auto",onClick:n,children:"Close"})]})]})})})}},N={id:"MapSizePlugin",name:"Map size",group:"General",enabled:!0,read:function(e){return{x:e.Singletons.MapSize.Size.X,y:e.Singletons.MapSize.Size.Y}},write:function(e,t){return e.Singletons.MapSize.Size.X=t.x,e.Singletons.MapSize.Size.Y=t.y,e},Preview:function(e){var t=e.saveData,n=t.Singletons.MapSize.Size.X,a=t.Singletons.MapSize.Size.Y;return Object(o.jsxs)("span",{children:[Object(o.jsx)("strong",{children:n})," \xd7 ",Object(o.jsx)("strong",{children:a})]})},Editor:function(e){var t=e.initialData,n=e.onClose,a=e.onSubmit,r=Object(c.useState)(t),s=Object(l.a)(r,2),i=s[0],b=s[1];return Object(o.jsx)("form",{onSubmit:function(e){e.preventDefault(),a(i)},children:Object(o.jsx)("div",{className:"container",children:Object(o.jsx)("div",{className:"card my-4",children:Object(o.jsxs)("div",{className:"card-body",children:[Object(o.jsx)("h1",{className:"card-title",children:"Map size editor"}),Object(o.jsx)("p",{children:"This is just a demo editor - changing this will likely break something."}),Object(o.jsxs)("div",{className:"mb-3",children:[Object(o.jsx)("label",{htmlFor:"x",className:"form-label",children:"X"}),Object(o.jsx)("input",{id:"x",type:"number",className:"form-control",value:i.x,onInput:function(e){return b(Object(u.a)(Object(u.a)({},i),{},{x:parseInt(e.target.value,10)}))}})]}),Object(o.jsxs)("div",{className:"mb-3",children:[Object(o.jsx)("label",{htmlFor:"y",className:"form-label",children:"Y"}),Object(o.jsx)("input",{id:"y",type:"number",className:"form-control",value:i.y,onInput:function(e){return b(Object(u.a)(Object(u.a)({},i),{},{y:parseInt(e.target.value,10)}))}})]}),Object(o.jsxs)("div",{className:"d-flex",children:[Object(o.jsx)("button",{type:"submit",className:"btn btn-primary",children:"Submit"}),Object(o.jsx)("button",{type:"button",className:"btn btn-light ms-auto",onClick:n,children:"Discard changes"})]})]})})})})}},g=Object.values(a).filter((function(e){return e&&"object"===typeof e}));function S(e){var t=e.saveData,n=e.onSelectPlugin,a=Object(c.useMemo)((function(){return Object(m.toPairs)(Object(m.groupBy)(g.filter((function(e){return"function"===typeof e.enabled?e.enabled({saveData:t}):e.enabled})),"group"))}),[t]);return Object(o.jsx)("div",{className:"container",children:a.map((function(e){var a=Object(l.a)(e,2),c=a[0],r=a[1];return Object(o.jsxs)("div",{className:"my-2",children:[Object(o.jsx)("h2",{className:"ps-2",children:c}),Object(o.jsx)("div",{className:"list-group my-2",children:r.map((function(e){var a=e.id,c=e.name,r=e.Preview;return Object(o.jsxs)("button",{type:"button",onClick:function(e){e.preventDefault(),n(a)},className:"list-group-item list-group-item-action",children:[Object(o.jsx)("div",{className:"fw-bold",children:c}),Object(o.jsx)("div",{children:Object(o.jsx)(r,{saveData:t})})]},a)}))})]},c)}))})}function y(e){var t=e.saveData,n=e.pluginId,a=e.onClose,r=e.onSubmit,s=Object(c.useMemo)((function(){return g.find((function(e){return e.id===n}))}),[n]),i=s.Editor,l=s.read,b=s.write,j=Object(c.useMemo)((function(){return l(h(t))}),[l,t]),d=Object(c.useCallback)((function(e){r(h(b(t,e)))}),[b,t,r]);return Object(o.jsx)(i,{initialData:j,onClose:a,onSubmit:d})}function C(e){var t=e.saveData,n=e.onSubmit,a=Object(c.useState)(null),r=Object(l.a)(a,2),s=r[0],i=r[1],b=Object(c.useCallback)((function(e){n(e),i(null)}),[n]),d=Object(c.useCallback)((function(){s?window.confirm("Discard changes in this form? Earlier changes will not be discarded.")&&i(null):window.confirm("Close this save file?")&&n(null)}),[s,n]);return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)(j,{onHome:d}),null===s?Object(o.jsx)(S,{saveData:t,onSelectPlugin:i}):Object(o.jsx)(y,{saveData:t,pluginId:s,onClose:function(){return i(null)},onSubmit:b})]})}var D=function(){var e=Object(c.useState)(null),t=Object(l.a)(e,2),n=t[0],a=t[1];return Object(o.jsx)(o.Fragment,{children:null===n?Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)(j,{onHome:function(){}}),Object(o.jsx)(b,{onSaveLoaded:a})]}):Object(o.jsx)(d.Provider,{value:{saveData:n},children:Object(o.jsx)(C,{saveData:n,onSubmit:a})})})},w=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,17)).then((function(t){var n=t.getCLS,a=t.getFID,c=t.getFCP,r=t.getLCP,s=t.getTTFB;n(e),a(e),c(e),r(e),s(e)}))};i.a.render(Object(o.jsx)(r.a.StrictMode,{children:Object(o.jsx)(D,{})}),document.getElementById("root")),w()}},[[16,1,2]]]);
//# sourceMappingURL=main.e0a71102.chunk.js.map