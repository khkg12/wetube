import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {}); // mongodb에 새로운 database를 만드는 코드로 터미널에 mongo를 입력하고 연결되어있는 주소를 얻은 뒤, 그 주소뒤에 /nameofnewdatabase를 입력해주면 됨. 내경우에는 wetube

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connect to DB");
const handleError = (error) => console.log(".❌ DB error", error);
db.on("error", handleError); // 에러발견시 발생하는 "error" event on:여러번 계속 반복
db.once("open", handleOpen); // 우리의 서버와 db서버가 연결될 때, 즉 connection이 열릴 때 "open" event 발생, once: 딱 한번만 실행
