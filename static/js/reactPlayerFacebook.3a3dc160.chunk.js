(self.webpackChunkwebapp=self.webpackChunkwebapp||[]).push([[121],{74793:function(e,t,n){var r,a=n(42122).default,l=n(56690).default,o=n(89728).default,u=n(66115).default,i=n(61655).default,s=n(26389).default,c=n(74704).default,p=Object.create,f=Object.defineProperty,y=Object.getOwnPropertyDescriptor,d=Object.getOwnPropertyNames,b=Object.getPrototypeOf,v=Object.prototype.hasOwnProperty,h=function(e,t,n,r){if(t&&"object"===typeof t||"function"===typeof t){var a,l=c(d(t));try{var o=function(){var l=a.value;v.call(e,l)||l===n||f(e,l,{get:function(){return t[l]},enumerable:!(r=y(t,l))||r.enumerable})};for(l.s();!(a=l.n()).done;)o()}catch(u){l.e(u)}finally{l.f()}}return e},m=function(e,t,n){return function(e,t,n){t in e?f(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n}(e,"symbol"!==typeof t?t+"":t,n),n},g={};!function(e,t){for(var n in t)f(e,n,{get:t[n],enumerable:!0})}(g,{default:function(){return I}}),e.exports=(r=g,h(f({},"__esModule",{value:!0}),r));var P=function(e,t,n){return n=null!=e?p(b(e)):{},h(!t&&e&&e.__esModule?n:f(n,"default",{value:e,enumerable:!0}),e)}(n(72791)),k=n(135),O=n(60365),w="https://connect.facebook.net/en_US/sdk.js",D="fbAsyncInit",I=function(e){"use strict";i(n,e);var t=s(n);function n(){var e;return l(this,n),e=t.apply(this,arguments),m(u(e),"callPlayer",k.callPlayer),m(u(e),"playerID",e.props.config.playerId||"".concat("facebook-player-").concat((0,k.randomString)())),m(u(e),"mute",(function(){e.callPlayer("mute")})),m(u(e),"unmute",(function(){e.callPlayer("unmute")})),e}return o(n,[{key:"componentDidMount",value:function(){this.props.onMount&&this.props.onMount(this)}},{key:"load",value:function(e,t){var n=this;t?(0,k.getSDK)(w,"FB",D).then((function(e){return e.XFBML.parse()})):(0,k.getSDK)(w,"FB",D).then((function(e){e.init({appId:n.props.config.appId,xfbml:!0,version:n.props.config.version}),e.Event.subscribe("xfbml.render",(function(e){n.props.onLoaded()})),e.Event.subscribe("xfbml.ready",(function(e){"video"===e.type&&e.id===n.playerID&&(n.player=e.instance,n.player.subscribe("startedPlaying",n.props.onPlay),n.player.subscribe("paused",n.props.onPause),n.player.subscribe("finishedPlaying",n.props.onEnded),n.player.subscribe("startedBuffering",n.props.onBuffer),n.player.subscribe("finishedBuffering",n.props.onBufferEnd),n.player.subscribe("error",n.props.onError),n.props.muted?n.callPlayer("mute"):n.callPlayer("unmute"),n.props.onReady(),document.getElementById(n.playerID).querySelector("iframe").style.visibility="visible")}))}))}},{key:"play",value:function(){this.callPlayer("play")}},{key:"pause",value:function(){this.callPlayer("pause")}},{key:"stop",value:function(){}},{key:"seekTo",value:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];this.callPlayer("seek",e),t||this.pause()}},{key:"setVolume",value:function(e){this.callPlayer("setVolume",e)}},{key:"getDuration",value:function(){return this.callPlayer("getDuration")}},{key:"getCurrentTime",value:function(){return this.callPlayer("getCurrentPosition")}},{key:"getSecondsLoaded",value:function(){return null}},{key:"render",value:function(){var e=this.props.config.attributes;return P.default.createElement("div",a({style:{width:"100%",height:"100%"},id:this.playerID,className:"fb-video","data-href":this.props.url,"data-autoplay":this.props.playing?"true":"false","data-allowfullscreen":"true","data-controls":this.props.controls?"true":"false"},e))}}]),n}(P.Component);m(I,"displayName","Facebook"),m(I,"canPlay",O.canPlay.facebook),m(I,"loopOnEnded",!0)}}]);
//# sourceMappingURL=reactPlayerFacebook.3a3dc160.chunk.js.map