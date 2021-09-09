import Video from "../models/Video";

//Video.find({}, (error, videos) => { <- callback함수 : 단점으로 function안에 fun이들어가기때문에 깔끔하지않음, 따라서 이번 프로젝트에선 promise사용
// {}는 serch terms을 나타내는데 비어있으면 모든 형식을 찾음

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" }); // callback과는 다르게(callback은 Video.find, 즉 db를 찾는과정이 마지막임) javascript가 db를 찾는것을 기다려줌 db로부터 데이터를 받을때까지
  // await 코드에 에러가 발생하면 아래위 return코드는 실행되지 않고 catch 부분의 return 코드가 실행된다.
  return res.render("home", { pageTitle: "Home", videos }); //첫번째 인자는 view의 이름, 두번째인자는 view파일에 보낼 변수 // home.pug를 렌더링 따로 views폴더를 import안해줘도 되는 이유는 express자체가 views폴더에서 렌더링할 파일을 찾도록 설계되어있기 때문
}; // 한 function안에는 render, send와 같은 함수를 한개만 사용가능하다. 실수하지않기 위해 return을 붙힐 것. return 자체는 중요하지않고 render,send등 함수의 호출이 중요!

export const watch = async (req, res) => {
  const { id } = req.params; // ES6문법을 사용한것, const id = req.params.id; 이 식과 동일
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." }); // 비디오가 존재하지 않을 경우 리턴하는 코드
  }
  return res.render("watch", { pageTitle: video.title, video }); //view파일명을 지을 때 Watch이런 식으로 짓지말고 전부 소문자를 사용할것
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id); // 이 경우 exists는 사용하기 적합하지 않다. 이유는 Edit에 video object를 보내줘야하기 때문
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." }); // 비디오가 존재하지 않을 경우 리턴하는 코드
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const { id } = req.params; // videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit); 이 코드에서 request값의 id값을 정해주기 때문에 req.param.id가져올수 있음
  // const { title } = req.body; req.body가 값을 가져 form 내부의 input의 데이터를 가지려면 form되는 input이 이름을 가져야한다.
  const video = await Video.exists({ _id: id }); // exixts의 경우 video object가 필요한 것이 아닌 video object의 존재 유무만 확인하면 됨
  const { title, description, hashtags } = req.body;
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  }); // 첫번째 인수엔 업데이트하고자하는 영상의 id, 두번째 인수엔 업데이트할 내용
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: `upload Video` });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body; // req.body는 post할 떄 입력값을 나타냄
  try {
    await Video.create({
      title, // title:title로 적어줘야하지만 javascript는 이를 이해함, 하지만 title의 이름이 다르면 꼭 적어줘야함
      description,
      // createdAt: Date.now(), // Date.now()는 1970년부터 현재까지의 milliseconds값, default값을 설정해주었기 때문에 굳이작성할필요없음
      hashtags: Video.formatHashtags(hashtags),
    });
    // const dbVideo = await video.save(); // video가 mogoose model이기 때문에 가능한 기능, promise를 return. 그리고 async-await를 통해 데이터가 db에 저장되고 사용가능해지는 시간동안 기다려줌 하지만 위 코드처럼 const로 video를 js로 설정하지않고 Video.create를 사용하면 필요없음
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: `upload Video`,
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"), // 정규식 사용코드:   keyword가 포함된 제목을 찾아줌, 여기서 i의 역할은 대소문자의 구별을 없애는 것, 즉 Welcome이든 welcome이든 같이 탐색됨
      },
    });
  }
  return res.render("search", { pageTitle: `Search`, videos });
};
