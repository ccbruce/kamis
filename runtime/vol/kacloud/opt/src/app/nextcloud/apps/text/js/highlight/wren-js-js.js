(self.webpackChunk_nextcloud_text=self.webpackChunk_nextcloud_text||[]).push([["highlight/wren-js-js","highlight/wren"],{68563:e=>{e.exports=function(e){const a=e.regex,s=/[a-zA-Z]\w*/,n=["as","break","class","construct","continue","else","for","foreign","if","import","in","is","return","static","var","while"],t=["true","false","null"],c=["this","super"],i=["-","~",/\*/,"%",/\.\.\./,/\.\./,/\+/,"<<",">>",">=","<=","<",">",/\^/,/!=/,/!/,/\bis\b/,"==","&&","&",/\|\|/,/\|/,/\?:/,"="],r={relevance:0,match:a.concat(/\b(?!(if|while|for|else|super)\b)/,s,/(?=\s*[({])/),className:"title.function"},o={match:a.concat(a.either(a.concat(/\b(?!(if|while|for|else|super)\b)/,s),a.either(...i)),/(?=\s*\([^)]+\)\s*\{)/),className:"title.function",starts:{contains:[{begin:/\(/,end:/\)/,contains:[{relevance:0,scope:"params",match:s}]}]}},l={variants:[{match:[/class\s+/,s,/\s+is\s+/,s]},{match:[/class\s+/,s]}],scope:{2:"title.class",4:"title.class.inherited"},keywords:n},h={relevance:0,match:a.either(...i),className:"operator"},g={className:"property",begin:a.concat(/\./,a.lookahead(s)),end:s,excludeBegin:!0,relevance:0},p={relevance:0,match:a.concat(/\b_/,s),scope:"variable"},b={relevance:0,match:/\b[A-Z]+[a-z]+([A-Z]+[a-z]+)*/,scope:"title.class",keywords:{_:["Bool","Class","Fiber","Fn","List","Map","Null","Num","Object","Range","Sequence","String","System"]}},u=e.C_NUMBER_MODE,m={match:[s,/\s*/,/=/,/\s*/,/\(/,s,/\)\s*\{/],scope:{1:"title.function",3:"operator",6:"params"}},d=e.COMMENT(/\/\*\*/,/\*\//,{contains:[{match:/@[a-z]+/,scope:"doctag"},"self"]}),f={scope:"subst",begin:/%\(/,end:/\)/,contains:[u,b,r,p,h]},w={scope:"string",begin:/"/,end:/"/,contains:[f,{scope:"char.escape",variants:[{match:/\\\\|\\["0%abefnrtv]/},{match:/\\x[0-9A-F]{2}/},{match:/\\u[0-9A-F]{4}/},{match:/\\U[0-9A-F]{8}/}]}]};f.contains.push(w);const _=[...n,...c,...t],v={relevance:0,match:a.concat("\\b(?!",_.join("|"),"\\b)",/[a-zA-Z_]\w*(?:[?!]|\b)/),className:"variable"};return{name:"Wren",keywords:{keyword:n,"variable.language":c,literal:t},contains:[{scope:"comment",variants:[{begin:[/#!?/,/[A-Za-z_]+(?=\()/],beginScope:{},keywords:{literal:t},contains:[],end:/\)/},{begin:[/#!?/,/[A-Za-z_]+/],beginScope:{},end:/$/}]},u,w,{className:"string",begin:/"""/,end:/"""/},d,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,b,l,m,o,r,h,p,g,v]}}},87106:(e,a,s)=>{!function e(){e.warned||(e.warned=!0,console.log('Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/wren" instead of "highlight.js/lib/languages/wren.js"'))}(),e.exports=s(68563)}}]);
//# sourceMappingURL=wren-js-js.js.map?v=374e503952ba1f5da908