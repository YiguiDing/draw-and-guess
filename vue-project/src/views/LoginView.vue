<script  lang="ts" setup>
import { gameClientRef } from "@/client"
import { onMounted, ref } from "vue";
import { layer } from "@layui/layui-vue";
import router from "@/router";


// 已经登录则跳转
onMounted(async () => {
	if (await gameClientRef.value.isLogin()) {
		router.push("/home")
		console.log("hhh");
	}
})


// 登录
let nickName = ref("");
async function loginHandler() {
	if (await gameClientRef.value.login(nickName.value)) {
		layer.notifiy({ title: "登录成功" })
		router.push("/home")
	} else {
		layer.notifiy({ title: "登录失败" })
	}
}


</script>
<template>
	<div class="container">
		<el-card>
			<lay-input v-model="nickName" placeholder="昵称" @keyup.enter="loginHandler"></lay-input>
			<el-button type="success" @click="loginHandler">进入游戏</el-button>
		</el-card>
	</div>
</template>
<style lang="less">
.container {
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;

	.el-card {
		text-align: center;

		.el-button {
			margin-top: 10px;
		}
	}
}
</style>