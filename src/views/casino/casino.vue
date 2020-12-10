<template>
    <div id="casino">
        <div class="game_screen text-center">
            <header v-show="showGame">
                <div class="button btn-brand" v-for="tab in tabLabels" :key="tab" @click="selectBrand(tab)" :class="selectedTab === tab ?'active': ''">
                    <div id="translate"></div>
                    <a href="#">{{tab}}</a>
                </div>
            </header>
            <section class="game_section" v-show="showGame">
                <div class="game_container" :style="slideContainer">
                    <div v-for="(page, index) in filteredGames" :key="index" class="game_page" :style="pageStyle">
                        <div v-for="(row, rowindex) in page" :key="`r_${index}_${rowindex}`" class="game_row">
                            <div v-for="(item, itemindex) in row" :key="`c_${index}_${rowindex}_${itemindex}`" class="game_card" @click="selectGame(item)">
                                <div :style="{backgroundImage: `url(${item.logoUrl})` }" class="game_img card"></div>
                                <div class="game_text">
                                    <span v-cloak><b>{{item.gameLabel}}</b></span>
                                    <span v-cloak><small>{{item.gameCategory}}</small></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer id="footer" v-show="showGame">
                <div class="left_block"></div>
                <div class="pagination">
                    <div class="arrow">
                        <button type="button" class="prevBtn" @click="prevPage"></button>
                    </div>
                    <div class="pagination-list">
                        <ul>
                            <li v-for="page in pages" class="pagination-item" :key="page.name">
                                <button type="button" @click="toPage(page.name)" :disabled="page.isDisabled" :class="{ active: isPageActive(page.name) }" v-cloak>
                                    {{ page.name }}
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div class="arrow">
                        <button type="button" class="nextBtn" @click="nextPage"></button>
                    </div>
                </div>
                <div class="left_block"></div>
            </footer>
        </div>
    </div>
</template>

<script src="./casino.js"></script>
<style lang="scss" scoped src="./casino.scss"></style>