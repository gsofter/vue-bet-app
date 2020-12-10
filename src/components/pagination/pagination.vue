<template>
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
</template>

<script src="./pagination.js"></script>
<style lang="scss" scoped src="./pagination.scss"></style>
