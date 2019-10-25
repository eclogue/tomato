### 快速上手

> **注意** 本项目目前尚在 alpha 阶段，请勿使用在生产环境

---

eclogue 是在 ansible 基础上的扩展，在使用本系统前你需要先了解 ansible 及 yaml 语法。熟悉常用 CI 工具有助于你更好掌握 eclogue。

eclogue 使用前后端分离，前端 [cottage](https://github.com/eclogue/cottage) 在 [antd-admin](https://github.com/zuiidea/antd-admin) 基础上进行修改。
eclogue 项目本身已经集成了 cottage 编译后的静态文件，如果你需要修改请自行从[cottage](https://github.com/eclogue/cottage)下载源码编译

### 在线 demo
- url: [http://demo.ecloguelabs.com](http://demo.ecloguelabs.com)
- username: `natsume`
- password: `takashi`

### 安装
eclogue 使用 python3.4+ 开发，请勿在 python2.* 上运行，推荐使用 pipenv 安装, 隔离 python 版本。
eclogue 使用 mongodb 作为数据库，mongo gridfs 作为存储， redis 被用做任务分发队列。
- 从 github release 下载源码 或者 `git clone git@github.com:eclogue/eclogue.git` 
- `pip install pipenv` 如果你已安装 pipenv 请勿略此条
- `pipenv shell` 初始化 python 环境，python venv 环境将会安装在当前目录， 如果你需要请在`.env` 修改 `PIPENV_VENV_IN_PROJECT=0`
- `pipenv install` 安装 python 依赖包
- 在 `config/` 文件夹添加与`.env` 中 `ENV=development` 一致配置yaml文件。如果你 `development` 环境对应文件为`config/development.yaml`，`development.yaml` 将会覆盖 `default.yaml` 。
  修改 `mongodb` 与 `redis` 配置以适配你的服务
- `python manage.py bootstrap` 初始化项目（仅第一次运行需要执行）, 添加必要数据，如管理员，菜单权限
- `python manage.py start` 访问 http://localhost:5000/

### Docker
如果你使用 docker，一切将会很简单，eclogue 已经提供 Dockerfile
> 如果只你想在本地拉起服务，看一下这是什么个鬼，你只需 `docker-componse up`(前提是你已经安装了 docker-compose)

### 目录结构
```
├── config
├── eclogue
├── images
├── migrate
├── public
├── storage
│   ├── cache
│   ├── eclogue
│   ├── logs
│   └── tmp
└── tests
```
- `config` eclogue 配置文件，yaml 格式文件，默认是 default.yaml，会根据.env ENV 变量自动加载对应环境文件，例如ENV=development
会将 developement.yaml 加入配置并覆盖 default.yaml 里相同的配置项
- `eclogue` 项目主体文件夹，处理核心业务代码
- `images` 一些图片
- `migrate` 存放迁移数据，用户初始化及升级
- `public` cottage 项目编译后的前端文件
- `storage` eclogue 工作目录，包裹日志，缓存，playbook build, 及临时文件夹等


### 升级
eclogue 已经做好 migrate，但是没有做好升级的页面， 在以后的升级中将提供在线升级方式。具体查看changelog
