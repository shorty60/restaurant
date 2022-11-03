# My Restaurents List 我的餐廳清單

此專案可讓使用者看到餐廳清單、詳細餐廳資訊。

## Features 功能描述

- 使用者註冊我們的網站後可開始使用我們的服務，也可以使用FB或Google登入
- 使用者登入後可以在首頁看到他收藏的餐廳和它們的簡單資料: 包含餐廳名、餐廳類別、圖片、評分，可自訂顯示方式排序
- 使用者可以新增他的收藏餐廳
- 使用者可依照餐廳名稱及餐廳類別搜尋珍藏餐廳
- 使用者可檢視個別餐廳詳細資訊，包含:類別、地址、電話、描述、圖片以及 Google Map 地圖
  - 在地址列點選 飛機圖示 可打開 google map 查看位置詳細資料以及規劃路線
- 您也可以修改目前已有的餐廳資料，告訴我們最即時詳盡的餐廳資訊
- 可以移除餐廳資料


## Screen Photos 專案畫面

#### 登入

![登入](https://github.com/shorty60/restaurant/blob/main/public/image/Login.jpg)

#### 首頁

![首頁](https://github.com/shorty60/restaurant/blob/main/public/image/index.jpg)

#### 搜尋

![搜尋](https://github.com/shorty60/restaurant/blob/main/public/image/search.jpg)

#### 詳細資料

![詳細資料](https://github.com/shorty60/restaurant/blob/main/public/image/show.jpg)

#### 新增

![詳細資料](https://github.com/shorty60/restaurant/blob/main/public/image/new.jpg)

## Getting Started 開始

### Prerequisites 環境建置與需求

如果您是 windows 使用者，但尚未安裝 git bash，請先安裝 git bash 以進行下面指令列操作

- [git](https://git-scm.com/) - click 'Download for windows'

### Installing 專案安裝

1.開啟您的終端機(Terminal)或 git-bash(for Windows) 將此專案 clone 到本機位置並執行:

```
git clone https://github.com/shorty60/restaurant.git
```

2.移動至專案資料夾

```
cd restaurant //切至專案資料夾
```

3.安裝專案 npm 套件

```
npm install  //安裝套件
```

4.設定環境變數，請參考.env.example範例新增一個.env檔案

```
FACEBOOK_APP_ID=SKIP
FACEBOOK_APP_SECRET=SKIP
FACEBOOK_CALLBACK=http://localhost:3000/auth/facebook/callback
MONGODB_URI=mongodb://localhost/restaurant-list
SECRET="Jhu9*&#Yt"
GOOGLE_CLIENT_ID=SKIP
GOOGLE_CLIENT_SECRET=SKIP
GOOGLE_CALLBACK=http://localhost:3000/auth/google/redirect
PORT=3000

```

5.寫入種子資料

```
npm run seed
```

6.開啟程式

```
npm run start  //執行程式
```

7.若終端機(for Mac OS)或 git bash(for windows)顯示

```
Restaurant List is listening on http://localhost:3000
```

即啟動完成，請至[http://localhost:3000](http://localhost:3000)開啟網站

8.可使用下面兩個使用者帳號測試

```
User1
email: user1@example.com
password: 12345678
-----

User2
email: user2@example.com
password: 12345678

```

9.中斷伺服器連線，請按

```
ctrl + c
```

## Built With 開發環境及套件

- [Node.js](https://nodejs.org/zh-tw/download/) - 版本 16.17.0
- [Express](https://www.npmjs.com/package/express) - Node.js Web 應用程式架構，版本 4.16.4
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM，版本 6.6.3

## Authors 開發人員

- [開發者](https://github.com/shorty60) - Shorty Lin
