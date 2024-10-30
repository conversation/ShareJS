!function(){var i,y,e,t,n,r,w,h,O,p,o;function l(t,e){this.doc=t,this.path=e}o=[].slice,t=window.sharejs,O=t.types.text,r=function(t){return"[object Array]"===Object.prototype.toString.call(t)},y=function(t){return JSON.parse(JSON.stringify(t))},w={name:"json",create:function(){return null},invertComponent:function(t){var e={p:t.p};return void 0!==t.si&&(e.sd=t.si),void 0!==t.sd&&(e.si=t.sd),void 0!==t.oi&&(e.od=t.oi),void 0!==t.od&&(e.oi=t.od),void 0!==t.li&&(e.ld=t.li),void 0!==t.ld&&(e.li=t.ld),void 0!==t.na&&(e.na=-t.na),void 0!==t.lm&&(e.lm=t.p[t.p.length-1],e.p=t.p.slice(0,t.p.length-1).concat([t.lm])),e},invert:function(t){for(var e,i=t.slice().reverse(),n=[],o=0,r=i.length;o<r;o++)e=i[o],n.push(w.invertComponent(e));return n},checkValidOp:function(t){},checkList:function(t){if(!r(t))throw new Error("Referenced element not a list")},checkObj:function(t){if(t.constructor!==Object)throw new Error("Referenced element not an object (it was "+JSON.stringify(t)+")")},apply:function(t,e){var i,n,o,r,p,l,s,d,h,c,u,a,f,v,g;w.checkValidOp(e),e=y(e),n={data:y(t)};try{for(l=u=0,f=e.length;u<f;l=++u){for(i=e[l],c=h=null,p=n,s="data",g=i.p,a=0,v=g.length;a<v;a++)if(d=g[a],p=(h=p)[c=s],s=d,null==h)throw new Error("Path invalid");if(void 0!==i.na){if("number"!=typeof p[s])throw new Error("Referenced element not a number");p[s]+=i.na}else if(void 0!==i.si){if("string"!=typeof p)throw new Error("Referenced element not a string (it was "+JSON.stringify(p)+")");h[c]=p.slice(0,s)+i.si+p.slice(s)}else if(void 0!==i.sd){if("string"!=typeof p)throw new Error("Referenced element not a string");if(o="1: "+JSON.stringify(p.slice(s,s+i.sd.length))+" 2: "+JSON.stringify(i.sd),p.slice(s,s+i.sd.length)!==i.sd)throw new Error("Deleted string does not match ("+o+")");h[c]=p.slice(0,s)+p.slice(s+i.sd.length)}else if(void 0!==i.li&&void 0!==i.ld)w.checkList(p),p[s]=i.li;else if(void 0!==i.li)w.checkList(p),p.splice(s,0,i.li);else if(void 0!==i.ld)w.checkList(p),p.splice(s,1);else if(void 0!==i.lm)w.checkList(p),i.lm!==s&&(r=p[s],p.splice(s,1),p.splice(i.lm,0,r));else if(void 0!==i.oi)w.checkObj(p),p[s]=i.oi;else{if(void 0===i.od)throw new Error("invalid / missing instruction in op");w.checkObj(p),delete p[s]}}}catch(t){throw t}return n.data},pathMatches:function(t,e,i){var n,o,r;if(t.length!==e.length)return!1;for(n=o=0,r=t.length;o<r;n=++o)if(t[n]!==e[n]&&(!i||n!==t.length-1))return!1;return!0},append:function(t,e){var i;return e=y(e),0!==t.length&&w.pathMatches(e.p,(i=t[t.length-1]).p)?void 0!==i.na&&void 0!==e.na?t[t.length-1]={p:i.p,na:i.na+e.na}:void 0!==i.li&&void 0===e.li&&e.ld===i.li?void 0!==i.ld?delete i.li:t.pop():void 0!==i.od&&void 0===i.oi&&void 0!==e.oi&&void 0===e.od?i.oi=e.oi:void 0!==e.lm&&e.p[e.p.length-1]===e.lm?null:t.push(e):t.push(e)},compose:function(t,e){var i,n,o,r;for(w.checkValidOp(t),w.checkValidOp(e),n=y(t),o=0,r=e.length;o<r;o++)i=e[o],w.append(n,i);return n},normalize:function(t){for(var e,i=[],n=0,o=(t=r(t)?t:[t]).length;n<o;n++)null==(e=t[n]).p&&(e.p=[]),w.append(i,e);return i},canOpAffectOp:function(t,e){var i,n,o,r;if(0!==t.length){if(0===e.length)return!1;for(e=e.slice(0,e.length-1),i=o=0,r=(t=t.slice(0,t.length-1)).length;o<r;i=++o){if(n=t[i],i>=e.length)return!1;if(n!==e[i])return!1}}return!0},transformComponent:function(t,e,i,n){var o,r,p,l,s,d,h,c,u,a,f,v,g,m;if(void 0!==(e=y(e)).na&&e.p.push(0),void 0!==i.na&&i.p.push(0),w.canOpAffectOp(i.p,e.p)&&(o=i.p.length-1),w.canOpAffectOp(e.p,i.p)&&(f=e.p.length-1),p=e.p.length,d=i.p.length,void 0!==e.na&&e.p.pop(),void 0!==i.na&&i.p.pop(),i.na)null!=f&&p<=d&&i.p[f]===e.p[f]&&(void 0!==e.ld?((a=y(i)).p=a.p.slice(p),e.ld=w.apply(y(e.ld),[a])):void 0!==e.od&&((a=y(i)).p=a.p.slice(p),e.od=w.apply(y(e.od),[a])));else if(null!=f&&p<d&&e.p[f]===i.p[f]&&(void 0!==e.ld?((a=y(i)).p=a.p.slice(p),e.ld=w.apply(y(e.ld),[a])):void 0!==e.od&&((a=y(i)).p=a.p.slice(p),e.od=w.apply(y(e.od),[a]))),null!=o&&(r=p===d,void 0===i.na))if(void 0!==i.si||void 0!==i.sd){if(void 0!==e.si||void 0!==e.sd){if(!r)throw new Error("must be a string?");for(a=(f=function(t){var e={p:t.p[t.p.length-1]};return null!=t.si?e.i=t.si:e.d=t.sd,e})(e),f=f(i),O._tc(c=[],a,f,n),g=0,m=c.length;g<m;g++)u=c[g],(s={p:e.p.slice(0,o)}).p.push(u.p),null!=u.i&&(s.si=u.i),null!=u.d&&(s.sd=u.d),w.append(t,s);return t}}else if(void 0!==i.li&&void 0!==i.ld){if(i.p[o]===e.p[o]){if(!r)return t;if(void 0!==e.ld){if(void 0===e.li||"left"!==n)return t;e.ld=y(i.li)}}}else if(void 0!==i.li)void 0!==e.li&&void 0===e.ld&&r&&e.p[o]===i.p[o]?"right"===n&&e.p[o]++:i.p[o]<=e.p[o]&&e.p[o]++,void 0!==e.lm&&r&&i.p[o]<=e.lm&&e.lm++;else if(void 0!==i.ld){if(void 0!==e.lm&&r){if(i.p[o]===e.p[o])return t;h=i.p[o],l=e.p[o],(h<(v=e.lm)||h===v&&l<v)&&e.lm--}if(i.p[o]<e.p[o])e.p[o]--;else if(i.p[o]===e.p[o]){if(d<p)return t;if(void 0!==e.ld){if(void 0===e.li)return t;delete e.ld}}}else if(void 0!==i.lm)if(void 0!==e.lm&&p===d){if(l=e.p[o],v=e.lm,(a=i.p[o])!==(f=i.lm))if(l===a){if("left"!==n)return t;e.p[o]=f,l===v&&(e.lm=f)}else a<l&&e.p[o]--,f<l?e.p[o]++:l===f&&f<a&&(e.p[o]++,l===v)&&e.lm++,(a<v||v===a&&l<v)&&e.lm--,f<v?e.lm++:v===f&&(a<f&&l<v||f<a&&v<l?"right"===n&&e.lm++:l<v?e.lm++:v===a&&e.lm--)}else void 0!==e.li&&void 0===e.ld&&r?(l=i.p[o],v=i.lm,l<(h=e.p[o])&&e.p[o]--,v<h&&e.p[o]++):(l=i.p[o],v=i.lm,(h=e.p[o])===l?e.p[o]=v:(l<h&&e.p[o]--,(v<h||h===v&&v<l)&&e.p[o]++));else if(void 0!==i.oi&&void 0!==i.od){if(e.p[o]===i.p[o]){if(void 0===e.oi||!r)return t;if("right"===n)return t;e.od=i.oi}}else if(void 0!==i.oi){if(void 0!==e.oi&&e.p[o]===i.p[o]){if("left"!==n)return t;w.append(t,{p:e.p,od:i.oi})}}else if(void 0!==i.od&&e.p[o]===i.p[o]){if(!r)return t;if(void 0===e.oi)return t;delete e.od}return w.append(t,e),t}},t.types||(t.types={}),t._bt(w,w.transformComponent,w.checkValidOp,w.append),t.types.json=w,n=t.extendDoc,t.extendDoc=function(t,e){return i.prototype[t]=e,n(t,e)},e=function(t){return 1===t.length&&t[0].constructor===Array?t[0]:t},l.prototype.at=function(){var t=1<=arguments.length?o.call(arguments,0):[];return this.doc.at(this.path.concat(e(t)))},l.prototype.parent=function(){if(this.path.length)return this.doc.at(this.path.slice(0,this.path.length-1))},l.prototype.get=function(){return this.doc.getAt(this.path)},l.prototype.set=function(t,e){return this.doc.setAt(this.path,t,e)},l.prototype.insert=function(t,e,i){return this.doc.insertAt(this.path,t,e,i)},l.prototype.del=function(t,e,i){return this.doc.deleteTextAt(this.path,e,t,i)},l.prototype.remove=function(t){return this.doc.removeAt(this.path,t)},l.prototype.push=function(t,e){return this.insert(this.get().length,t,e)},l.prototype.move=function(t,e,i){return this.doc.moveAt(this.path,t,e,i)},l.prototype.add=function(t,e){return this.doc.addAt(this.path,t,e)},l.prototype.on=function(t,e){return this.doc.addListener(this.path,t,e)},l.prototype.removeListener=function(t){return this.doc.removeListener(t)},l.prototype.getLength=function(){return this.get().length},l.prototype.getText=function(){return this.get()},i=l,p=function(t,e){for(var i,n="data",o={data:t},r=0,p=e.length;r<p;r++)if(i=e[r],o=o[n],n=i,void 0===o)throw new Error("bad path");return{elem:o,key:n}},h=function(t,e){var i,n,o;if(t.length!==e.length)return!1;for(i=n=0,o=t.length;n<o;i=++n)if(t[i]!==e[i])return!1;return!0},w.api={provides:{json:!0},at:function(){var t=1<=arguments.length?o.call(arguments,0):[];return new i(this,e(t))},get:function(){return this.snapshot},set:function(t,e){return this.setAt([],t,e)},getAt:function(t){t=p(this.snapshot,t);return t.elem[t.key]},setAt:function(t,e,i){var n=p(this.snapshot,t),o=n.elem,n=n.key,t={p:t};if(o.constructor===Array)t.li=e,void 0!==o[n]&&(t.ld=o[n]);else{if("object"!=typeof o)throw new Error("bad path");t.oi=e,void 0!==o[n]&&(t.od=o[n])}return this.submitOp([t],i)},removeAt:function(t,e){var i=p(this.snapshot,t),n=i.elem,i=i.key;if(void 0===n[i])throw new Error("no element at that path");if(t={p:t},n.constructor===Array)t.ld=n[i];else{if("object"!=typeof n)throw new Error("bad path");t.od=n[i]}return this.submitOp([t],e)},insertAt:function(t,e,i,n){var o=p(this.snapshot,t),r=o.elem,o=o.key,t={p:t.concat(e)};return r[o].constructor===Array?t.li=i:"string"==typeof r[o]&&(t.si=i),this.submitOp([t],n)},moveAt:function(t,e,i,n){t=[{p:t.concat(e),lm:i}];return this.submitOp(t,n)},addAt:function(t,e,i){return this.submitOp([{p:t,na:e}],i)},deleteTextAt:function(t,e,i,n){var o=p(this.snapshot,t),r=o.elem,o=o.key,t=[{p:t.concat(i),sd:r[o].slice(i,i+e)}];return this.submitOp(t,n)},addListener:function(t,e,i){t={path:t,event:e,cb:i};return this._listeners.push(t),t},removeListener:function(t){t=this._listeners.indexOf(t);return!(t<0||(this._listeners.splice(t,1),0))},_register:function(){return this._listeners=[],this.on("change",function(t){for(var e,n,i,o,r,p,l,s,d=[],h=0,c=t.length;h<c;h++)if(void 0===(e=t[h]).na&&void 0===e.si&&void 0===e.sd){for(o=[],s=this._listeners,n=p=0,l=s.length;p<l;n=++p)if(r={p:(i=s[n]).path,na:0},0===(r=this.type.transformComponent([],r,e,"left")).length)o.push(n);else{if(1!==r.length)throw new Error("Bad assumption in json-api: xforming an 'si' op will always result in 0 or 1 components.");i.path=r[0].p}o.sort(function(t,e){return e-t}),d.push(function(){for(var t=[],e=0,i=o.length;e<i;e++)n=o[e],t.push(this._listeners.splice(n,1));return t}.call(this))}return d}),this.on("remoteop",function(t){for(var r,p,l,s,d,e=[],i=0,n=t.length;i<n;i++)r=t[i],s=void 0===r.na?r.p.slice(0,r.p.length-1):r.p,e.push(function(){for(var t,e=this._listeners,i=[],n=0,o=e.length;n<o;n++)if(t=e[n],d=t.path,l=t.event,p=t.cb,h(d,s))switch(l){case"insert":void 0!==r.li&&void 0===r.ld?i.push(p(r.p[r.p.length-1],r.li)):void 0!==r.oi&&void 0===r.od?i.push(p(r.p[r.p.length-1],r.oi)):void 0!==r.si?i.push(p(r.p[r.p.length-1],r.si)):i.push(void 0);break;case"delete":void 0===r.li&&void 0!==r.ld?i.push(p(r.p[r.p.length-1],r.ld)):void 0===r.oi&&void 0!==r.od?i.push(p(r.p[r.p.length-1],r.od)):void 0!==r.sd?i.push(p(r.p[r.p.length-1],r.sd)):i.push(void 0);break;case"replace":void 0!==r.li&&void 0!==r.ld?i.push(p(r.p[r.p.length-1],r.ld,r.li)):void 0!==r.oi&&void 0!==r.od?i.push(p(r.p[r.p.length-1],r.od,r.oi)):i.push(void 0);break;case"move":void 0!==r.lm?i.push(p(r.p[r.p.length-1],r.lm)):i.push(void 0);break;case"add":void 0!==r.na?i.push(p(r.na)):i.push(void 0);break;default:i.push(void 0)}else this.type.canOpAffectOp(d,s)&&"child op"===l?(l=r.p.slice(d.length),i.push(p(l,r))):i.push(void 0);return i}.call(this));return e})}}}.call(this);