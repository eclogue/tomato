# 权限管理
权限模型是 RBAC 模型，普通用户的权限都继承自角色（role）。管理可以创建任一角色并给该角色赋予相对应的权限。
这里需要指出的是，team 也拥有一个角色，团队成员自动从团队那里继承全部权限，所以在创建团队的时候尽量不要把全部权限赋予 team 的角色。可以根据需要给 team 的 master 多增加一个角色

![](http://pic.yupoo.com/craber_v/535f5da3/79e6aeeb.jpeg)

permission 里的模块对应左侧 sidebase 菜单

### 编辑

![](http://pic.yupoo.com/craber_v/e2c78b49/9aa965b6.jpeg)

