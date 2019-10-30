## Job 工作流程图
eclogue 持续部署原理都在这张图上，如果你看懂了这张图，基本已经熟悉了整套系统了。
<br/>
eclogue 的角色类似于堡垒机，后期也会添加堡垒机功能。这里eclogue 所在的机器简称 E 机器，你想要E能访问你远程机器前提是，E所持有的私钥在目标服务器存放了公钥。注意E持有的私钥。
所以在运行系统前务必先创建或者上传 E 机器访问目标机器的私钥，具体参考[凭据](credential.md)模块。

<img src="http://pic.yupoo.com/craber_v/8a7d4d78/38982678.jpeg" alt="graph.png">

从上图可以看出，一个 Job 集成了 App, Config, Playbook, CMDB 等模块

- App 部署应用，支持从 jenkins，gitlab， docker， git 及远程服务拉取
- Config 即配置中心，保存一些全局配置。这里的全局配置区别于 playbook 的全局变量，playbook 的全局变量仅限一个 playbook 项目，而 eclogue 里的全局变量针对所有 playbook。
  eclogue 的全局变量动态注册，统一管理。这样做的目的是，一些敏感信息比如数据库账号，云存储，wechat scrept，一般是多个项目同时使用的。
  使用注册中心注册到 playbook 后，你无需在每个 playbook 项目里维护这些变量，以后增删改查都直接在注册中心统一管理，一旦配置中心配置更改自动下发到所有引用项目。
- Playbook 即 ansible-playbook，所见即所得，动态加载，支持 galaxy 导入及本地上传，支持在线编辑，上传二进制大文件。个人觉得 ansible awx 最不爽的一点是他的 ansible-playbook 管理使用特别麻烦。
- CMDB eclogue CMDB 的模型比较简单，凡是 ssh 能连接的就是资源，所有资源都能配 ansible 使用。CMDB 支持 ansible inventory file 导入，无需编辑机器信息，自动巡检，无法连接的机器自动下线。
