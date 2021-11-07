## 机房环境监测后台

此项目是一个简单的前后端分离项目,[前端](https://github.com/yujianyasuo/server_room_vue),[后端](https://github.com/yujianyasuo/server_room)

有以下功能

登陆,注册,验证码,表单显示,用户头像,图表

### 截图

![](https://raw.githubusercontent.com/yujianyasuo/server_room_vue/master/src/screenshots/img.png)

![](https://raw.githubusercontent.com/yujianyasuo/server_room_vue/master/src/screenshots/img_1.png)

![](https://raw.githubusercontent.com/yujianyasuo/server_room_vue/master/src/screenshots/img_2.png)

### Todo

- [x] 在header栏显示用户头像
- [x] JWT登陆鉴权
- [x] 添加设备开关状态
- [x] 添加预警功能
*预警功能只添加了温度,可能会有bug*
- [x] 添加消息盒

新增了用户可以邮箱登陆

修复了个人信息页

使用QQ邮箱登陆默认获取QQ头像

注册后自动登陆

优化逻辑,非管理员用户不再接收弹窗预警

优化了前端拦截器,代码更加清晰
