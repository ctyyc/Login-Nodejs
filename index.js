const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');

const { User } = require("./models/User");
const { auth } = require('./middleware/auth');

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("mongodb is connect..."))
  .catch((err) => console.log(err))

app.get('/', (req, res) => res.send('Hello World! Node.js!'))

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {
  // 이메일을 DB에서 확인
  User.findOne({email: req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "Email does not exist."
      })
    }

    // 비밀번호 일치여부 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) return res.json({
        loginSuccess: false, 
        message: "Passwords do not match."
      })

      // 비밀번호가 일치하다면(로그인 성공), 토큰 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        // 토큰을 쿠키에 저장
        res.cookie("x_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id
        })
        
      })
    })
  })
})



app.get('/api/users/auth', auth, (req, res) => {
  // auth 인증을 마친 경우만 실행
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, user) => {
    if(err) return res.json({success: false, err});
    return res.status(200).send({
      success: true
    })
  })

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})