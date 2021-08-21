import express from "express"; //자바스크립트는 모든 파일에서 자기만의 세계를 가지므로 꼭 espress를 import해줄것
import { see, edit, remove, uproad } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/uproad", uproad); //uproad가 위에 있는 이유는 밑의 id로 인식될수 있기 때문이다. 근데 (\\d+)이 정규식을 붙혀 id의 값이 숫자로만 받게 한다면 uproad의 위치는 어디에 있든 상관없다,
videoRouter.get("/:id(\\d+)", see); //비디오 라우터가 /videos/watch의 주소에 들어가면 다음의 함수실행 여기서 videos주소 생략이유는 server의 use함수때문
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/remove", remove);

export default videoRouter;
