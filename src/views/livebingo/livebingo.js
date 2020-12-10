import Vue from 'vue';
import i18n from '@/i18n';
import jwt from 'jsonwebtoken'
export default {
    name: 'Casino',
    mounted () {
        const ctoken = Vue.cookies.get('bet1_session');
        const decoded = jwt.verify(ctoken, 'xmX3bFvoZBuEewZNshnNndY95hlwLTow');
        const userid = decoded.user_id;
        const username = decoded.user_name;
        // const currency = decoded.user_currency;
        var token = jwt.sign({
            "apiKey": 'sXjeTMJi',
            "game": 1,
            "iat": Math.floor(Date.now() / 1000),
            "exp": Math.floor(Date.now() / 1000) + (60 * 60),
            "user": {
                "id": userid,
                "name": username,
                "currency": "TRY ",
                "locale": "tr",
                "last_name": "Surname",
                "country" : "TR",
                "address" : "Some street address 1-23", "dob" : "1980-01-01",
                "gender" : "m"
            }
        }, 'e54b5259a22d5ab1a94398d70dd41960');
        
        (function(l,i,v,e,t,c,h){
            l['LGFrameObject']=t;l[t]=l[t]||function(){(l[t].q=l[t].q||[]).push(arguments)},
            l[t].l=1*new Date();c=i.createElement(v),h=i.getElementsByTagName(v)[0];
            c.async=1;c.src=e;h.parentNode.insertBefore(c,h)
        })
        (window,document,'script',('//static.lgio.net/lg-f.js?v='+(Date.now())),'lgf');
            lgf('config', {
            container: 'lgf-container',
            origin: '',
            params: {
                sign:  token,
                homepage: '',
                cashierUrl: '',
                room: '',
            },
        });
    },
}