### eclogue
eclogue（牧歌），基于 ansible 的 devops 平台。让 ansible 更简单易用，WYSIWYG

**~~最初目的~~**：
- 提供一个 ansible tower(awx)外更多选择 ansible web platform（仅个人认为觉得 awx 太难掌控）

### Feature
- 安装简单，除mongodb， redis 外无任务附加依赖
- 更简单的 ansible-playbook 管理， 所见即所得， 动态 inventory 加载， 再无需挨个修改 inventory 文件
- 更好的日志追踪，让 ansible 任务有迹可循
- 更好配置管理，核心配置从注册中心自动注册至项目，隔离开发者与线上配置，再也不用担心程序员删掉数据库跑路了，不用担心 s3 bucket 有一天没了。
- 更便捷的持续部署，滚动更新， 秒级回滚历史任一版本，对接 jenkins, gitlab-ci, drone ...让 CI 做 CI 该做的事。（实验性功能）
- inventory 既是资产，更简单 cmdb 模型，哨兵巡逻，自动发现，自动报警
- 兼容 crontab 格式计划任务
- RBAC 权限模型

### Install
docker-compose：
- `docker-compose up -d`

本地安装
- `pip install -r > requirements.txt` 安装依赖
- `docker-compose -f docker/docker-compose-db.yaml up -d` 拉起数据库服务(如果你已安装 mongodb 和 redis 请勿略)
- `python manage.py start` dev 环境拉起api 服务
- `python manage.py woker` 启动 worker
- `python manage.py --help` 查看更多选项




### Docker
`docker-composer up` visit http://localhost:5000/

### Document
not ready

### Demo
[http://demo.sangsay.org](http://demo.sangsay.org)

- username: natsume
- password: takashi
### Digagram

![image](https://raw.githubusercontent.com/eclogue/eclogue/master/images/graph.png)

### Community
QQ 群：362847712

### Donate
江山父老能容我，不使人间造孽钱

![image](https://raw.githubusercontent.com/eclogue/eclogue/master/images/donate.JPG)

### License
GPL-3.0
