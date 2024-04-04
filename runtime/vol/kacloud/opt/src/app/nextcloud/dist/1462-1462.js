"use strict";(self.webpackChunknextcloud=self.webpackChunknextcloud||[]).push([[1462],{552:(t,e,n)=>{n.d(e,{Z:()=>i});var o=n(87537),r=n.n(o),s=n(23645),a=n.n(s)()(r());a.push([t.id,"\n.comments-action[data-v-fffab6ae] {\n\tpadding: 0;\n}\n","",{version:3,sources:["webpack://./apps/comments/src/views/ActivityCommentAction.vue"],names:[],mappings:";AAmEA;CACA,UAAA;AACA",sourcesContent:['\x3c!--\n  - @copyright Copyright (c) 2023 Ferdinand Thiessen <opensource@fthiessen.de>\n  -\n  - @author Ferdinand Thiessen <opensource@fthiessen.de>\n  -\n  - @license AGPL-3.0-or-later\n  -\n  - This program is free software: you can redistribute it and/or modify\n  - it under the terms of the GNU Affero General Public License as\n  - published by the Free Software Foundation, either version 3 of the\n  - License, or (at your option) any later version.\n  -\n  - This program is distributed in the hope that it will be useful,\n  - but WITHOUT ANY WARRANTY; without even the implied warranty of\n  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n  - GNU Affero General Public License for more details.\n  -\n  - You should have received a copy of the GNU Affero General Public License\n  - along with this program. If not, see <http://www.gnu.org/licenses/>.\n  -\n  --\x3e\n\n<template>\n\t<Comment v-bind="editorData"\n\t\t:auto-complete="autoComplete"\n\t\t:resource-type="resourceType"\n\t\t:editor="true"\n\t\t:user-data="userData"\n\t\t:resource-id="resourceId"\n\t\tclass="comments-action"\n\t\t@new="onNewComment" />\n</template>\n\n<script lang="ts">\nimport { defineComponent } from \'vue\'\nimport Comment from \'../components/Comment.vue\'\nimport CommentView from \'../mixins/CommentView.js\'\nimport logger from \'../logger\'\nimport { showError } from \'@nextcloud/dialogs\'\nimport { translate as t } from \'@nextcloud/l10n\'\n\nexport default defineComponent({\n\tcomponents: {\n\t\tComment,\n\t},\n\tmixins: [CommentView],\n\tprops: {\n\t\treloadCallback: {\n\t\t\ttype: Function,\n\t\t\trequired: true,\n\t\t},\n\t},\n\tmethods: {\n\t\tonNewComment() {\n\t\t\ttry {\n\t\t\t\t// just force reload\n\t\t\t\tthis.reloadCallback()\n\t\t\t} catch (e) {\n\t\t\t\tshowError(t(\'comments\', \'Could not reload comments\'))\n\t\t\t\tlogger.debug(e)\n\t\t\t}\n\t\t},\n\t},\n})\n<\/script>\n\n<style scoped>\n.comments-action {\n\tpadding: 0;\n}\n</style>\n'],sourceRoot:""}]);const i=a},91462:(t,e,n)=>{n.d(e,{default:()=>x});var o=n(20144),r=n(49251),s=n(94534),a=n(59953),i=n(64024),m=n(31352);const c=(0,o.aZ)({components:{Comment:r.Z},mixins:[s.Z],props:{reloadCallback:{type:Function,required:!0}},methods:{onNewComment(){try{this.reloadCallback()}catch(t){(0,i.x2)((0,m.Iu)("comments","Could not reload comments")),a.Z.debug(t)}}}});var l=n(93379),u=n.n(l),d=n(7795),p=n.n(d),f=n(90569),h=n.n(f),C=n(3565),A=n.n(C),b=n(19216),w=n.n(b),y=n(44589),g=n.n(y),v=n(552),T={};T.styleTagTransform=g(),T.setAttributes=A(),T.insert=h().bind(null,"head"),T.domAPI=p(),T.insertStyleElement=w(),u()(v.Z,T),v.Z&&v.Z.locals&&v.Z.locals;const x=(0,n(51900).Z)(c,(function(){var t=this,e=t._self._c;return t._self._setupProxy,e("Comment",t._b({staticClass:"comments-action",attrs:{"auto-complete":t.autoComplete,"resource-type":t.resourceType,editor:!0,"user-data":t.userData,"resource-id":t.resourceId},on:{new:t.onNewComment}},"Comment",t.editorData,!1))}),[],!1,null,"fffab6ae",null).exports}}]);
//# sourceMappingURL=1462-1462.js.map?v=03cc0c51ba09241e2635