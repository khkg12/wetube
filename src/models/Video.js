// models을 만든이유 : database에게 우리의 데이터의 정보를 넘겨줘야하기 때문, 예를 들어 모델 Video.js은 Video의 작성자
// 는 있는가? 그렇다면 그 작성자의 이름은 문자열인가? 이러한 정보를 db에 넘겨줘야하기 때문에 models이 필요함.
import mongoose, { startSession } from "mongoose";

// video데이터의 형태 지정
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, trim: true, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now }, // Date.now에 ()를 빼는 이유는 바로실행시키지 않기위해서. 즉, mongoose는 새로운 video를 생성했을때만 실행
  hashtags: [{ type: String, trim: true }], // trim은 입력문자열값 앞이나 뒤에 빈칸이 존재하면 제거해주는 역할
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema); // mongoose.model로 database 모델 만들기 : 첫번째 인수애 name, 그리고 두번째 인수에 작성한 schma

export default Video; // 이제 우리 서버에서 사용할 수 있게 export처리, server.js에서 import
