
<template>
    <canvas class="like" ref="canvasRef" id="container"></canvas>
</template>

<script setup>
import { ref, onMounted } from "vue"
import LikeEffect from './index'

const canvasRef = ref()


onMounted(() => {
    canvasRef.value.width = window.innerWidth
    canvasRef.value.height = window.innerHeight
    const likeEffect = new LikeEffect(canvasRef.value)
    likeEffect.render()
})
</script>

<style lang="less">
.like {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
