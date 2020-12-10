import Vue from 'vue';
import jwt from 'jsonwebtoken'
import JQuery from 'jquery'
let $ = JQuery

export default {
    data : {
        url : '',
    },
    mounted () {
        const self = this;
        const token = Vue.cookies.get('bet1_session');
        const decode = jwt.verify(token, 'xmX3bFvoZBuEewZNshnNndY95hlwLTow');
        const opID = 32620;
        self.url = 'https://tables.kasoom.com/?token=' + decode.user_vtoken + '&operatorID=' + opID + '&application=lobby';
        var iframeElement = '<iframe id="livecasino_screen" src="' + self.url + '" width="100%" height="100%" allowfullscreen> </iframe>';
        $('#livecasino').append(iframeElement);
    },
    destroyed() {
        const self = this;
        self.url = '';
        $('#livecasino_screen').remove();
    },
    getURL() {
        return this.url;
    }
}