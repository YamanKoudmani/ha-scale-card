function t(t,e,i,n){var o,s=arguments.length,r=s<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(s<3?o(r):s>3?o(e,i,r):o(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),o=new WeakMap;let s=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const r=t=>new s("string"==typeof t?t:t+"",void 0,n),a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new s(i,t,n)},c=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return r(e)})(t):t,{is:l,defineProperty:h,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:m}=Object,f=globalThis,g=f.trustedTypes,_=g?g.emptyScript:"",y=f.reactiveElementPolyfillSupport,b=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!l(t,e),w={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&h(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:n,set(e){const s=n?.call(this);o?.call(this,e),this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=m(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...p(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(c(t))}else void 0!==t&&e.push(c(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,n)=>{if(i)t.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of n){const n=document.createElement("style"),o=e.litNonce;void 0!==o&&n.setAttribute("nonce",o),n.textContent=i.cssText,t.appendChild(n)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=n;const s=o.fromAttribute(e,t.type);this[n]=s??this._$Ej?.get(n)??s,this._$Em=null}}requestUpdate(t,e,i,n=!1,o){if(void 0!==t){const s=this.constructor;if(!1===n&&(o=this[t]),i??=s.getPropertyOptions(t),!((i.hasChanged??$)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:o},s){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==o||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===n&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,n=this[e];!0!==t||this._$AL.has(e)||void 0===n||this.C(e,void 0,i,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,y?.({ReactiveElement:x}),(f.reactiveElementVersions??=[]).push("2.1.2");const A=globalThis,E=t=>t,S=A.trustedTypes,C=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,k="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+P,U=`<${M}>`,H=document,O=()=>H.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,N="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,j=/>/g,B=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,L=/"/g,F=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),V=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),K=new WeakMap,G=H.createTreeWalker(H,129);function J(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,n=[];let o,s=2===e?"<svg>":3===e?"<math>":"",r=D;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,h=0;for(;h<i.length&&(r.lastIndex=h,c=r.exec(i),null!==c);)h=r.lastIndex,r===D?"!--"===c[1]?r=z:void 0!==c[1]?r=j:void 0!==c[2]?(F.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=B):void 0!==c[3]&&(r=B):r===B?">"===c[0]?(r=o??D,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?B:'"'===c[3]?L:I):r===L||r===I?r=B:r===z||r===j?r=D:(r=B,o=void 0);const d=r===B&&t[e+1].startsWith("/>")?" ":"";s+=r===D?i+U:l>=0?(n.push(a),i.slice(0,l)+k+i.slice(l)+P+d):i+P+(-2===l?e:d)}return[J(t,s+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class Z{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let o=0,s=0;const r=t.length-1,a=this.parts,[c,l]=Y(t,e);if(this.el=Z.createElement(c,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=G.nextNode())&&a.length<r;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(k)){const e=l[s++],i=n.getAttribute(t).split(P),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?it:"?"===r[1]?nt:"@"===r[1]?ot:et}),n.removeAttribute(t)}else t.startsWith(P)&&(a.push({type:6,index:o}),n.removeAttribute(t));if(F.test(n.tagName)){const t=n.textContent.split(P),e=t.length-1;if(e>0){n.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],O()),G.nextNode(),a.push({type:2,index:++o});n.append(t[e],O())}}}else if(8===n.nodeType)if(n.data===M)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=n.data.indexOf(P,t+1));)a.push({type:7,index:o}),t+=P.length-1}o++}}static createElement(t,e){const i=H.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,n){if(e===V)return e;let o=void 0!==n?i._$Co?.[n]:i._$Cl;const s=T(e)?void 0:e._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),void 0===s?o=void 0:(o=new s(t),o._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=o:i._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,n)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??H).importNode(e,!0);G.currentNode=n;let o=G.nextNode(),s=0,r=0,a=i[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new tt(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new st(o,this,t)),this._$AV.push(e),a=i[++r]}s!==a?.index&&(o=G.nextNode(),s++)}return G.currentNode=H,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),T(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==q&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new X(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=K.get(t.strings);return void 0===e&&K.set(t.strings,e=new Z(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const o of t)n===e.length?e.push(i=new tt(this.O(O()),this.O(O()),this,this.options)):i=e[n],i._$AI(o),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=E(t).nextSibling;E(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=q}_$AI(t,e=this,i,n){const o=this.strings;let s=!1;if(void 0===o)t=Q(this,t,e,0),s=!T(t)||t!==this._$AH&&t!==V,s&&(this._$AH=t);else{const n=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=Q(this,n[i+r],e,r),a===V&&(a=this._$AH[r]),s||=!T(a)||a!==this._$AH[r],a===q?t=q:t!==q&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}s&&!n&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===q?void 0:t}}class nt extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==q)}}class ot extends et{constructor(t,e,i,n,o){super(t,e,i,n,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??q)===V)return;const i=this._$AH,n=t===q&&i!==q||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==q&&(i===q||n);n&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const rt=A.litHtmlPolyfillSupport;rt?.(Z,tt),(A.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;class ct extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const n=i?.renderBefore??e;let o=n._$litPart$;if(void 0===o){const t=i?.renderBefore??null;n._$litPart$=o=new tt(e.insertBefore(O(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}ct._$litElement$=!0,ct.finalized=!0,at.litElementHydrateSupport?.({LitElement:ct});const lt=at.litElementPolyfillSupport;lt?.({LitElement:ct}),(at.litElementVersions??=[]).push("4.2.2");const ht=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:$},pt=(t=dt,e,i)=>{const{kind:n,metadata:o}=i;let s=globalThis.litPropertyMetadata.get(o);if(void 0===s&&globalThis.litPropertyMetadata.set(o,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=!0),s.set(i.name,t),"accessor"===n){const{name:n}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(n,o,t,!0,i)},init(e){return void 0!==e&&this.C(n,void 0,t,e),e}}}if("setter"===n){const{name:n}=i;return function(i){const o=this[n];e.call(this,i),this.requestUpdate(n,o,t,!0,i)}}throw Error("Unsupported decorator location: "+n)};function ut(t){return(e,i)=>"object"==typeof i?pt(t,e,i):((t,e,i)=>{const n=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),n?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function mt(t){return ut({...t,state:!0,attribute:!1})}var ft,gt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(ft||(ft={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(gt||(gt={}));var _t=function(t,e,i,n){n=n||{},i=i??{};var o=new Event(e,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return o.detail=i,t.dispatchEvent(o),o};const yt="#4db6ac",bt={weight:{label:"Weight",short:"Weight",icon:"mdi:scale",unit:"kg",decimals:2},bmr:{label:"Basal Metabolic Rate",short:"BMR",icon:"mdi:fire",unit:"cal",decimals:0},body_fat:{label:"Body Fat Percentage",short:"Body Fat",icon:"mdi:chart-donut",unit:"%",decimals:1},bmi:{label:"Body Mass Index",short:"BMI",icon:"mdi:chart-line",unit:"",decimals:2},body_water:{label:"Body Water Percentage",short:"Body Water",icon:"mdi:water",unit:"%",decimals:1},bone_mass:{label:"Bone Mass",short:"Bone Mass",icon:"mdi:bone",unit:"kg",decimals:2},fat_free_weight:{label:"Fat Free Weight",short:"Fat-Free",icon:"mdi:weight",unit:"kg",decimals:2},impedance:{label:"Impedance",short:"Impedance",icon:"mdi:omega",unit:"Ω",decimals:0},metabolic_age:{label:"Metabolic Age",short:"Metabolic Age",icon:"mdi:calendar-clock",unit:"",decimals:0},muscle_mass:{label:"Muscle Mass",short:"Muscle Mass",icon:"mdi:dumbbell",unit:"kg",decimals:2},protein:{label:"Protein Percentage",short:"Protein",icon:"mdi:egg",unit:"%",decimals:1},skeletal_muscle:{label:"Skeletal Muscle Percentage",short:"Skeletal Muscle",icon:"mdi:dumbbell",unit:"%",decimals:1},subcutaneous_fat:{label:"Subcutaneous Fat Percentage",short:"Subcut. Fat",icon:"mdi:layers",unit:"%",decimals:1},visceral_fat:{label:"Visceral Fat Value",short:"Visceral Fat",icon:"mdi:heart",unit:"",decimals:0}},vt=["weight","bmr","body_fat","bmi","body_water","bone_mass","fat_free_weight","impedance","metabolic_age","muscle_mass","protein","skeletal_muscle","subcutaneous_fat","visceral_fat"];function $t(t){if("string"==typeof t)return{entity:t,columns:1};if(t&&"object"==typeof t){const e=t,i={entity:"string"==typeof e.entity?e.entity:"",columns:2===e.columns?2:1};return"string"==typeof e.metric&&e.metric in bt&&(i.metric=e.metric),"string"==typeof e.name&&e.name.trim().length>0&&(i.name=e.name.trim()),"string"==typeof e.icon&&e.icon.trim().length>0&&(i.icon=e.icon.trim()),"string"==typeof e.unit&&e.unit.trim().length>0&&(i.unit=e.unit.trim()),"number"==typeof e.decimals&&Number.isFinite(e.decimals)&&(i.decimals=Math.max(0,Math.min(6,Math.round(e.decimals)))),i}return{entity:"",columns:1}}function wt(t,e){return t&&e?t.states[e]??null:null}function xt(t){return!t||("unavailable"===t.state||"unknown"===t.state)}function At(t){if(null==t)return null;const e=String(t).trim();if(""===e)return null;const i=Number(e);return Number.isFinite(i)?i:null}function Et(t,e,i){const n=function(t,e){const i=t.toFixed(Math.max(0,e)),n=i.startsWith("-"),o=n?i.slice(1):i,[s,r]=o.split("."),a=r?r.replace(/0+$/,""):"";return(n?"-":"")+s.replace(/\B(?=(\d{3})+(?!\d))/g,",")+(a?`.${a}`:"")}(t,i);return e?"%"===e?`${n}%`:`${n} ${e}`:n}function St(t,e){if("%"!==e)return null;if(!t||xt(t))return null;const i=At(t.state);return null===i?null:Math.max(0,Math.min(100,i))}function Ct(t){const e=t.entities;if(0===e.length)return null;const i="string"==typeof t.primary?t.primary.trim():"";if(i){const t=e.find(t=>t.metric===i);if(t)return t;const n=e.find(t=>t.entity===i);if(n)return n}const n=e.find(t=>"weight"===t.metric);return n||e[0]}function kt(t,e,i){const n=wt(t,e.entity),o=function(t){if(t)return bt[t]}(e.metric),s="string"==typeof e.unit&&e.unit.length>0?e.unit:o?.unit??"",r="number"==typeof e.decimals?e.decimals:o?.decimals??2,a=n?.attributes?.friendly_name,c=o?2===e.columns?o.short:o.label:"";let l;l=e.name&&e.name.length>0?e.name:c.length>0?c:"string"==typeof a&&a.length>0?a:e.entity?e.entity:"Unknown";const h=e.icon&&e.icon.length>0?e.icon:o?.icon??"mdi:gauge",d=xt(n),p=d||!n?null:At(n.state),u=d?"unknown"===n?.state?"Unknown":"Unavailable":null!==p?Et(p,s,r):function(t){if(!t)return"Unavailable";if(xt(t))return"unknown"===t.state?"Unknown":"Unavailable";const e=At(t.state);return null===e?t.state.charAt(0).toUpperCase()+t.state.slice(1):String(e)}(n);return{config:e,stateObj:n,name:l,icon:h,value:u,barPercent:St(n,s),isUnavailable:d,isPrimary:!!i&&e.entity===i}}let Pt=class extends ct{constructor(){super(...arguments),this._computeRootLabel=t=>"name"===t.name?"Card name":"icon"===t.name?"Card icon (optional)":"primary"===t.name?"Headline metric":"show_updated"===t.name?'Show "Updated …" line':"show_bars"===t.name?"Show bars for percentages":"compact"===t.name?"Compact mode":"",this._computeRootHelper=t=>"icon"===t.name?"When set, this icon always shows in the header. When left empty, the header shows mdi:scale.":"primary"===t.name?"The value shown under the card name, and the tile highlighted with the accent colour. Pick one of the configured entities, or leave Auto to use Weight (falling back to the first entity).":"show_updated"===t.name?'Shows how old the newest reading is (e.g. "Updated 2 hr ago").':"show_bars"===t.name?"Draws a hairline 0-100 bar under percentage tiles (body fat, water, protein, …).":"compact"===t.name?"Removes the gap between tiles and tightens padding. Useful when you have many metrics and want a denser layout.":"",this._computeEntityLabel=t=>"entity"===t.name?"Sensor":"metric"===t.name?"Metric (optional)":"name"===t.name?"Display name (optional)":"columns"===t.name?"Tile width":"icon"===t.name?"Icon (optional)":"",this._computeEntityHelper=t=>"metric"===t.name?"Picks the label, icon, unit and decimals for this sensor. Leave on Auto to use the entity friendly name.":"",this._addEntity=()=>{if(!this._config)return;const t=[...this._config.entities,{entity:"",columns:1}],e={...this._config,entities:t};this._config=e,_t(this,"config-changed",{config:e})}}setConfig(t){const e=Array.isArray(t.entities)?t.entities:[];this._config={...t,name:t.name??"",icon:t.icon??"",primary:t.primary??"",entities:e.map(t=>$t(t))}}_primaryOptions(){const t=(this._config?.entities??[]).filter(t=>t.entity.length>0);return t.map(t=>{const e=this.hass?.states?.[t.entity]?.attributes?.friendly_name,i=t.name||(t.metric?bt[t.metric].label:"")||("string"==typeof e&&e.length>0?e:t.entity);return{value:t.entity,label:i}})}_primaryValue(){const t=this._config;if(!t?.primary)return"";const e=t.entities.find(e=>e.entity===t.primary||e.metric===t.primary);return e?.entity??""}render(){if(!this._config||!this.hass)return W``;const t=this._config,e=[{name:"name",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"primary",selector:{select:{options:[{value:"",label:"Auto (Weight, else first entity)"},...this._primaryOptions()],mode:"dropdown"}}},{name:"show_updated",selector:{boolean:{}}},{name:"show_bars",selector:{boolean:{}}},{name:"compact",selector:{boolean:{}}}];return W`
      <ha-form
        .hass=${this.hass}
        .data=${{name:t.name,icon:t.icon??"",primary:this._primaryValue(),show_updated:!0===t.show_updated,show_bars:!0===t.show_bars,compact:!0===t.compact}}
        .schema=${e}
        .computeLabel=${this._computeRootLabel}
        .computeHelper=${this._computeRootHelper}
        @value-changed=${this._rootFormChanged}
      ></ha-form>

      <div class="entities-section">
        <div class="section-title">Entities</div>
        ${t.entities.map((t,e)=>this._renderEntitySection(t,e))}
        <ha-button class="add-btn" @click=${this._addEntity}>
          <ha-icon icon="mdi:plus" slot="icon"></ha-icon>
          Add entity
        </ha-button>
      </div>
    `}_renderEntitySection(t,e){const i=[{name:"entity",selector:{entity:{domain:"sensor"}}},{name:"metric",selector:{select:{options:[{value:"",label:"Auto (friendly name + mdi:gauge)"},...vt.map(t=>({value:t,label:bt[t].label}))],mode:"dropdown"}}},{name:"name",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"columns",selector:{select:{options:[{value:1,label:"Full"},{value:2,label:"Half"}],mode:"dropdown"}}},{name:"icon",selector:{icon:{}},context:{icon_entity:"entity"}}]}],n=this._config?.entities.length??0;return W`
      <div class="entity-section">
        <ha-form
          .hass=${this.hass}
          .data=${{entity:t.entity,metric:t.metric??"",name:t.name??"",columns:t.columns,icon:t.icon??""}}
          .schema=${i}
          .computeLabel=${this._computeEntityLabel}
          .computeHelper=${this._computeEntityHelper}
          @value-changed=${t=>this._entityFormChanged(e,t)}
        ></ha-form>
        <div class="entity-actions">
          <ha-icon-button
            .label=${"Move up"}
            .disabled=${0===e}
            @click=${()=>this._moveEntity(e,-1)}
          >
            <ha-icon icon="mdi:arrow-up"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            .label=${"Move down"}
            .disabled=${e===n-1}
            @click=${()=>this._moveEntity(e,1)}
          >
            <ha-icon icon="mdi:arrow-down"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            class="remove-btn"
            .label=${"Remove entity"}
            @click=${()=>this._removeEntity(e)}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </ha-icon-button>
        </div>
      </div>
    `}_rootFormChanged(t){if(t.stopPropagation(),!this._config)return;const e=t.detail.value,i={...this._config,name:e.name??"",icon:e.icon&&e.icon.trim().length>0?e.icon.trim():void 0,primary:e.primary&&e.primary.length>0?e.primary:void 0,show_updated:!0===e.show_updated||void 0,show_bars:!0===e.show_bars||void 0,compact:!0===e.compact||void 0};this._config=i,_t(this,"config-changed",{config:i})}_entityFormChanged(t,e){if(e.stopPropagation(),!this._config)return;const i=e.detail.value,n={entity:i.entity,columns:2===Number(i.columns)?2:1};i.metric&&i.metric in bt&&(n.metric=i.metric),i.name&&i.name.length>0&&(n.name=i.name),i.icon&&i.icon.length>0&&(n.icon=i.icon);const o=[...this._config.entities];o[t]=n;const s={...this._config,entities:o};this._config=s,_t(this,"config-changed",{config:s})}_removeEntity(t){if(!this._config)return;const e=this._config.entities.filter((e,i)=>i!==t),i={...this._config,entities:e};this._config=i,_t(this,"config-changed",{config:i})}_moveEntity(t,e){if(!this._config)return;const i=t+e,n=this._config.entities;if(i<0||i>=n.length)return;const o=[...n];[o[t],o[i]]=[o[i],o[t]];const s={...this._config,entities:o};this._config=s,_t(this,"config-changed",{config:s})}static{this.styles=a`
    :host {
      display: block;
    }
    .entities-section {
      margin-top: 16px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin: 16px 0 8px;
    }
    .entity-section {
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 12px;
    }
    .entity-actions {
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      margin-top: 8px;
      padding-top: 4px;
    }
    .entity-actions ha-icon-button {
      --mdc-icon-button-size: 36px;
      color: var(--secondary-text-color);
    }
    .remove-btn {
      color: var(--error-color, #b71c1c);
    }
    .add-btn {
      align-self: flex-start;
      margin-top: 4px;
    }
  `}};t([ut({attribute:!1})],Pt.prototype,"hass",void 0),t([mt()],Pt.prototype,"_config",void 0),Pt=t([ht("scale-card-editor")],Pt);let Mt=class extends ct{constructor(){super(...arguments),this._onHeaderClick=()=>{if(!this._config)return;const t=Ct(this._config);this._openMoreInfo(t?.entity)},this._onTileClick=t=>{const e=t.currentTarget,i=e?.dataset.entityId;i&&(t.preventDefault(),t.stopPropagation(),this._openMoreInfo(i))},this._onHeaderKey=t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._onHeaderClick())},this._onTileKey=t=>{if("Enter"!==t.key&&" "!==t.key)return;t.preventDefault();const e=t.currentTarget;this._openMoreInfo(e?.dataset.entityId)}}static getConfigElement(){return document.createElement("scale-card-editor")}static getStubConfig(){return{name:"Body Composition",entities:[{entity:"sensor.weight",metric:"weight",columns:1},{entity:"sensor.body_fat",metric:"body_fat",columns:2},{entity:"sensor.bmi",metric:"bmi",columns:2},{entity:"sensor.bmr",metric:"bmr",columns:2},{entity:"sensor.muscle_mass",metric:"muscle_mass",columns:2}]}}getCardSize(){return this._baseRows()+this._computeRows()}getGridOptions(){return{rows:"auto",columns:12,min_columns:6,max_columns:12}}_baseRows(){return this._config?.compact?1:2}setConfig(t){if(!t||"object"!=typeof t)throw new Error("Invalid configuration");if(!t.name)throw new Error("You must define a `name` for the card");if(!Array.isArray(t.entities)||0===t.entities.length)throw new Error("You must define at least one entity in `entities`");const e=t.entities.map(t=>$t(t)).filter(t=>t.entity.length>0);if(0===e.length)throw new Error("No valid sensor entities found in `entities`");const i="string"==typeof t.icon?t.icon.trim():"",n="string"==typeof t.primary?t.primary.trim():"";this._config={...t,type:t.type??"custom:scale-card",entities:e,icon:i.length>0?i:void 0,primary:n.length>0?n:void 0}}shouldUpdate(t){if(t.has("_config"))return!0;if(!t.has("hass"))return!0;const e=t.get("hass"),i=this.hass;if(!e||!i)return!0;const n=this._config;if(!n)return!0;for(const t of n.entities)if(e.states[t.entity]!==i.states[t.entity])return!0;return!1}render(){if(!this._config)return q;const t=this._config,e=Ct(t),i=e?.entity??"",n=t.entities.map(t=>kt(this.hass,t,i)),o=t.icon??"mdi:scale",s=function(t,e){const i=Ct(e);return i?kt(t,i).value:"No metrics"}(this.hass,t),r=n.some(t=>!t.isUnavailable),a=t.show_updated?function(t){if(!t)return"";const e=Date.parse(t);if(Number.isNaN(e))return"";const i=Math.floor((Date.now()-e)/6e4);if(i<1)return"just now";if(i<60)return`${i} min ago`;const n=Math.floor(i/60);if(n<24)return`${n} hr ago`;const o=Math.floor(n/24);return o<7?`${o} d ago`:new Date(e).toLocaleDateString()}(function(t,e){if(!t)return"";let i=0,n="";for(const o of e){const e=wt(t,o.entity),s=e?.last_updated;if(!s)continue;const r=Date.parse(s);Number.isNaN(r)||r>i&&(i=r,n=s)}return n}(this.hass,t.entities)):"";return W`
      <ha-card class=${t.compact?"compact":""}>
        <div class="card-inner">
          <div
            class="header ${r?"on":"off"}"
            data-header
            role="button"
            tabindex="0"
            aria-label=${i?`Open ${i}`:t.name}
            @click=${this._onHeaderClick}
            @keydown=${this._onHeaderKey}
          >
            <ha-icon class="header-icon" icon=${o}></ha-icon>
            <div class="header-name">${t.name}</div>
            <div class="header-status">${s}</div>
          </div>

          <div class="grid">
            ${n.map(t=>this._renderTile(t))}
          </div>

          ${a?W`<div class="footer">Updated ${a}</div>`:q}
        </div>
      </ha-card>
    `}_renderTile(t){const{config:e,name:i,icon:n,value:o,barPercent:s,isUnavailable:r,isPrimary:a}=t,c=r?"unavailable":"live",l=2===e.columns?"tile-half":"tile-full",h=!0===this._config?.show_bars&&null!==s;return W`
      <div
        class="tile ${l} ${c} ${a?"hero":""}"
        data-tile
        data-entity-id=${e.entity}
        role="button"
        tabindex="0"
        aria-label=${`${i}: ${o}`}
        @click=${this._onTileClick}
        @keydown=${this._onTileKey}
      >
        <div class="tile-icon-wrap">
          <ha-icon class="tile-icon ${c}" icon=${n}></ha-icon>
        </div>
        <div class="tile-text">
          <div class="tile-name">${i}</div>
          <div class="tile-value ${c}">${o}</div>
          ${h?W`
              <div class="tile-bar">
                <div class="tile-bar-fill" style="width: ${s}%"></div>
              </div>
            `:q}
        </div>
      </div>
    `}_openMoreInfo(t){t&&_t(this,"hass-more-info",{entityId:t})}_computeRows(){if(!this._config)return 0;let t=0,e=0;for(const i of this._config.entities)1===i.columns?t+=1:e+=1;return t+Math.ceil(e/2)}static{this.styles=a`
    :host {
      display: block;
      --_scale-accent: ${r(yt)};
    }
    ha-card {
      border-radius: 12px;
      /* Symmetric vertical padding so the last tile row has visual breathing
         room from the card's bottom edge. */
      padding: 12px 16px;
      box-sizing: border-box;
      max-width: 100%;
      overflow: hidden;
      /* Do NOT override --ha-card-background here: ha-card's own :host rule
         already applies the theme's value, and every override breaks a
         different theme (glassmorphic, light, black-wallpaper). Leaving it
         alone makes the card match the dashboard surface everywhere. */
      -webkit-backdrop-filter: var(--ha-card-backdrop-filter, none);
      backdrop-filter: var(--ha-card-backdrop-filter, none);
      --ha-card-border-color: transparent;
    }
    .card-inner {
      display: flex;
      flex-direction: column;
    }

    /* Header ---------------------------------------------------------------- */
    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 12px 6px 8px;
      border-radius: 10px;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      transition: background-color 0.15s ease;
      text-align: center;
    }
    .header:hover {
      background-color: var(--divider-color, rgba(0, 0, 0, 0.05));
    }
    .header:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .header-icon {
      --mdc-icon-size: 36px;
      flex-shrink: 0;
      margin-bottom: 2px;
    }
    .header.on .header-icon {
      color: var(--accent-on, var(--_scale-accent, #4db6ac));
    }
    .header.off .header-icon {
      color: var(--secondary-text-color, #9e9e9e);
    }
    .header-name {
      font-size: 15px;
      font-weight: 500;
      color: var(--primary-text-color);
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .header-status {
      font-size: 13px;
      color: var(--secondary-text-color);
      line-height: 1.2;
      font-variant-numeric: tabular-nums;
    }
    .header.on .header-status {
      color: var(--accent-on, var(--_scale-accent, #4db6ac));
    }

    /* Grid ----------------------------------------------------------------- */
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 14px;
    }

    /* Tile ----------------------------------------------------------------- */
    .tile {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      /* Tiles default to transparent so they impose no colour of their own —
         they show the card's (theme-owned) surface through and separate by
         border + the accent ring on the hero tile. */
      background: var(--ha-card-background-tile, transparent);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      border-radius: 10px;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      min-width: 0;
      box-sizing: border-box;
      transition: background-color 0.15s ease, border-color 0.15s ease;
    }
    .tile:hover {
      background-color: var(--divider-color, rgba(0, 0, 0, 0.08));
    }
    .tile:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .tile-full {
      grid-column: 1 / -1;
    }
    .tile-half {
      grid-column: span 1;
    }
    .tile.unavailable {
      opacity: 0.55;
    }
    .tile.hero {
      border-color: var(--accent-on, var(--_scale-accent, #4db6ac));
    }
    .tile-icon-wrap {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tile-icon {
      --mdc-icon-size: 22px;
      display: flex;
    }
    .tile-icon.live {
      color: var(--accent-on, var(--_scale-accent, #4db6ac)) !important;
    }
    .tile-icon.unavailable {
      color: var(--disabled-text-color, #9e9e9e) !important;
    }
    .tile-text {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .tile-name {
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tile-value {
      font-size: 15px;
      font-weight: 600;
      color: var(--primary-text-color);
      line-height: 1.3;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tile.hero .tile-value {
      font-size: 18px;
      color: var(--accent-on, var(--_scale-accent, #4db6ac));
    }
    .tile.unavailable .tile-value {
      color: var(--disabled-text-color, #9e9e9e);
    }

    /* Hairline 0-100 bar for percentage metrics (opt-in via show_bars) */
    .tile-bar {
      height: 4px;
      border-radius: 2px;
      background: var(--divider-color, rgba(0, 0, 0, 0.1));
      overflow: hidden;
      margin-top: 4px;
    }
    .tile-bar-fill {
      height: 100%;
      border-radius: 2px;
      background: var(--accent-on, var(--_scale-accent, #4db6ac));
      transition: width 0.25s ease;
    }

    /* Footer --------------------------------------------------------------- */
    .footer {
      margin-top: 12px;
      font-size: 12px;
      color: var(--secondary-text-color);
      text-align: center;
    }

    /* Compact mode --------------------------------------------------------- */
    /* Removes the gap between tiles, tightens outer/inner padding, and makes
       tile borders faint so flush-adjacent tiles don't show a double border. */
    ha-card.compact {
      padding: 8px 10px;
      border-radius: 8px;
    }
    ha-card.compact .header {
      padding: 6px 4px 4px;
      gap: 2px;
    }
    ha-card.compact .header-icon {
      --mdc-icon-size: 28px;
    }
    ha-card.compact .grid {
      gap: 0;
      margin-top: 8px;
    }
    ha-card.compact .tile {
      padding: 10px 12px;
      border-radius: 6px;
      border-color: var(--divider-color, rgba(0, 0, 0, 0.12));
    }
    ha-card.compact .tile.hero {
      border-color: var(--accent-on, var(--_scale-accent, #4db6ac));
    }
    ha-card.compact .footer {
      margin-top: 8px;
    }
  `}};t([ut({attribute:!1})],Mt.prototype,"hass",void 0),t([mt()],Mt.prototype,"_config",void 0),Mt=t([ht("scale-card")],Mt);const Ut=`background:${yt};color:#1a1a1a;padding:2px 6px;border-radius:4px;font-weight:600`;console.info("%cSCALE-CARD%c v1.0.1 %cloaded",Ut,"background:#222;color:#fff;padding:2px 6px;border-radius:4px","color:#888"),window.customCards=window.customCards||[],window.customCards.push({type:"scale-card",name:"Smart Fitness Scale Card",description:"Body composition at a glance — weight, BMR, body fat, muscle mass and more. Tap any tile for more info.",preview:!0});export{Mt as ScaleCard};
