import axios from 'axios';
import Vue from 'vue';
import jwt from 'jsonwebtoken';
import Pagination from '@/components/pagination/pagination';

export default {
    data: function (){
        return {
            rows: 3,
            cols: 5,
            w:window.innerWidth,
            h:window.innerHeight,
            xr: 1,
            yr: 1,
            currentPage: 1,
            games: [],
            showGame: false,
            selectedTab: 'All Games',
            tabLabels: [],
            currency: 'EUR',
            balance: 0.00,
            loaded: false,
            depositamount: 0,
            casinobalance: 0,
            depositmodal: false,
            cashoutmodal: false,
            page: '',
            url: '',
            tabSwitch: false,
            maxVisible : 7,
        }
    },
    mounted() {
        this.getGameList();
        this.casinoLogin();
    },
    methods: {
        chunk (arr, size) {
                return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
        },
        matrix (arr, rows, cols) {
            console.log(this.arr,rows,cols);
            const output = [];
            const list = this.chunk(arr, rows * cols);
            console.log('LIST ', list);
                for(let j = 0; j < list.length; j++) {
                    output[j] = this.chunk(list[j], cols);
                }
            return output;
        },
        resizeScreen() {
            var ww = window.innerWidth;
            var wh = window.innerHeight;
            this.xr = ww / this.w;
            this.yr = wh / this.h;
        },
        selectGame(game) {
            const self = this;
            const token = Vue.cookies.get('bet1_session');
            const decode = jwt.verify(token, 'xmX3bFvoZBuEewZNshnNndY95hlwLTow');
            opengame(game.gameId , game.gameLabel, game.gameBrand, game.gameTechnology, 'real', '1067', '600', '', 'en', decode.user_name, decode.user_currency);
        },
        selectBrand(game) {
            this.currentPage = 1;
            this.selectedTab = game;
        },
        getGameList() {
            const self = this;
            const endpoint = 'http://bet1-one.com/sportsapi/getgamelist';
            axios.get(endpoint).then((response) => {
                self.games = response.data.games;
                self.tabLabels = ['All Games', ...new Set(self.games.map(game => game.gameBrand))];
                self.showGame = true;
            });
        },
        prevPage() {
            this.currentPage--;
            if(this.currentPage <= 1)
                this.currentPage = 1;
        },
        nextPage() {
            this.currentPage ++;
            if(this.currentPage >= this.mainpages)
                this.currentPage = this.mainpages;
        },
        goToPage(pageNo) {
            this.currentPage = pageNo;
        },
        
        casinoLogin(isClose = false){
            const self = this;
            const token = Vue.cookies.get('bet1_session');
            const decode = jwt.verify(token, 'xmX3bFvoZBuEewZNshnNndY95hlwLTow');
            const username = decode.user_name;
            const endpoint = 'http://bet1-one.com/casino/casino_login.php';
            axios.post(endpoint, {username : username}).then((response) => {
                const result = response.data;
                console.log(response);
                if(result.status ==='OK'){
                    
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        isPageActive(page) {
            return this.currentPage === page;
        },
        toPage(page) {
            this.currentPage = page;
        },
    },
    computed: {
        filteredGames() {
            if(this.selectedTab === 'All Games') {
            return this.matrix(this.games, 3, 5);
            }
            else {
            const filterGames = this.games.filter(game => game.gameBrand === this.selectedTab)
            return this.matrix(filterGames, 3, 5);
            }
        },
        mainpages() {
            return this.filteredGames.length;
        },
        slideContainer() {
            console.log('CURENT ', this.currentPage,);
            return {
                width: `${this.mainpages * 100}%`,
                transform: `translateX(-${(this.currentPage - 1) * (100/this.mainpages)}%)`
            }
        },
        pageStyle() {
            return {
                width: `${ this.mainpages > 0?(100/this.mainpages):100}%`
            }
        },
        startPage() {
            if (this.currentPage === 1) {
                return 1;
            }
            if(this.mainpages <= this.maxVisible) {
                return 1;
            }
            if (this.currentPage === this.mainpages) {
                return this.totalPages - this.maxVisible + 1;
            }
            var mid = 0;
            var delta = 0;
            if(this.mainpages > this.maxVisible) {
                mid = Math.ceil(this.maxVisible/2);
                delta = this.maxVisible - (mid * 2);
            }
            else {
                mid = Math.ceil(this.mainpages/2);
                delta = this.mainpages - (mid * 2)
            }
            if(this.currentPage < mid + (1 + delta)) {
                return 1;
            }
            if(this.currentPage > (this.mainpages - (mid + delta))) {
                return this.mainpages - (2 * (mid + delta));
            }
            return this.currentPage - (mid + delta);
        },
        endPage() {
            return Math.min(this.startPage + this.maxVisible - 1, this.mainpages);
        },
        pages() {
            const range = [];
            for(var i = this.startPage; i <= this.endPage; i++){
                range.push({
                    name: i,
                    isDisabled: i === this.currentPage
                });
            }
            return range;
        },
    },
}