import "./db"; // 나의 서버가 mongo에 연결될 수 있게 db자체를 import
import express from "express";
import morgan from "morgan";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import globalRouter from "./routers/globalRouter"; // ./ = 같은 위치 ex) server.js에서 ./이면 같은 위치인 constrollers, routers에 접근 ../ 상위 폴더

const PORT = 4000;

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug"); //view엔진을 pug로 설정 app의 설정을 원하는대로 설정가능
app.set("views", process.cwd() + "/src/views"); // 현재 작업 디렉토리를 뜻하고 그 위치는 package.json의 위치 거기에 +""값을 해주면 그 곳의 위치에 접근
app.use(logger);
app.use(express.urlencoded({ extended: true })); // 우리의 url이 시작하기전에, 즉 밑의 use를 거치기 전에 form에서 보내는 데이터를 인식하게 해주는 역할, 즉 req.body를 이해시킴
app.use("/videos", videoRouter);
app.use("/", globalRouter);
app.use("/users", userRouter);

const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
