<template>
	<div class="Whiteboard">
		<canvas id="canvas"></canvas>
	</div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';

import { gameClientRef } from "@/client"

onMounted(() => {
	gameClientRef.value.whiteboard.init("canvas").start();
})
</script>
<style lang="less">
.Whiteboard {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 10px;

	#canvas {
		max-width: 100%;
		max-height: 100%;
		background-color: white;
		box-shadow: 0px 0px 10px gray;
	}
}
</style>