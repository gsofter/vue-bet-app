import Vue from 'vue';
Vue.component('Pagination', {
    props: {
        value: {
            type: Number,
            default: 1
        },
        maxVisible: {
            type: Number,
            required: false,
            default: 7
        },
        totalPages: {
            type: Number,
            default: 1
        }
    },
    methods: {
        prevPage() {
            if (this.value > 1) {
                this.$emit('input', this.value - 1);
            }
        },
        nextPage() {
            if (this.value < this.totalPages) {
                this.$emit('input', this.value + 1);
            }
        },
        toPage(page) {
            this.$emit('input', page);
        },
        isPageActive(page) {
            return this.value === page;
        }
    },
    computed: {
        startPage() {
            console.log(this.totalPages);
            if (this.value === 1) {
                return 1;
            }
            if(this.totalPages <= this.maxVisible) {
                return 1;
            }
            if (this.value === this.totalPages) {
                return this.totalPages - this.maxVisible + 1;
            }
            var mid = 0;
            var delta = 0;
            if(this.totalPages > this.maxVisible) {
                mid = Math.ceil(this.maxVisible/2);
                delta = this.maxVisible - (mid * 2);
            }
            else {
                mid = Math.ceil(this.totalPages/2);
                delta = this.totalPages - (mid * 2)
            }
            if(this.value < mid + (1 + delta)) {
                return 1;
            }
            if(this.value > (this.totalPages - (mid + delta))) {
                return this.totalPages - (2 * (mid + delta));
            }
            return this.value - (mid + delta);
        },
        endPage() {
            return Math.min(this.startPage + this.maxVisible - 1, this.totalPages);
        },
        pages() {
            const range = [];
            for (let i = this.startPage; i <= this.endPage; i += 1) {
            range.push({
                name: i,
                isDisabled: i === this.currentPage
            });
            }
            return range;
        }
    }
});