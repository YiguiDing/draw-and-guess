import { GameClient } from "@/GameClient";
import { socket } from "@/socket";
import { ref } from "vue";

const gameClient = new GameClient(socket);

export const gameClientRef = ref(gameClient);

gameClientRef.value.run();