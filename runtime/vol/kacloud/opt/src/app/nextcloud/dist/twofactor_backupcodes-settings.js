/*! For license information please see twofactor_backupcodes-settings.js.LICENSE.txt */
(()=>{"use strict";var e,n={37679:(e,n,o)=>{var a=o(43554),s=o(20144),r=o(7820);o(65509);var c=o(25108);const d={name:"PersonalSettings",data:()=>({generatingCodes:!1}),computed:{downloadUrl(){return this.codes?"data:text/plain,"+encodeURIComponent(this.codes.reduce(((t,e)=>t+e+"\r\n"),"")):""},downloadFilename:()=>(OC.theme.name||"Nextcloud")+"-backup-codes.txt",enabled(){return this.$store.state.enabled},total(){return this.$store.state.total},used(){return this.$store.state.used},codes(){return this.$store.state.codes},name:()=>OC.theme.name||"Nextcloud",haveCodes(){return this.codes&&this.codes.length>0}},methods:{generateBackupCodes(){(0,r.Z)().then((()=>{this.generatingCodes=!0,this.$store.dispatch("generate").then((t=>{this.generatingCodes=!1})).catch((e=>{throw OC.Notification.showTemporary(t("twofactor_backupcodes","An error occurred while generating your backup codes")),this.generatingCodes=!1,e}))})).catch(c.error.bind(this))},getPrintData:t=>t?t.reduce(((t,e)=>t+e+"<br>"),""):"",printCodes(){!function(e){const n=OC.theme.name||"Nextcloud",o=window.open("",t("twofactor_backupcodes","{name} backup codes",{name:n}));o.document.write("<h1>"+t("twofactor_backupcodes","{name} backup codes",{name:n})+"</h1>"),o.document.write("<pre>"+e+"</pre>"),o.print(),o.close()}(this.getPrintData(this.codes))}}};var i=o(93379),l=o.n(i),u=o(7795),p=o.n(u),b=o(90569),h=o.n(b),m=o(3565),f=o.n(m),g=o(19216),v=o.n(g),k=o(44589),w=o.n(k),C=o(76142),_={};_.styleTagTransform=w(),_.setAttributes=f(),_.insert=h().bind(null,"head"),_.domAPI=p(),_.insertStyleElement=v(),l()(C.Z,_),C.Z&&C.Z.locals&&C.Z.locals;const y=(0,o(51900).Z)(d,(function(){var t=this,e=t._self._c;return e("div",[t.enabled?[e("p",[t.haveCodes?[t._v("\n\t\t\t\t"+t._s(t.t("twofactor_backupcodes","These are your backup codes. Please save and/or print them as you will not be able to read the codes again later"))+"\n\t\t\t\t"),e("ul",t._l(t.codes,(function(n){return e("li",{key:n,staticClass:"backup-code"},[t._v("\n\t\t\t\t\t\t"+t._s(n)+"\n\t\t\t\t\t")])})),0),t._v(" "),e("a",{staticClass:"button primary",attrs:{href:t.downloadUrl,download:t.downloadFilename}},[t._v(t._s(t.t("twofactor_backupcodes","Save backup codes")))]),t._v(" "),e("button",{staticClass:"button",on:{click:t.printCodes}},[t._v("\n\t\t\t\t\t"+t._s(t.t("twofactor_backupcodes","Print backup codes"))+"\n\t\t\t\t")])]:[t._v("\n\t\t\t\t"+t._s(t.t("twofactor_backupcodes","Backup codes have been generated. {used} of {total} codes have been used.",{used:t.used,total:t.total}))+"\n\t\t\t")]],2),t._v(" "),e("p",[e("button",{attrs:{id:"generate-backup-codes"},on:{click:t.generateBackupCodes}},[t._v("\n\t\t\t\t"+t._s(t.t("twofactor_backupcodes","Regenerate backup codes"))+"\n\t\t\t")])]),t._v(" "),e("p",[e("em",[t._v("\n\t\t\t\t"+t._s(t.t("twofactor_backupcodes","If you regenerate backup codes, you automatically invalidate old codes."))+"\n\t\t\t")])])]:e("button",{attrs:{id:"generate-backup-codes",disabled:t.generatingCodes},on:{click:t.generateBackupCodes}},[t._v("\n\t\t"+t._s(t.t("twofactor_backupcodes","Generate backup codes"))+"\n\t\t"),e("span",{class:{"icon-loading-small":t.generatingCodes}})])],2)}),[],!1,null,"142ef146",null).exports;var A=o(20629),P=o(93664),x=o(79753);s.ZP.use(A.ZP);const O={setEnabled(t,e){s.ZP.set(t,"enabled",e)},setTotal(t,e){s.ZP.set(t,"total",e)},setUsed(t,e){s.ZP.set(t,"used",e)},setCodes(t,e){s.ZP.set(t,"codes",e)}},Z={generate(t){let{commit:e}=t;return e("setEnabled",!1),function(){const t=(0,x.generateUrl)("/apps/twofactor_backupcodes/settings/create");return P.Z.post(t,{}).then((t=>t.data))}().then((t=>{let{codes:n,state:o}=t;return e("setEnabled",o.enabled),e("setTotal",o.total),e("setUsed",o.used),e("setCodes",n),!0}))}},S=new A.yh({strict:!1,state:{enabled:!1,total:0,used:0,codes:[]},mutations:O,actions:Z});s.ZP.prototype.t=t;const B=(0,a.j)("twofactor_backupcodes","state");S.replaceState(B),new(s.ZP.extend(y))({store:S}).$mount("#twofactor-backupcodes-settings")},76142:(t,e,n)=>{n.d(e,{Z:()=>c});var o=n(87537),a=n.n(o),s=n(23645),r=n.n(s)()(a());r.push([t.id,"\n.backup-code[data-v-142ef146] {\n\tfont-family: monospace;\n\tletter-spacing: 0.02em;\n\tfont-size: 1.2em;\n}\n.button[data-v-142ef146] {\n\tdisplay: inline-block;\n}\n","",{version:3,sources:["webpack://./apps/twofactor_backupcodes/src/views/PersonalSettings.vue"],names:[],mappings:";AAoIA;CACA,sBAAA;CACA,sBAAA;CACA,gBAAA;AACA;AACA;CACA,qBAAA;AACA",sourcesContent:["<template>\n\t<div>\n\t\t<button v-if=\"!enabled\"\n\t\t\tid=\"generate-backup-codes\"\n\t\t\t:disabled=\"generatingCodes\"\n\t\t\t@click=\"generateBackupCodes\">\n\t\t\t{{ t('twofactor_backupcodes', 'Generate backup codes') }}\n\t\t\t<span :class=\"{'icon-loading-small': generatingCodes}\" />\n\t\t</button>\n\t\t<template v-else>\n\t\t\t<p>\n\t\t\t\t<template v-if=\"!haveCodes\">\n\t\t\t\t\t{{ t('twofactor_backupcodes', 'Backup codes have been generated. {used} of {total} codes have been used.', {used, total}) }}\n\t\t\t\t</template>\n\t\t\t\t<template v-else>\n\t\t\t\t\t{{ t('twofactor_backupcodes', 'These are your backup codes. Please save and/or print them as you will not be able to read the codes again later') }}\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li v-for=\"code in codes\" :key=\"code\" class=\"backup-code\">\n\t\t\t\t\t\t\t{{ code }}\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ul>\n\t\t\t\t\t<a :href=\"downloadUrl\"\n\t\t\t\t\t\tclass=\"button primary\"\n\t\t\t\t\t\t:download=\"downloadFilename\">{{ t('twofactor_backupcodes', 'Save backup codes') }}</a>\n\t\t\t\t\t<button class=\"button\"\n\t\t\t\t\t\t@click=\"printCodes\">\n\t\t\t\t\t\t{{ t('twofactor_backupcodes', 'Print backup codes') }}\n\t\t\t\t\t</button>\n\t\t\t\t</template>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<button id=\"generate-backup-codes\"\n\t\t\t\t\t@click=\"generateBackupCodes\">\n\t\t\t\t\t{{ t('twofactor_backupcodes', 'Regenerate backup codes') }}\n\t\t\t\t</button>\n\t\t\t</p>\n\t\t\t<p>\n\t\t\t\t<em>\n\t\t\t\t\t{{ t('twofactor_backupcodes', 'If you regenerate backup codes, you automatically invalidate old codes.') }}\n\t\t\t\t</em>\n\t\t\t</p>\n\t\t</template>\n\t</div>\n</template>\n\n<script>\nimport { confirmPassword } from '@nextcloud/password-confirmation'\nimport '@nextcloud/password-confirmation/dist/style.css'\nimport { print } from '../service/PrintService.js'\n\nexport default {\n\tname: 'PersonalSettings',\n\tdata() {\n\t\treturn {\n\t\t\tgeneratingCodes: false,\n\t\t}\n\t},\n\tcomputed: {\n\t\tdownloadUrl() {\n\t\t\tif (!this.codes) {\n\t\t\t\treturn ''\n\t\t\t}\n\t\t\treturn 'data:text/plain,' + encodeURIComponent(this.codes.reduce((prev, code) => {\n\t\t\t\treturn prev + code + '\\r\\n'\n\t\t\t}, ''))\n\t\t},\n\t\tdownloadFilename() {\n\t\t\tconst name = OC.theme.name || 'Nextcloud'\n\t\t\treturn name + '-backup-codes.txt'\n\t\t},\n\t\tenabled() {\n\t\t\treturn this.$store.state.enabled\n\t\t},\n\t\ttotal() {\n\t\t\treturn this.$store.state.total\n\t\t},\n\t\tused() {\n\t\t\treturn this.$store.state.used\n\t\t},\n\t\tcodes() {\n\t\t\treturn this.$store.state.codes\n\t\t},\n\t\tname() {\n\t\t\treturn OC.theme.name || 'Nextcloud'\n\t\t},\n\t\thaveCodes() {\n\t\t\treturn this.codes && this.codes.length > 0\n\t\t},\n\t},\n\tmethods: {\n\t\tgenerateBackupCodes() {\n\t\t\tconfirmPassword().then(() => {\n\t\t\t\t// Hide old codes\n\t\t\t\tthis.generatingCodes = true\n\n\t\t\t\tthis.$store.dispatch('generate').then(data => {\n\t\t\t\t\tthis.generatingCodes = false\n\t\t\t\t}).catch(err => {\n\t\t\t\t\tOC.Notification.showTemporary(t('twofactor_backupcodes', 'An error occurred while generating your backup codes'))\n\t\t\t\t\tthis.generatingCodes = false\n\t\t\t\t\tthrow err\n\t\t\t\t})\n\t\t\t}).catch(console.error.bind(this))\n\t\t},\n\n\t\tgetPrintData(codes) {\n\t\t\tif (!codes) {\n\t\t\t\treturn ''\n\t\t\t}\n\t\t\treturn codes.reduce((prev, code) => {\n\t\t\t\treturn prev + code + '<br>'\n\t\t\t}, '')\n\t\t},\n\n\t\tprintCodes() {\n\t\t\tprint(this.getPrintData(this.codes))\n\t\t},\n\t},\n}\n<\/script>\n\n<style scoped>\n\t.backup-code {\n\t\tfont-family: monospace;\n\t\tletter-spacing: 0.02em;\n\t\tfont-size: 1.2em;\n\t}\n\t.button {\n\t\tdisplay: inline-block;\n\t}\n</style>\n"],sourceRoot:""}]);const c=r}},o={};function a(t){var e=o[t];if(void 0!==e)return e.exports;var s=o[t]={id:t,loaded:!1,exports:{}};return n[t].call(s.exports,s,s.exports,a),s.loaded=!0,s.exports}a.m=n,e=[],a.O=(t,n,o,s)=>{if(!n){var r=1/0;for(l=0;l<e.length;l++){n=e[l][0],o=e[l][1],s=e[l][2];for(var c=!0,d=0;d<n.length;d++)(!1&s||r>=s)&&Object.keys(a.O).every((t=>a.O[t](n[d])))?n.splice(d--,1):(c=!1,s<r&&(r=s));if(c){e.splice(l--,1);var i=o();void 0!==i&&(t=i)}}return t}s=s||0;for(var l=e.length;l>0&&e[l-1][2]>s;l--)e[l]=e[l-1];e[l]=[n,o,s]},a.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return a.d(e,{a:e}),e},a.d=(t,e)=>{for(var n in e)a.o(e,n)&&!a.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},a.e=()=>Promise.resolve(),a.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),a.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),a.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.nmd=t=>(t.paths=[],t.children||(t.children=[]),t),a.j=2870,(()=>{a.b=document.baseURI||self.location.href;var t={2870:0};a.O.j=e=>0===t[e];var e=(e,n)=>{var o,s,r=n[0],c=n[1],d=n[2],i=0;if(r.some((e=>0!==t[e]))){for(o in c)a.o(c,o)&&(a.m[o]=c[o]);if(d)var l=d(a)}for(e&&e(n);i<r.length;i++)s=r[i],a.o(t,s)&&t[s]&&t[s][0](),t[s]=0;return a.O(l)},n=self.webpackChunknextcloud=self.webpackChunknextcloud||[];n.forEach(e.bind(null,0)),n.push=e.bind(null,n.push.bind(n))})(),a.nc=void 0;var s=a.O(void 0,[7874],(()=>a(37679)));s=a.O(s)})();
//# sourceMappingURL=twofactor_backupcodes-settings.js.map?v=3e25f01340458ebe3d85