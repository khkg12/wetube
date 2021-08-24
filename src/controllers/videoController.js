import { reset } from "nodemon";

const fakeUser = {
  username: "yeom",
  loggedIn: false,
};

let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 3,
  },
];

export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos }); //첫번째 인자는 view의 이름, 두번째인자는 view파일에 보낼 변수 // home.pug를 렌더링 따로 views폴더를 import안해줘도 되는 이유는 express자체가 views폴더에서 렌더링할 파일을 찾도록 설계되어있기 때문
};

export const watch = (req, res) => {
  const { id } = req.params; // ES6문법을 사용한것, const id = req.params.id; 이 식과 동일
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching: ${video.title}`, video }); //view파일명을 지을 때 Watch이런 식으로 짓지말고 전부 소문자를 사용할것
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params; // videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit); 이 코드에서 request값의 id값을 정해주기 때문에 req.param.id가져올수 있음
  const { title } = req.body; // req.body가 값을 가져 form 내부의 input의 데이터를 가지려면 form되는 input이 이름을 가져야한다.
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: `upload Video` });
};

export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title, // title:title로 적어줘야하지만 이렇게 title만 써줘도 자바스크립트는 이해함
    rating: 0,
    comments: 0,
    createdAt: "right now",
    views: 0,
    id: videos.length + 1,
  };
  videos.push(newVideo);
  return res.redirect("/");
};
