var WEB=!0;(function(){var c,r,s,n,h,l,p,u,t,i,a,e,o,d,f,g,v,m,y,b,w,k,O,_,S,C=[].slice,E=function(t,e){return function(){return t.apply(e,arguments)}},x=[].indexOf||function(t){for(var e=0,n=this.length;e<n;e++)if(e in this&&this[e]===t)return e;return-1};window.sharejs=e={version:"0.6.3"},void 0===WEB&&(window.WEB=!0),g=null!=WEB?function(t){return setTimeout(t,0)}:process.nextTick,(n=function(){function t(){}return t.prototype.on=function(t,e){var n;return this._events||(this._events={}),(n=this._events)[t]||(n[t]=[]),this._events[t].push(e),this},t.prototype.removeListener=function(s,t){var e,n,o,r;for(this._events||(this._events={}),n=(o=this._events)[s]||(o[s]=[]),e=0;e<n.length;)n[e]===t&&(n[e]=void 0),e++;return g((r=this,function(){var i;return r._events[s]=function(){var t,e,n,o;for(o=[],t=0,e=(n=this._events[s]).length;t<e;t++)(i=n[t])&&o.push(i);return o}.call(r)})),this},t.prototype.emit=function(){var t,e,n,o,i,s,r;if(e=arguments[0],t=2<=arguments.length?C.call(arguments,1):[],!(null!=(s=this._events)?s[e]:void 0))return this;for(o=0,i=(r=this._events[e]).length;o<i;o++)(n=r[o])&&n.apply(this,t);return this},t.prototype.once=function(e,n){var o,i;return this.on(e,(i=this,o=function(){var t;return t=1<=arguments.length?C.call(arguments,0):[],i.removeListener(e,o),n.apply(i,t)}))},t}()).mixin=function(t){var e;return(e=t.prototype||t).on=n.prototype.on,e.removeListener=n.prototype.removeListener,e.emit=n.prototype.emit,e.once=n.prototype.once,t},null==WEB&&(module.exports=n),e._bt=t=function(t,r,k,O){var _,S;return _=function(t,e,n,o){return r(n,t,e,"left"),r(o,e,t,"right")},t.transformX=t.transformX=S=function(t,e){var n,o,i,s,r,c,h,l,p,u,a,d,f,g,v,m,y,b,w;for(k(t),k(e),r=[],u=0,g=e.length;u<g;u++){for(p=e[u],s=[],n=0;n<t.length;){if(c=[],_(t[n],p,s,c),n++,1!==c.length){if(0===c.length){for(a=0,v=(b=t.slice(n)).length;a<v;a++)o=b[a],O(s,o);p=null;break}for(i=(w=S(t.slice(n),c))[0],l=w[1],d=0,m=i.length;d<m;d++)o=i[d],O(s,o);for(f=0,y=l.length;f<y;f++)h=l[f],O(r,h);p=null;break}p=c[0]}null!=p&&O(r,p),t=s}return[t,r]},t.transform=t.transform=function(t,e,n){var o,i,s;if("left"!==n&&"right"!==n)throw new Error("type must be 'left' or 'right'");return 0===e.length?t:1===t.length&&1===e.length?r([],t[0],e[0],n):"left"===n?(o=(i=S(t,e))[0],i[1],o):((s=S(e,t))[0],s[1])}},void 0===WEB&&(e.bootstrapTransform=t),m=function(t,e,n){return t.slice(0,e)+n+t.slice(e)},i=function(t){if("number"!=typeof t.p)throw new Error("component missing position field");if(!("string"===typeof t.i^"string"===typeof t.d))throw new Error("component needs an i or d field");if(!(0<=t.p))throw new Error("position cannot be negative")},a=function(t){var e,n,o;for(n=0,o=t.length;n<o;n++)e=t[n],i(e);return!0},(y={name:"text",create:function(){return""}}).apply=function(t,e){var n,o,i,s;for(a(e),i=0,s=e.length;i<s;i++)if(null!=(n=e[i]).i)t=m(t,n.p,n.i);else{if(o=t.slice(n.p,n.p+n.d.length),n.d!==o)throw new Error("Delete component '"+n.d+"' does not match deleted text '"+o+"'");t=t.slice(0,n.p)+t.slice(n.p+n.d.length)}return t},y._append=u=function(t,e){var n,o,i;if(""!==e.i&&""!==e.d)return 0===t.length?t.push(e):null!=(n=t[t.length-1]).i&&null!=e.i&&n.p<=(o=e.p)&&o<=n.p+n.i.length?t[t.length-1]={i:m(n.i,e.p-n.p,e.i),p:n.p}:null!=n.d&&null!=e.d&&e.p<=(i=n.p)&&i<=e.p+e.d.length?t[t.length-1]={d:m(e.d,n.p-e.p,n.d),p:e.p}:t.push(e)},y.compose=function(t,e){var n,o,i,s;for(a(t),a(e),o=t.slice(),i=0,s=e.length;i<s;i++)n=e[i],u(o,n);return o},y.compress=function(t){return y.compose([],t)},y.normalize=function(t){var e,n,o,i;for(n=[],null==t.i&&null==t.p||(t=[t]),o=0,i=t.length;o<i;o++)null==(e=t[o]).p&&(e.p=0),u(n,e);return n},w=function(t,e,n){return null!=e.i?e.p<t||e.p===t&&n?t+e.i.length:t:t<=e.p?t:t<=e.p+e.d.length?e.p:t-e.d.length},y.transformCursor=function(t,e,n){var o,i,s,r;for(i="right"===n,s=0,r=e.length;s<r;s++)o=e[s],t=w(t,o,i);return t},y._tc=b=function(t,e,n,o){var i,s,r,c;if(a([e]),a([n]),null!=e.i)u(t,{i:e.i,p:w(e.p,n,"right"===o)});else if(null!=n.i)c=e.d,e.p<n.p&&(u(t,{d:c.slice(0,n.p-e.p),p:e.p}),c=c.slice(n.p-e.p)),""!==c&&u(t,{d:c,p:e.p+n.i.length});else if(e.p>=n.p+n.d.length)u(t,{d:e.d,p:e.p-n.d.length});else if(e.p+e.d.length<=n.p)u(t,e);else{if(r={d:"",p:e.p},e.p<n.p&&(r.d=e.d.slice(0,n.p-e.p)),e.p+e.d.length>n.p+n.d.length&&(r.d+=e.d.slice(n.p+n.d.length-e.p)),s=Math.max(e.p,n.p),i=Math.min(e.p+e.d.length,n.p+n.d.length),e.d.slice(s-e.p,i-e.p)!==n.d.slice(s-n.p,i-n.p))throw new Error("Delete ops delete different text in the same region of the document");""!==r.d&&(r.p=w(r.p,n),u(t,r))}return t},f=function(t){return null!=t.i?{d:t.i,p:t.p}:{i:t.d,p:t.p}},y.invert=function(t){var e,n,o,i,s;for(s=[],n=0,o=(i=t.slice().reverse()).length;n<o;n++)e=i[n],s.push(f(e));return s},null!=WEB?(e.types||(e.types={}),t(y,b,a,u),e.types.text=y):(module.exports=y,require("./helpers").bootstrapTransform(y,b,a,u)),void 0===WEB&&(y=require("./text")),y.api={provides:{text:!0},getLength:function(){return this.snapshot.length},getText:function(){return this.snapshot},insert:function(t,e,n){var o;return o=[{p:t,i:e}],this.submitOp(o,n),o},del:function(t,e,n){var o;return o=[{p:t,d:this.snapshot.slice(t,t+e)}],this.submitOp(o,n),o},_register:function(){return this.on("remoteop",function(t){var e,n,o,i;for(i=[],n=0,o=t.length;n<o;n++)void 0!==(e=t[n]).i?i.push(this.emit("insert",e.p,e.i)):i.push(this.emit("delete",e.p,e.d));return i})}},null==WEB&&(k=require("../types")),null!=WEB&&(e.extendDoc=function(t,e){return s.prototype[t]=e}),s=function(){function t(t,e,n){this.connection=t,this.name=e,this.shout=E(this.shout,this),this.flush=E(this.flush,this),n||(n={}),this.version=n.v,this.snapshot=n.snaphot,n.type&&this._setType(n.type),this.state="closed",this.autoOpen=!1,this._create=n.create,this.inflightOp=null,this.inflightCallbacks=[],this.inflightSubmittedIds=[],this.pendingOp=null,this.pendingCallbacks=[],this.serverOps={}}return t.prototype._xf=function(t,e){return this.type.transformX?this.type.transformX(t,e):[this.type.transform(t,e,"left"),this.type.transform(e,t,"right")]},t.prototype._otApply=function(t,e){var n;if(n=this.snapshot,this.snapshot=this.type.apply(this.snapshot,t),this.emit("change",t,n),e)return this.emit("remoteop",t,n)},t.prototype._connectionStateChanged=function(t,e){switch(t){case"disconnected":this.state="closed",this.inflightOp&&this.inflightSubmittedIds.push(this.connection.id),this.emit("closed");break;case"ok":this.autoOpen&&this.open();break;case"stopped":"function"==typeof this._openCallback&&this._openCallback(e)}return this.emit(t,e)},t.prototype._setType=function(t){var e,n,o;if(!this.type){if("string"==typeof t&&(t=k[t]),!t||!t.compose)throw new Error("Support for types without compose() is not implemented");if((this.type=t).api){for(e in o=t.api)n=o[e],this[e]=n;return"function"==typeof this._register?this._register():void 0}return this.provides={}}},t.prototype._onMessage=function(t){var e,n,o,i,s,r,c,h,l,p,u,a,d,f,g,v,m,y,b;switch(!1){case!0!==t.open:return this.state="open",this._create=!1,null==this.created&&(this.created=!!t.create),t.type&&this._setType(t.type),t.create?(this.created=!0,this.snapshot=this.type.create()):(!0!==this.created&&(this.created=!1),void 0!==t.snapshot&&(this.snapshot=t.snapshot)),t.meta&&(this.meta=t.meta),null!=t.v&&(this.version=t.v),this.inflightOp?(r={doc:this.name,op:this.inflightOp,v:this.version},this.inflightSubmittedIds.length&&(r.dupIfSource=this.inflightSubmittedIds),this.connection.send(r)):this.flush(),this.emit("open"),"function"==typeof this._openCallback?this._openCallback(null):void 0;case!1!==t.open:return t.error&&("undefined"!=typeof console&&null!==console&&console.error("Could not open document: "+t.error),this.emit("error",t.error),"function"==typeof this._openCallback&&this._openCallback(t.error)),this.state="closed",this.emit("closed"),"function"==typeof this._closeCallback&&this._closeCallback(),this._closeCallback=null;case!(null===t.op&&"Op already submitted"===n):break;case!(void 0===t.op&&void 0!==t.v||t.op&&(d=t.meta.source,0<=x.call(this.inflightSubmittedIds,d))):if(o=this.inflightOp,this.inflightOp=null,this.inflightSubmittedIds.length=0,n=t.error)for(this.type.invert?(c=this.type.invert(o),this.pendingOp&&(f=this._xf(this.pendingOp,c),this.pendingOp=f[0],c=f[1]),this._otApply(c,!0)):this.emit("error","Op apply failed ("+n+") and the op could not be reverted"),l=0,u=(g=this.inflightCallbacks).length;l<u;l++)(0,g[l])(n);else{if(t.v!==this.version)throw new Error("Invalid version from server");for(this.serverOps[this.version]=o,this.version++,this.emit("acknowledge",o),p=0,a=(v=this.inflightCallbacks).length;p<a;p++)(0,v[p])(null,o)}return this.flush();case!t.op:if(t.v<this.version)return;return t.doc!==this.name?this.emit("error","Expected docName '"+this.name+"' but got "+t.doc):t.v!==this.version?this.emit("error","Expected version "+this.version+" but got "+t.v):(i=t.op,e=this.serverOps[this.version]=i,null!==this.inflightOp&&(m=this._xf(this.inflightOp,e),this.inflightOp=m[0],e=m[1]),null!==this.pendingOp&&(y=this._xf(this.pendingOp,e),this.pendingOp=y[0],e=y[1]),this.version++,this._otApply(e,!0));case!t.meta:switch(s=(b=t.meta).path,h=b.value,null!=s?s[0]:void 0){case"shout":return this.emit("shout",h);default:return"undefined"!=typeof console&&null!==console?console.warn("Unhandled meta op:",t):void 0}break;default:return"undefined"!=typeof console&&null!==console?console.warn("Unhandled document message:",t):void 0}},t.prototype.flush=function(){if("ok"===this.connection.state&&null===this.inflightOp&&null!==this.pendingOp)return this.inflightOp=this.pendingOp,this.inflightCallbacks=this.pendingCallbacks,this.pendingOp=null,this.pendingCallbacks=[],this.connection.send({doc:this.name,op:this.inflightOp,v:this.version})},t.prototype.submitOp=function(t,e){return null!=this.type.normalize&&(t=this.type.normalize(t)),this.snapshot=this.type.apply(this.snapshot,t),null!==this.pendingOp?this.pendingOp=this.type.compose(this.pendingOp,t):this.pendingOp=t,e&&this.pendingCallbacks.push(e),this.emit("change",t),setTimeout(this.flush,0)},t.prototype.shout=function(t){return this.connection.send({doc:this.name,meta:{path:["shout"],value:t}})},t.prototype.open=function(e){var t,n;if(this.autoOpen=!0,"closed"===this.state)return t={doc:this.name,open:!0},void 0===this.snapshot&&(t.snapshot=null),this.type&&(t.type=this.type.name),null!=this.version&&(t.v=this.version),this._create&&(t.create=!0),this.connection.send(t),this.state="opening",this._openCallback=(n=this,function(t){return n._openCallback=null,"function"==typeof e?e(t):void 0})},t.prototype.close=function(t){return this.autoOpen=!1,"closed"===this.state?"function"==typeof t?t():void 0:(this.connection.send({doc:this.name,open:!1}),this.state="closed",this.emit("closing"),this._closeCallback=t)},t}(),null==WEB&&(n=require("./microevent")),n.mixin(s),e.Doc=s,h=function(){function t(t,e,o){var i,s,r;null!=e&&"function"==typeof e?(o=e,e=void 0):"function"!=typeof o&&(o=p),this.debug=this.debugAll,this.reconnectInterval=1e3,this.timeoutInterval=2e3,this.forcedClose=!1,this.url=t,this.protocols=e,this.readyState=o.CONNECTING,this.URL=t,s=!1,(i=function(e){var n;return r.ws=new o(r.url),r.debug&&console.debug("ReconnectingWebSocket","attempt-connect",r.url),n=setTimeout(function(){return r.debug&&console.debug("ReconnectingWebSocket","connection-timeout",r.url),s=!0,r.ws.close(),s=!1},r.timeoutInterval),r.ws.onopen=function(t){return clearTimeout(n),r.debug&&console.debug("ReconnectingWebSocket","onopen",r.url),r.readyState=o.OPEN,e=!1,r.onopen(t)},r.ws.onclose=function(t){return clearTimeout(n),r.ws=null,r.forcedClose?(r.readyState=o.CLOSED,r.onclose(t)):(r.readyState=o.CONNECTING,r.onconnecting(t),e||s||(r.debug&&console.debug("ReconnectingWebSocket","onclose",r.url),r.onclose(t)),setTimeout(function(){return i(!0)},r.reconnectInterval))},r.ws.onmessage=function(t){return r.debug&&console.debug("ReconnectingWebSocket","onmessage",r.url,t.data),r.onmessage(t)},r.ws.onerror=function(t){return r.debug&&console.debug("ReconnectingWebSocket","onerror",r.url,t),r.onerror(t)}})((r=this).url)}return t.prototype.onopen=function(t){},t.prototype.onclose=function(t){},t.prototype.onconnecting=function(t){},t.prototype.onmessage=function(t){},t.prototype.onerror=function(t){},t.prototype.send=function(t){if(this.ws)return this.debug&&console.debug("ReconnectingWebSocket","send",this.url,t),this.ws.send(t);throw"INVALID_STATE_ERR : Pausing to reconnect websocket"},t.prototype.close=function(){if(this.ws)return this.forcedClose=!0,this.ws.close()},t.prototype.debugAll=!1,t.prototype.refresh=function(){if(this.ws)return this.ws.close()},t}(),null!=WEB?(k=e.types,c=window.BCSocket,l=window.SockJS,p=window.WebSocket,v=c?"channel":l?"sockjs":"websocket"):(k=require("../types"),c=require("browserchannel").BCSocket,s=require("./doc").Doc,p=require("ws"),v=null),r=function(){function t(t,e){var n,o,i,s,r;this.docs={},this.state="connecting",null==v&&t.match(/^ws:/)&&(v="websocket"),this.socket=function(){switch(v){case"channel":return new c(t,{reconnect:!0});case"sockjs":return new h(t,l);case"websocket":return new h(t);default:return new c(t,{reconnect:!0})}}(),this.socket.onmessage=(n=this,function(t){var e;return"sockjs"!==v&&"websocket"!==v||(t=JSON.parse(t.data)),null===t.auth?(n.lastError=t.error,n.disconnect(),n.emit("connect failed",t.error)):t.auth?(n.id=t.auth,void n.setState("ok")):(void 0!==(e=t.doc)?n.lastReceivedDoc=e:t.doc=e=n.lastReceivedDoc,n.docs[e]?n.docs[e]._onMessage(t):"undefined"!=typeof console&&null!==console?console.error("Unhandled message",t):void 0)}),this.connected=!1,this.socket.onclose=(o=this,function(t){if(o.setState("disconnected",t),"Closed"===t||"Stopped by server"===t)return o.setState("stopped",o.lastError||t)}),this.socket.onerror=(i=this,function(t){return i.emit("error",t)}),this.socket.onopen=(s=this,function(){return s.send({auth:e||null}),s.lastError=s.lastReceivedDoc=s.lastSentDoc=null,s.setState("handshaking")}),this.socket.onconnecting=(r=this,function(){return r.setState("connecting")})}return t.prototype.setState=function(t,e){var n,o,i,s;if(this.state!==t){for(o in"disconnected"===(this.state=t)&&delete this.id,this.emit(t,e),s=[],i=this.docs)n=i[o],s.push(n._connectionStateChanged(t,e));return s}},t.prototype.send=function(t){var e;return t.doc&&((e=t.doc)===this.lastSentDoc?delete t.doc:this.lastSentDoc=e),"sockjs"!==v&&"websocket"!==v||(t=JSON.stringify(t)),this.socket.send(t)},t.prototype.disconnect=function(){return this.socket.close()},t.prototype.makeDoc=function(e,t,n){var o,i;if(this.docs[e])throw new Error("Doc "+e+" already open");return o=new s(this,e,t),(this.docs[e]=o).open((i=this,function(t){return t&&delete i.docs[e],t||o.on("closed",function(){if(!o.autoOpen)return delete i.docs[e]}),n(t,t?void 0:o)}))},t.prototype.openExisting=function(t,e){return"stopped"===this.state?e("connection closed"):this.docs[t]?this._ensureOpenState(this.docs[t],e):this.makeDoc(t,{},e)},t.prototype.open=function(t,e,n){var o;if("stopped"===this.state)return n("connection closed");if("connecting"!==this.state){if("function"==typeof e&&(n=e,e="text"),n||(n=function(){}),"string"==typeof e&&(e=k[e]),!e)throw new Error("OT code for document type missing");if(null==t)throw new Error("Server-generated random doc names are not currently supported");if(!this.docs[t])return this.makeDoc(t,{create:!0,type:e.name},n);(o=this.docs[t]).type===e?this._ensureOpenState(o,n):n("Type mismatch",o)}else this.on("handshaking",function(){return this.open(t,e,n),n=null})},t.prototype._ensureOpenState=function(e,n){switch(e.state){case"open":n(null,e);break;case"opening":this.on("open",function(){return n(null,e)});break;case"closed":e.open(function(t){return n(t,t?void 0:e)})}},t}(),null==WEB&&(n=require("./microevent")),n.mixin(r),e.Connection=r,null!=WEB?(o=void 0!==window.BCSocket,d=void 0!==window.SockJS,v=o?"channel":d?"sockjs":"websocket"):r=require("./connection").Connection,e.open=(O={},_=function(t,e){var n,o,i,s;return null!=WEB&&null==t&&(i=window.location,s="websocket"===v?"ws:":i.protocol,t=s+"//"+i.host+"/"+v),O[t]||(o=function(){return delete O[t]},(n=new r(t,e)).on("disconnected",o),n.on("connect failed",o),O[t]=n),O[t]},S=function(t){var e,n,o,i;for(n in o=0,i=t.docs)("closed"!==(e=i[n]).state||e.autoOpen)&&o++;if(0===o)return t.disconnect()},function(t,e,n,o){var i,s,r;return"function"==typeof n&&(o=n,n={}),"string"==typeof n&&(n={origin:n}),r=n.origin,i=n.authentication,(s=_(r,i)).open(t,e,function(t,e){return t?(o(t),S(s)):(e.on("closed",function(){return S(s)}),o(null,e))}),s.on("connect failed"),s}),null==WEB&&(e.Doc=require("./doc").Doc,e.Connection=require("./connection").Connection)}).call(this);