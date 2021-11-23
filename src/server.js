import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import rootRouter from "./routers/rootRouter"; // ./ = 같은 위치 ex) server.js에서 ./이면 같은 위치인 constrollers, routers에 접근 ../ 상위 폴더
import { localMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug"); //view엔진을 pug로 설정 app의 설정을 원하는대로 설정가능
app.set("views", process.cwd() + "/src/views"); // 현재 작업 디렉토리를 뜻하고 그 위치는 package.json의 위치 거기에 +""값을 해주면 그 곳의 위치에 접근
app.use(logger);
app.use(express.urlencoded({ extended: true })); // 우리의 url이 시작하기전에, 즉 밑의 use를 거치기 전에 form에서 보내는 데이터를 인식하게 해주는 역할, 즉 req.body를 이해시킴

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false, // 세션이 새로만들어지고 수정된 적이 없을 때를 uninitalized라고 함. 즉 세션이 수정되었을 때, 즉 로그인되었을때만 저장하기 위해 false로 설정한 것
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }), // mongodb에 sessions이라는 데이터값을 저장할수 있게해주는 코드
    /* cookie: {
      maxAge: 20000, // 쿠키의 만료시간을 설정하는 코드로 20000이면 20초, 즉 로그인하고 20초뒤에 로그아웃되며 쿠키가 사라짐.
    }, */
  })
); // req.session을 나타낼수 있게해줌, session이란 백엔드와 브라우저 사이에서 주고받은 정보값

app.use(localMiddleware);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
