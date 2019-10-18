## manage.py 文件命令

### migrate
用于构建数据，迁移。
- `python manage.py migrate setup` 运行更新，如果已经执行过的数据将不会跳过
- `python manage.py migrate rollback {{ uuid|version }}` 指定回滚指定文件或者指定 version
- `python manage.py migrate generate` 生成迁移模板

### start
dev 环境拉起服务， 默认为 http://localhost:5000

### server
生产环境拉起服务， 默认为 http://localhost:5000。建议使用 nginx 做一层代理，方便横向扩展

### worker
开启 task worker 消费者
