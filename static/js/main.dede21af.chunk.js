(this["webpackJsonptimberborn-save-editor"]=this["webpackJsonptimberborn-save-editor"]||[]).push([[0],{13:function(e,t,n){},14:function(e,t,n){},18:function(e,t,n){"use strict";n.r(t);var a={};n.r(a),n.d(a,"BeaverCopier",(function(){return p})),n.d(a,"DownloadPlugin",(function(){return g})),n.d(a,"MapSizePlugin",(function(){return y}));var c=n(1),r=n.n(c),i=n(7),s=n.n(i),l=(n(13),n(2)),o=(n(14),n(0));function d(e){var t=e.onSaveLoaded,n=Object(c.useState)(),a=Object(l.a)(n,2),r=a[0],i=a[1],s=Object(c.useCallback)((function(e){try{var n,a=null===(n=e.target)||void 0===n?void 0:n.files,c=null===a||void 0===a?void 0:a.item(0);if(!c)throw new Error("Expected file to be uploaded, found none");var s=new FileReader;s.onload=function(e){try{var n=JSON.parse(s.result);t(n)}catch(r){throw i(r),r}},s.readAsText(c,"utf-8")}catch(r){throw i(r),r}}),[t,i]);return Object(o.jsx)("div",{className:"container my-4",children:Object(o.jsx)("div",{className:"row",children:Object(o.jsx)("div",{className:"col-md-6 offset-md-3",children:Object(o.jsx)("label",{className:"card",children:Object(o.jsxs)("div",{className:"card-body",children:[Object(o.jsx)("h1",{className:"card-title",children:"Timberborn Save Editor"}),Object(o.jsxs)("div",{className:"mb-3",children:[Object(o.jsxs)("span",{className:"form-label",children:["Upload your ",Object(o.jsx)("b",{children:"Demo save"})," to start"]}),Object(o.jsx)("input",{type:"file",name:"save",accept:".json",onInput:s,className:"form-control"}),r?Object(o.jsx)("small",{className:"form-text",children:"#{error}"}):Object(o.jsxs)("small",{className:"form-text",children:["Default directory: ",Object(o.jsx)("code",{children:"%USERPROFILE%\\Documents\\Timberborn\\DemoSaves\\"})]})]})]})})})})})}function b(e){e.saveData;var t=e.onHome;return Object(o.jsx)("nav",{className:"navbar navbar-light bg-light",children:Object(o.jsx)("div",{className:"container",children:Object(o.jsx)("a",{href:"#",onClick:function(e){e.preventDefault(),t()},className:"navbar-brand",children:"Timberborn Save Editor"})})})}for(var j=Object(c.createContext)(void 0),u=n(3),m=n(4),h=n(8),O=[],v=0;v<256;v++)O[v]=(v<16?"0":"")+v.toString(16);var f={setAge:function(e,t,n){var a=e.Singletons.DayNightCycle.DayNumber;t.Components.Beaver.DayOfBirth=Math.floor(a-n)},setDefaultNeeds:function(e){var t,n=Object(h.a)(e.Components.NeedManager.Needs);try{for(n.s();!(t=n.n()).done;){var a=t.value;["Hunger","Thirst","Sleep"].includes(a.Name)&&(a.Points=1)}}catch(c){n.e(c)}finally{n.f()}},setDefaultName:function(e,t){var n=e.Singletons.NameService.Names;t.Components.Beaver.Name=Object(u.sample)(n)},reset:function(e){e.Id=function(){var e=4294967295*Math.random()|0,t=4294967295*Math.random()|0,n=4294967295*Math.random()|0,a=4294967295*Math.random()|0;return O[255&e]+O[e>>8&255]+O[e>>16&255]+O[e>>24&255]+"-"+O[255&t]+O[t>>8&255]+"-"+O[t>>16&15|64]+O[t>>24&255]+"-"+O[63&n|128]+O[n>>8&255]+"-"+O[n>>16&255]+O[n>>24&255]+O[255&a]+O[a>>8&255]+O[a>>16&255]+O[a>>24&255]}(),f.setDefaultNeeds(e),Object.assign(e.Components,{BehaviorManager:{RunningBehaviorId:"HomelessRootBehavior",RunningBehaviorOwner:e.Id,ReturnToBehavior:!1,TimestampedBehaviorLog:["HomelessRootBehavior 1.00"]},GoodCarrier:{},Enterer:{},LifeExpectancyManager:{SumOfLifeExpectancyObservations:0,NumberOfLifeExpectancyObservations:0,BaseLifeExpectancy:0},AttractionAttender:{FirstVisit:!1},Dweller:{},Procreator:{LastProcreationTimestamp:0},UnreachableHomeUnassigner:{CheckHomeReachability:!1},GoodReserver:{},MortalNeeder:{DeathDays:[]},Builder:{},Planter:{},HomelessRootBehavior:{},MortalRootBehavior:{},WanderRootBehavior:{Walked:!1}})}};function x(e){return JSON.parse(JSON.stringify(e))}var p={id:"BeaverCopier",name:"Beaver copier",group:"Beavers",position:1,enabled:!0,read:function(e){return e},write:function(e,t){return t},Preview:function(e){var t=e.saveData;return Object(o.jsx)(N,{entities:t.Entities})},Editor:function(e){var t=e.initialData,n=e.onClose,a=e.onSubmit,r=Object(c.useState)((function(){return t.Entities.filter((function(e){return"BeaverChild"===e.TemplateName||"BeaverAdult"===e.TemplateName}))})),i=Object(l.a)(r,2),s=i[0],d=i[1],b=Object(c.useState)(0),j=Object(l.a)(b,2),h=j[0],O=j[1],v=Object(c.useState)(10),p=Object(l.a)(v,2),g=p[0],y=p[1],S=Object(c.useState)(70),C=Object(l.a)(S,2),D=C[0],B=C[1],w=Object(u.sortBy)(s.slice(),(function(e){return-e.Components.Beaver.DayOfBirth})),M=h*g,E=Object(c.useCallback)((function(e){var n=x(e);return f.reset(n),f.setDefaultName(t,n),"BeaverAdult"===n.TemplateName&&f.setAge(t,e,5),n}),[t]),k=Object(c.useCallback)((function(e){d(s.slice().concat([E(e)]))}),[s,d,E]),P=Object(c.useCallback)((function(){var e=t.Entities.filter((function(e){return"BeaverChild"!==e.TemplateName&&"BeaverAdult"!==e.TemplateName})).concat(s);a(Object(m.a)(Object(m.a)({},t),{},{Entities:e}))}),[a,s,t]),T=g+M<s.length,z=Object(c.useCallback)((function(){for(var e=s.filter((function(e){return"BeaverAdult"===e.TemplateName})),t=(e.length>0?e:s).slice(0,D),n=t.slice();t.length<D;)t.push(E(Object(u.sample)(n)));d(t)}),[s,D,E]);return Object(o.jsx)("div",{className:"container my-4",children:Object(o.jsxs)("div",{className:"card",children:[Object(o.jsxs)("div",{className:"card-body",children:[Object(o.jsx)("h1",{className:"card-title",children:"Beaver Copier"}),Object(o.jsxs)("div",{className:"d-flex",children:[Object(o.jsx)("div",{children:Object(o.jsx)(N,{entities:s})}),Object(o.jsxs)("div",{className:"ms-auto",children:[Object(o.jsx)("button",{type:"button",onClick:n,className:"btn btn-light",children:"Discard changes"})," ",Object(o.jsx)("button",{type:"button",onClick:P,className:"btn btn-primary",children:"Submit"})]})]}),s.length>80?Object(o.jsxs)("div",{className:"alert alert-danger mt-1",children:[Object(o.jsx)("b",{children:"WARNING:"})," You have ",s.length," beavers. Newer versions of the Timberborn Demo will randomly crash with over 80 beavers."]}):null]}),Object(o.jsxs)("table",{className:"table my-0",children:[Object(o.jsx)("thead",{children:Object(o.jsxs)("tr",{children:[Object(o.jsx)("th",{children:"Name"}),Object(o.jsxs)("th",{children:["Age ",Object(o.jsx)("small",{style:{fontWeight:"normal"},children:"a-z"})]}),Object(o.jsx)("th",{children:"Coordinates"}),Object(o.jsx)("th",{})]})}),Object(o.jsx)("tbody",{children:w.slice(M,M+g).map((function(e){return Object(o.jsxs)("tr",{children:[Object(o.jsx)("td",{children:e.Components.Beaver.Name}),Object(o.jsxs)("td",{children:[t.Singletons.DayNightCycle.DayNumber-e.Components.Beaver.DayOfBirth," ","BeaverChild"===e.TemplateName?Object(o.jsx)("small",{children:"(child)"}):null]}),Object(o.jsxs)("td",{children:["x: ",Object(o.jsx)("b",{children:Math.round(e.Components.Beaver.Position.X)})," ","y: ",Object(o.jsx)("b",{children:Math.round(e.Components.Beaver.Position.Y)})," ","z: ",Object(o.jsx)("b",{children:Math.round(e.Components.Beaver.Position.Z)})," "]}),Object(o.jsx)("td",{className:"text-end py-1",children:Object(o.jsx)("button",{type:"button",className:"btn btn-light btn-sm",onClick:function(){return k(e)},children:"Copy"})})]},e.Id)}))}),Object(o.jsx)("tfoot",{children:Object(o.jsx)("tr",{children:Object(o.jsx)("td",{colSpan:4,className:"py-1",children:Object(o.jsxs)("div",{className:"d-flex",children:[Object(o.jsxs)("div",{className:"me-auto",children:["Showing ",Object(o.jsx)("strong",{children:M})," - ",Object(o.jsx)("strong",{children:Math.min(s.length,M+g)})," of ",Object(o.jsx)("strong",{children:s.length})]}),Object(o.jsxs)("form",{className:"me-3 d-flex",onSubmit:function(e){e.preventDefault(),z()},children:[Object(o.jsx)("label",{className:"form-label me-1 mt-1 mb-0",htmlFor:"addRandom",children:"Set beavers"}),Object(o.jsx)("input",{type:"number",id:"addRandom",className:"form-control form-control-sm",value:D,onChange:function(e){B(parseInt(e.target.value,10))},width:3,style:{width:60}}),Object(o.jsx)("button",{type:"submit",className:"ms-1 btn btn-primary btn-sm",children:"Set"})]}),Object(o.jsxs)("div",{className:"me-3 d-flex",children:[Object(o.jsx)("label",{className:"form-label me-1 mt-1 mb-0",htmlFor:"pageSize",children:"Pagesize"}),Object(o.jsxs)("select",{id:"pageSize",className:"form-control form-control-sm",value:g,onChange:function(e){O(0),y(parseInt(e.target.value,10))},children:[Object(o.jsx)("option",{children:"10"}),Object(o.jsx)("option",{children:"25"}),Object(o.jsx)("option",{children:"100"}),Object(o.jsx)("option",{children:"250"}),Object(o.jsx)("option",{children:"1000"}),Object(o.jsx)("option",{value:"".concat(Number.MAX_SAFE_INTEGER),children:"ALL"})]})]}),Object(o.jsxs)("div",{children:[Object(o.jsx)("button",{className:"btn btn-sm btn-light",disabled:h<=0,onClick:function(){return O(h-1)},children:"\u2039 prev"})," ",Object(o.jsx)("button",{className:"btn btn-sm btn-light",disabled:!T,onClick:function(){return O(h+1)},children:"next \u203a"})]})]})})})})]})]})})}};function N(e){var t=e.entities.reduce((function(e,t){return"BeaverAdult"===t.TemplateName&&e.adultCount++,"BeaverChild"===t.TemplateName&&e.childCount++,e}),{adultCount:0,childCount:0}),n=t.adultCount,a=t.childCount,c=n+a;return Object(o.jsxs)("span",{children:["You have ",Object(o.jsx)("strong",{children:c})," beavers: ",Object(o.jsx)("strong",{children:a})," kits and ",Object(o.jsx)("strong",{children:n})," adults."]})}var g={id:"DownloadPlugin",name:"Download",group:"General",position:-1,enabled:!0,read:function(e){return e},write:function(e,t){throw new Error("Not implemented")},Preview:function(e){e.saveData;return null},Editor:function(e){var t=e.initialData,n=e.onClose,a=Object(c.useMemo)((function(){return new Blob([JSON.stringify(t,null,2)],{type:"application/json"})}),[t]),r=URL.createObjectURL(a),i=new Date,s="".concat(i.toISOString().substr(0,10)," ").concat(i.getHours(),"h").concat(i.getMinutes(),"m, Day ").concat(t.Singletons.CycleService.Cycle,"-").concat(t.Singletons.CycleService.CycleDay," MODDED.json");return Object(o.jsx)("div",{className:"container",children:Object(o.jsx)("div",{className:"card my-4",children:Object(o.jsxs)("div",{className:"card-body",children:[Object(o.jsx)("h1",{className:"card-title",children:"Download"}),Object(o.jsxs)("div",{className:"d-flex",children:[Object(o.jsx)("a",{href:r,download:s,className:"btn btn-primary",onClick:function(){return n()},children:"Download"}),Object(o.jsx)("button",{type:"button",className:"btn btn-light ms-auto",onClick:n,children:"Close"})]})]})})})}},y={id:"MapSizePlugin",name:"Map size",group:"General",position:-1,enabled:!0,read:function(e){return{x:e.Singletons.MapSize.Size.X,y:e.Singletons.MapSize.Size.Y}},write:function(e,t){return e.Singletons.MapSize.Size.X=t.x,e.Singletons.MapSize.Size.Y=t.y,e},Preview:function(e){var t=e.saveData,n=t.Singletons.MapSize.Size.X,a=t.Singletons.MapSize.Size.Y;return Object(o.jsxs)("span",{children:[Object(o.jsx)("strong",{children:n})," \xd7 ",Object(o.jsx)("strong",{children:a})]})},Editor:function(e){var t=e.initialData,n=e.onClose,a=e.onSubmit,r=Object(c.useState)(t),i=Object(l.a)(r,2),s=i[0],d=i[1];return Object(o.jsx)("form",{onSubmit:function(e){e.preventDefault(),a(s)},children:Object(o.jsx)("div",{className:"container",children:Object(o.jsx)("div",{className:"card my-4",children:Object(o.jsxs)("div",{className:"card-body",children:[Object(o.jsx)("h1",{className:"card-title",children:"Map size editor"}),Object(o.jsx)("p",{children:"This is just a demo editor - changing this will likely break something."}),Object(o.jsxs)("div",{className:"mb-3",children:[Object(o.jsx)("label",{htmlFor:"x",className:"form-label",children:"X"}),Object(o.jsx)("input",{id:"x",type:"number",className:"form-control",value:s.x,onInput:function(e){return d(Object(m.a)(Object(m.a)({},s),{},{x:parseInt(e.target.value,10)}))}})]}),Object(o.jsxs)("div",{className:"mb-3",children:[Object(o.jsx)("label",{htmlFor:"y",className:"form-label",children:"Y"}),Object(o.jsx)("input",{id:"y",type:"number",className:"form-control",value:s.y,onInput:function(e){return d(Object(m.a)(Object(m.a)({},s),{},{y:parseInt(e.target.value,10)}))}})]}),Object(o.jsxs)("div",{className:"d-flex",children:[Object(o.jsx)("button",{type:"submit",className:"btn btn-primary",children:"Submit"}),Object(o.jsx)("button",{type:"button",className:"btn btn-light ms-auto",onClick:n,children:"Discard changes"})]})]})})})})}},S=Object(u.sortBy)(Object.values(a).filter((function(e){return e&&"object"===typeof e})),"position");function C(e){var t=e.saveData,n=e.onSelectPlugin,a=Object(c.useMemo)((function(){return Object(u.toPairs)(Object(u.groupBy)(S.filter((function(e){return"function"===typeof e.enabled?e.enabled({saveData:t}):e.enabled})),"group"))}),[t]);return Object(o.jsx)("div",{className:"container",children:a.map((function(e){var a=Object(l.a)(e,2),c=a[0],r=a[1];return Object(o.jsxs)("div",{className:"my-2",children:[Object(o.jsx)("h2",{className:"ps-2",children:c}),Object(o.jsx)("div",{className:"list-group my-2",children:r.map((function(e){var a=e.id,c=e.name,r=e.Preview;return Object(o.jsxs)("button",{type:"button",onClick:function(e){e.preventDefault(),n(a)},className:"list-group-item list-group-item-action",children:[Object(o.jsx)("div",{className:"fw-bold",children:c}),Object(o.jsx)("div",{children:Object(o.jsx)(r,{saveData:t})})]},a)}))})]},c)}))})}function D(e){var t=e.saveData,n=e.pluginId,a=e.onClose,r=e.onSubmit,i=Object(c.useMemo)((function(){return S.find((function(e){return e.id===n}))}),[n]),s=i.Editor,l=i.read,d=i.write,b=Object(c.useMemo)((function(){return l(x(t))}),[l,t]),j=Object(c.useCallback)((function(e){r(x(d(t,e)))}),[d,t,r]);return Object(o.jsx)(s,{initialData:b,onClose:a,onSubmit:j})}function B(e){var t=e.saveData,n=e.onSubmit,a=Object(c.useState)(null),r=Object(l.a)(a,2),i=r[0],s=r[1],d=Object(c.useCallback)((function(e){n(e),s(null)}),[n]),j=Object(c.useCallback)((function(){i?window.confirm("Discard changes in this form? Earlier changes will not be discarded.")&&s(null):window.confirm("Close this save file?")&&n(null)}),[i,n]);return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)(b,{onHome:j}),null===i?Object(o.jsx)(C,{saveData:t,onSelectPlugin:s}):Object(o.jsx)(D,{saveData:t,pluginId:i,onClose:function(){return s(null)},onSubmit:d})]})}var w=function(){var e=Object(c.useState)(null),t=Object(l.a)(e,2),n=t[0],a=t[1];return Object(o.jsx)(o.Fragment,{children:null===n?Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)(b,{onHome:function(){}}),Object(o.jsx)(d,{onSaveLoaded:a})]}):Object(o.jsx)(j.Provider,{value:{saveData:n},children:Object(o.jsx)(B,{saveData:n,onSubmit:a})})})},M=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,19)).then((function(t){var n=t.getCLS,a=t.getFID,c=t.getFCP,r=t.getLCP,i=t.getTTFB;n(e),a(e),c(e),r(e),i(e)}))};s.a.render(Object(o.jsx)(r.a.StrictMode,{children:Object(o.jsx)(w,{})}),document.getElementById("root")),M()}},[[18,1,2]]]);
//# sourceMappingURL=main.dede21af.chunk.js.map