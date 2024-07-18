// 포스트 관련 라우터와 미들웨어 설정

const Router = require("koa-router");
const postsCtrl = require("./postsCtrl");
const checkLoggedIn = require('../../lib/checkLoggedIn')
const multer = require('@koa/multer')
const path = require('path');

const posts = new Router();

// 이미지 업로드 스토리지 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const destPath = path.join(__dirname, '..', '..', '..', 'uploads'); 
      console.log('File destination path:', destPath);
      cb(null, destPath);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const filename = path.basename(file.originalname, ext) + Date.now() + ext;
      console.log('File name:', filename);
      cb(null, filename);
    }
  });

const upload = multer({ storage: storage });

// 라우터: /api/posts
posts.get('/', postsCtrl.list) // postList
posts.post('/', checkLoggedIn, postsCtrl.write) // 순서대로 실행함. checkloggedin에 return을 next를 줬기때문에

// 이미지 업로드 라우터
posts.post('/upload', checkLoggedIn, upload.single('image'), postsCtrl.uploadImage)

// 결제 라우터
posts.post('/verifyIamport/:imp_uid', checkLoggedIn, postsCtrl.verifyIamport)

// 라우터: /api/posts/:id
const post = new Router();
post.get('/', postsCtrl.read) // post
post.delete('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.remove) // delete
post.patch('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.update) // 

posts.use("/:id", postsCtrl.getPostById, post.routes()) // id 검사하는것 추가



module.exports = posts
