import { io, type Socket } from "socket.io-client";
import { AUTH_TOKEN } from "@/shared/const/constants";
import type { ChatsJoinResponse } from "@/shared/types/socketMessage";

let socket: Socket | null = null;

export default defineNuxtPlugin({
  name: "socket-plugin",
  enforce: "pre",
  async setup() {
    const config = useRuntimeConfig();
    const token = useCookie(AUTH_TOKEN);

    if (import.meta.client && !socket) {
      socket = io(config.public.SOCKET_URL, {
        autoConnect: true,
        query: {
          token: token.value,
        },
        transports: ["websocket"],

        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 1000,
        randomizationFactor: 0,
      });

      socket.on("connect", () => {
        console.info("✅ Успешно переподключились");
        if (!socket) return;
        _joinToChats(socket);
      });

      socket.on("connect_error", (err) => {
        console.warn("Ошибка соединения:", err.message);
      });

      socket.on("reconnect_attempt", (attempt) => {
        console.info(`Попытка переподключения #${attempt}`);
      });

      socket.on("reconnect", () => {
        console.info(`Переподключение успешно!`);
        if (!socket) return;
        _joinToChats(socket);
      });
    }

    const _joinToChats = (socket: Socket) => {
      socket.emit("chats:join");
      socket.on("chats:join", (msg) => {
        const messageJSON = convertSockMessageToJSON<ChatsJoinResponse>(msg);
        if (messageJSON.success) {
          console.log("Сообщения подключены");
        }
      });
    };

    const convertSockMessageToJSON = <T>(message: string | object): T => {
      if (typeof message === "object") return message as T;
      try {
        return JSON.parse(message) as T;
      } catch (e) {
        console.error("Ошибка при конвертации сообщения в JSON: ", message);
        throw e;
      }
    };

    return {
      provide: {
        socket,
        convertSockMessageToJSON,
      },
    };
  },
});
