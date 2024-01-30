## 数据来源
[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)
## 预览地址
[千子音乐](http://www.music.chiko.website/)
## 部分截图展示
### 首页
![image](https://github.com/chen-ziwen/chiko_music/assets/85820568/30ede7f4-afe5-44ed-a8be-99174532eefa)
### 排行榜
![image](https://github.com/chen-ziwen/chiko_music/assets/85820568/9568f480-be76-4179-ad36-02a516b6524d)
### 歌单
![image](https://github.com/chen-ziwen/chiko_music/assets/85820568/398e770e-0168-49eb-b3b2-8519ccd68d46)
### 歌手
![image](https://github.com/chen-ziwen/chiko_music/assets/85820568/a926b99a-b62d-4bcb-ad0a-5468b071dd61)
![image](https://github.com/chen-ziwen/chiko_music/assets/85820568/1b33105c-8bd1-45d4-96f1-fd7c0e5844d0)
## 目录结构
<code>
    
chiko_music
├── dist
│   └── assets
│       └── images
│           ├── singer
│           └── test
├── public
│   └── assets
│       └── images
│           ├── singer
│           └── test
└── src
    ├── api
    │   └── http
    ├── assets
    │   ├── css
    │   ├── font
    │   │   └── fonticon
    │   ├── image
    │   ├── scss
    │   └── ts
    ├── components
    │   ├── common
    │   │   ├── loading
    │   │   └── svgIcon
    │   │       └── svg
    │   ├── discover-music
    │   ├── home-page
    │   ├── lyric
    │   ├── mv
    │   ├── new-disc
    │   ├── progress-bar
    │   ├── rank
    │   ├── search
    │   ├── singer
    │   └── song-sheet
    ├── directives
    ├── models
    ├── router
    ├── store
    ├── util
    └── views
        ├── discover-music
        ├── home-page
        ├── mv
        ├── rank
        ├── search
        ├── singer
        └── song-sheet
<code>
    
## 安装运行
```git
$ git clone https://github.com/Binaryify/NeteaseCloudMusicApi
$ cd NeteaseCloudMusicApi
$ npm install
$ node app.js // 运行接口服务器 运行成功才能拿到数据
$ git clone git@github.com:chen-ziwen/chiko_music.git
$ cd CHIKO_MUSIC
$ npm install
$ npm run dev
```

