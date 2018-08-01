var WEB=!0;(function(){var i,A,e,t,n,r,E,a,j,s,o=[].slice;t=window.sharejs,j=t.types.text,r=function(t){return"[object Array]"===Object.prototype.toString.call(t)},(E={name:"json",create:function(){return null},invertComponent:function(t){var e;return e={p:t.p},void 0!==t.si&&(e.sd=t.si),void 0!==t.sd&&(e.si=t.sd),void 0!==t.oi&&(e.od=t.oi),void 0!==t.od&&(e.oi=t.od),void 0!==t.li&&(e.ld=t.li),void 0!==t.ld&&(e.li=t.ld),void 0!==t.na&&(e.na=-t.na),void 0!==t.lm&&(e.lm=t.p[t.p.length-1],e.p=t.p.slice(0,t.p.length-1).concat([t.lm])),e},invert:function(t){var e,i,n,o,r;for(r=[],i=0,n=(o=t.slice().reverse()).length;i<n;i++)e=o[i],r.push(E.invertComponent(e));return r},checkValidOp:function(t){}}).checkList=function(t){if(!r(t))throw new Error("Referenced element not a list")},E.checkObj=function(t){if(t.constructor!==Object)throw new Error("Referenced element not an object (it was "+JSON.stringify(t)+")")},E.apply=function(t,e){var i,n,o,r,p,l,s,d,h,a,c,u,f,v;E.checkValidOp(e),e=A(e),n={data:A(t)};try{for(p=a=0,u=e.length;a<u;p=++a){for(i=e[p],h=d=null,r=n,l="data",v=i.p,c=0,f=v.length;c<f;c++)if(s=v[c],r=(d=r)[h=l],l=s,null==d)throw new Error("Path invalid");if(void 0!==i.na){if("number"!=typeof r[l])throw new Error("Referenced element not a number");r[l]+=i.na}else if(void 0!==i.si){if("string"!=typeof r)throw new Error("Referenced element not a string (it was "+JSON.stringify(r)+")");d[h]=r.slice(0,l)+i.si+r.slice(l)}else if(void 0!==i.sd){if("string"!=typeof r)throw new Error("Referenced element not a string");if(r.slice(l,l+i.sd.length)!==i.sd)throw new Error("Deleted string does not match");d[h]=r.slice(0,l)+r.slice(l+i.sd.length)}else if(void 0!==i.li&&void 0!==i.ld)E.checkList(r),r[l]=i.li;else if(void 0!==i.li)E.checkList(r),r.splice(l,0,i.li);else if(void 0!==i.ld)E.checkList(r),r.splice(l,1);else if(void 0!==i.lm)E.checkList(r),i.lm!==l&&(o=r[l],r.splice(l,1),r.splice(i.lm,0,o));else if(void 0!==i.oi)E.checkObj(r),r[l]=i.oi;else{if(void 0===i.od)throw new Error("invalid / missing instruction in op");E.checkObj(r),delete r[l]}}}catch(t){throw t}return n.data},E.pathMatches=function(t,e,i){var n,o,r;if(t.length!==e.length)return!1;for(n=o=0,r=t.length;o<r;n=++o)if(t[n]!==e[n]&&(!i||n!==t.length-1))return!1;return!0},E.append=function(t,e){var i;return e=A(e),0!==t.length&&E.pathMatches(e.p,(i=t[t.length-1]).p)?void 0!==i.na&&void 0!==e.na?t[t.length-1]={p:i.p,na:i.na+e.na}:void 0!==i.li&&void 0===e.li&&e.ld===i.li?void 0!==i.ld?delete i.li:t.pop():void 0!==i.od&&void 0===i.oi&&void 0!==e.oi&&void 0===e.od?i.oi=e.oi:void 0!==e.lm&&e.p[e.p.length-1]===e.lm?null:t.push(e):t.push(e)},E.compose=function(t,e){var i,n,o,r;for(E.checkValidOp(t),E.checkValidOp(e),n=A(t),o=0,r=e.length;o<r;o++)i=e[o],E.append(n,i);return n},E.normalize=function(t){var e,i,n,o;for(i=[],r(t)||(t=[t]),n=0,o=t.length;n<o;n++)null==(e=t[n]).p&&(e.p=[]),E.append(i,e);return i},A=function(t){return JSON.parse(JSON.stringify(t))},E.canOpAffectOp=function(t,e){var i,n,o,r;if(0===t.length)return!0;if(0===e.length)return!1;for(e=e.slice(0,e.length-1),i=o=0,r=(t=t.slice(0,t.length-1)).length;o<r;i=++o){if(n=t[i],i>=e.length)return!1;if(n!==e[i])return!1}return!0},E.transformComponent=function(t,e,i,n){var o,r,p,l,s,d,h,a,c,u,f,v,g,m,y,w,b,O,k;if(void 0!==(e=A(e)).na&&e.p.push(0),void 0!==i.na&&i.p.push(0),E.canOpAffectOp(i.p,e.p)&&(o=i.p.length-1),E.canOpAffectOp(e.p,i.p)&&(r=e.p.length-1),s=e.p.length,c=i.p.length,void 0!==e.na&&e.p.pop(),void 0!==i.na&&i.p.pop(),i.na)return null!=r&&s<=c&&i.p[r]===e.p[r]&&(void 0!==e.ld?((a=A(i)).p=a.p.slice(s),e.ld=E.apply(A(e.ld),[a])):void 0!==e.od&&((a=A(i)).p=a.p.slice(s),e.od=E.apply(A(e.od),[a]))),E.append(t,e),t;if(null!=r&&s<c&&e.p[r]===i.p[r]&&(void 0!==e.ld?((a=A(i)).p=a.p.slice(s),e.ld=E.apply(A(e.ld),[a])):void 0!==e.od&&((a=A(i)).p=a.p.slice(s),e.od=E.apply(A(e.od),[a]))),null!=o)if(p=s===c,void 0!==i.na);else if(void 0!==i.si||void 0!==i.sd){if(void 0!==e.si||void 0!==e.sd){if(!p)throw new Error("must be a string?");for(y=(l=function(t){var e;return e={p:t.p[t.p.length-1]},null!=t.si?e.i=t.si:e.d=t.sd,e})(e),w=l(i),g=[],j._tc(g,y,w,n),O=0,k=g.length;O<k;O++)m=g[O],(h={p:e.p.slice(0,o)}).p.push(m.p),null!=m.i&&(h.si=m.i),null!=m.d&&(h.sd=m.d),E.append(t,h);return t}}else if(void 0!==i.li&&void 0!==i.ld){if(i.p[o]===e.p[o]){if(!p)return t;if(void 0!==e.ld){if(void 0===e.li||"left"!==n)return t;e.ld=A(i.li)}}}else if(void 0!==i.li)void 0!==e.li&&void 0===e.ld&&p&&e.p[o]===i.p[o]?"right"===n&&e.p[o]++:i.p[o]<=e.p[o]&&e.p[o]++,void 0!==e.lm&&p&&i.p[o]<=e.lm&&e.lm++;else if(void 0!==i.ld){if(void 0!==e.lm&&p){if(i.p[o]===e.p[o])return t;v=i.p[o],d=e.p[o],(v<(b=e.lm)||v===b&&d<b)&&e.lm--}if(i.p[o]<e.p[o])e.p[o]--;else if(i.p[o]===e.p[o]){if(c<s)return t;if(void 0!==e.ld){if(void 0===e.li)return t;delete e.ld}}}else if(void 0!==i.lm)if(void 0!==e.lm&&s===c){if(d=e.p[o],b=e.lm,(u=i.p[o])!==(f=i.lm))if(d===u){if("left"!==n)return t;e.p[o]=f,d===b&&(e.lm=f)}else u<d&&e.p[o]--,f<d?e.p[o]++:d===f&&f<u&&(e.p[o]++,d===b&&e.lm++),u<b?e.lm--:b===u&&d<b&&e.lm--,f<b?e.lm++:b===f&&(u<f&&d<b||f<u&&b<d?"right"===n&&e.lm++:d<b?e.lm++:b===u&&e.lm--)}else void 0!==e.li&&void 0===e.ld&&p?(d=i.p[o],b=i.lm,d<(v=e.p[o])&&e.p[o]--,b<v&&e.p[o]++):(d=i.p[o],b=i.lm,(v=e.p[o])===d?e.p[o]=b:(d<v&&e.p[o]--,b<v?e.p[o]++:v===b&&b<d&&e.p[o]++));else if(void 0!==i.oi&&void 0!==i.od){if(e.p[o]===i.p[o]){if(void 0===e.oi||!p)return t;if("right"===n)return t;e.od=i.oi}}else if(void 0!==i.oi){if(void 0!==e.oi&&e.p[o]===i.p[o]){if("left"!==n)return t;E.append(t,{p:e.p,od:i.oi})}}else if(void 0!==i.od&&e.p[o]===i.p[o]){if(!p)return t;if(void 0===e.oi)return t;delete e.od}return E.append(t,e),t},t.types||(t.types={}),t._bt(E,E.transformComponent,E.checkValidOp,E.append),t.types.json=E,n=t.extendDoc,t.extendDoc=function(t,e){return i.prototype[t]=e,n(t,e)},e=function(t){return 1===t.length&&t[0].constructor===Array?t[0]:t},i=function(){function t(t,e){this.doc=t,this.path=e}return t.prototype.at=function(){var t;return t=1<=arguments.length?o.call(arguments,0):[],this.doc.at(this.path.concat(e(t)))},t.prototype.parent=function(){return this.path.length?this.doc.at(this.path.slice(0,this.path.length-1)):void 0},t.prototype.get=function(){return this.doc.getAt(this.path)},t.prototype.set=function(t,e){return this.doc.setAt(this.path,t,e)},t.prototype.insert=function(t,e,i){return this.doc.insertAt(this.path,t,e,i)},t.prototype.del=function(t,e,i){return this.doc.deleteTextAt(this.path,e,t,i)},t.prototype.remove=function(t){return this.doc.removeAt(this.path,t)},t.prototype.push=function(t,e){return this.insert(this.get().length,t,e)},t.prototype.move=function(t,e,i){return this.doc.moveAt(this.path,t,e,i)},t.prototype.add=function(t,e){return this.doc.addAt(this.path,t,e)},t.prototype.on=function(t,e){return this.doc.addListener(this.path,t,e)},t.prototype.removeListener=function(t){return this.doc.removeListener(t)},t.prototype.getLength=function(){return this.get().length},t.prototype.getText=function(){return this.get()},t}(),s=function(t,e){var i,n,o,r,p;for(n="data",i={data:t},r=0,p=e.length;r<p;r++)if(o=e[r],i=i[n],n=o,void 0===i)throw new Error("bad path");return{elem:i,key:n}},a=function(t,e){var i,n,o;if(t.length!==e.length)return!1;for(i=n=0,o=t.length;n<o;i=++n)if(t[i]!==e[i])return!1;return!0},E.api={provides:{json:!0},at:function(){var t;return t=1<=arguments.length?o.call(arguments,0):[],new i(this,e(t))},get:function(){return this.snapshot},set:function(t,e){return this.setAt([],t,e)},getAt:function(t){var e;return(e=s(this.snapshot,t)).elem[e.key]},setAt:function(t,e,i){var n,o,r,p;if(n=(p=s(this.snapshot,t)).elem,o=p.key,r={p:t},n.constructor===Array)r.li=e,void 0!==n[o]&&(r.ld=n[o]);else{if("object"!=typeof n)throw new Error("bad path");r.oi=e,void 0!==n[o]&&(r.od=n[o])}return this.submitOp([r],i)},removeAt:function(t,e){var i,n,o,r;if(void 0===(i=(r=s(this.snapshot,t)).elem)[n=r.key])throw new Error("no element at that path");if(o={p:t},i.constructor===Array)o.ld=i[n];else{if("object"!=typeof i)throw new Error("bad path");o.od=i[n]}return this.submitOp([o],e)},insertAt:function(t,e,i,n){var o,r,p,l;return o=(l=s(this.snapshot,t)).elem,r=l.key,p={p:t.concat(e)},o[r].constructor===Array?p.li=i:"string"==typeof o[r]&&(p.si=i),this.submitOp([p],n)},moveAt:function(t,e,i,n){var o;return o=[{p:t.concat(e),lm:i}],this.submitOp(o,n)},addAt:function(t,e,i){var n;return n=[{p:t,na:e}],this.submitOp(n,i)},deleteTextAt:function(t,e,i,n){var o,r,p,l;return o=(l=s(this.snapshot,t)).elem,r=l.key,p=[{p:t.concat(i),sd:o[r].slice(i,i+e)}],this.submitOp(p,n)},addListener:function(t,e,i){var n;return n={path:t,event:e,cb:i},this._listeners.push(n),n},removeListener:function(t){var e;return!((e=this._listeners.indexOf(t))<0)&&(this._listeners.splice(e,1),!0)},_register:function(){return this._listeners=[],this.on("change",function(t){var e,i,n,o,r,p,l,s,d,h,a,c;for(c=[],l=0,d=t.length;l<d;l++)if(void 0===(e=t[l]).na&&void 0===e.si&&void 0===e.sd){for(r=[],a=this._listeners,n=s=0,h=a.length;s<h;n=++s)if(i={p:(o=a[n]).path,na:0},0===(p=this.type.transformComponent([],i,e,"left")).length)r.push(n);else{if(1!==p.length)throw new Error("Bad assumption in json-api: xforming an 'si' op will always result in 0 or 1 components.");o.path=p[0].p}r.sort(function(t,e){return e-t}),c.push(function(){var t,e,i;for(i=[],t=0,e=r.length;t<e;t++)n=r[t],i.push(this._listeners.splice(n,1));return i}.call(this))}return c}),this.on("remoteop",function(t){var r,p,l,s,d,h,e,i,n;for(n=[],e=0,i=t.length;e<i;e++)r=t[e],d=void 0===r.na?r.p.slice(0,r.p.length-1):r.p,n.push(function(){var t,e,i,n,o;for(o=[],t=0,e=(i=this._listeners).length;t<e;t++)if(n=i[t],h=n.path,s=n.event,p=n.cb,a(h,d))switch(s){case"insert":void 0!==r.li&&void 0===r.ld?o.push(p(r.p[r.p.length-1],r.li)):void 0!==r.oi&&void 0===r.od?o.push(p(r.p[r.p.length-1],r.oi)):void 0!==r.si?o.push(p(r.p[r.p.length-1],r.si)):o.push(void 0);break;case"delete":void 0===r.li&&void 0!==r.ld?o.push(p(r.p[r.p.length-1],r.ld)):void 0===r.oi&&void 0!==r.od?o.push(p(r.p[r.p.length-1],r.od)):void 0!==r.sd?o.push(p(r.p[r.p.length-1],r.sd)):o.push(void 0);break;case"replace":void 0!==r.li&&void 0!==r.ld?o.push(p(r.p[r.p.length-1],r.ld,r.li)):void 0!==r.oi&&void 0!==r.od?o.push(p(r.p[r.p.length-1],r.od,r.oi)):o.push(void 0);break;case"move":void 0!==r.lm?o.push(p(r.p[r.p.length-1],r.lm)):o.push(void 0);break;case"add":void 0!==r.na?o.push(p(r.na)):o.push(void 0);break;default:o.push(void 0)}else this.type.canOpAffectOp(h,d)&&"child op"===s?(l=r.p.slice(h.length),o.push(p(l,r))):o.push(void 0);return o}.call(this));return n})}}}).call(this);