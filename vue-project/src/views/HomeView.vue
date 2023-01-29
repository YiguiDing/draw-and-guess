<script setup lang="ts">
import Whiteboard from "@/components/Whiteboard.vue"
import { gameClientRef } from "@/client"
import router from "@/router";
import { onMounted, ref } from "vue";
import { layer } from "@layui/layer-vue";

// 未登录则跳转
onMounted(async () => {
	if (!await gameClientRef.value.isLogin()) {
		router.push("/login")
	}
})

let gameAnswer = ref("");
let dialogVisible = ref(false)
async function dialogConfirm() {
	if (gameAnswer.value.length != 0 && await gameClientRef.value.startGame(gameAnswer.value)) {
		layer.notifiy({ title: "设置成功：游戏开始" })
		dialogVisible.value = false
	} else
		layer.notifiy({ title: "设置失败" })
}


let guessAnswer = ref("");
let guessDialogVisible = ref(false)
async function guessDialogConfirm() {
	if (guessAnswer.value.length != 0 && await gameClientRef.value.guessAnswer(guessAnswer.value)) {
		layer.notifiy({ title: "猜对了" })
		guessDialogVisible.value = false
	} else
		layer.notifiy({ title: "猜错了" })
}
</script>

<template>
	<div class="container">
		<div class="left">
			<lay-card class="users">
				<template v-slot:body>
					<el-button v-if="gameClientRef.isMaster" type="success"
						@click="dialogVisible = true">开始游戏</el-button>
					<el-button v-else-if="!gameClientRef.isRunning" type="primary"
						@click="gameClientRef.becomeMaster()">主持游戏</el-button>
					<el-button v-else type="primary" @click="guessDialogVisible = true">猜一猜</el-button>

					<el-button v-if="gameClientRef.isRunning" type="success" text bg>游戏已开始</el-button>
					<el-button v-else type="primary" text bg>游戏已暂停</el-button>
				</template>
			</lay-card>

			<lay-card class="users">
				<template v-slot:title>
					玩家列表
				</template>
				<template v-slot:body>
					<div v-for="item in gameClientRef.usernames">
						{{ item }}
					</div>
				</template>
			</lay-card>
		</div>
		<div class="main">
			<Whiteboard />
		</div>
	</div>
	<el-dialog v-model="dialogVisible" title="开始游戏" width="30%">
		<lay-input v-model="gameAnswer" placeholder="设置答案"></lay-input>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">
					取消
				</el-button>
				<el-button type="primary" @click="dialogConfirm">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
	<el-dialog v-model="guessDialogVisible" title="猜一猜" width="30%">
		<lay-input v-model="guessAnswer" placeholder="答案"></lay-input>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="guessDialogVisible = false">
					取消
				</el-button>
				<el-button type="primary" @click="guessDialogConfirm">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>

</template>

<style lang="less" scoped>
.container {
	background-color: #b3e19d;

	.main,
	.left {
		height: 100%;
		min-width: 200px;
	}

	.users {
		margin: 10px;
		box-shadow: 0 0 5px gray;
	}
}
</style>