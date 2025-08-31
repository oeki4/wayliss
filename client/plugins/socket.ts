import { io, type Socket } from "socket.io-client";
import { AUTH_TOKEN } from "@/shared/const/constants";
export default defineNuxtPlugin({
  name: "socket-plugin",
  enforce: "pre",
  async setup() {
    const config = useRuntimeConfig();
    const token = useCookie(AUTH_TOKEN);

    const socket: Socket = io(config.public.SOCKET_URL, {
      autoConnect: true,
      query: {
        token: token.value,
      },
      transports: ["websocket"],
    });

    const convertSockMessageToJSON = <T>(message: string | object): T => {
      if (typeof message === "object") return message as T;
      try {
        return JSON.parse(message) as T;
      } catch (e) {
        console.log("Ошибка при конвертации сообщения в JSON: ", message);
        throw e;
      }
    };

    return {
      provide: {
        socket: socket,
        convertSockMessageToJSON,
      },
    };
  },
});
