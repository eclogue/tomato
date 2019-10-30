# CMDB
eclogue 没有复杂的资产模型，凡是 ansible 能到达的或者能被 ansible 所用的都是资产。

主要包括: 主机(host), 应用(App), Config(配置)

![](http://pic.yupoo.com/craber_v/260f04e4/dffd10e3.jpeg)
### inventory
inventory 即 ansible inventory。eclogue 允许动态加载 inventory，当主机下架时，ansible 巡检哨兵会自动下架 host 记录。

![](http://pic.yupoo.com/craber_v/e0f92b14/dc83f332.png)

eclogue 允许手动或者批量导入 hosts，提交表单后会执行 ansible setup 任务，从目标服务器拉取相关信息


#### 批量导入
优点：一次性批量完成。
缺点：无法填写单个 host 信息。
文件格式为 ansible 支持的格式：

![](http://pic.yupoo.com/craber_v/80ad0215/4c71392e.png)

#### 手动导入
优点：挨个填写 host 信息会更详细一些

![](http://pic.yupoo.com/craber_v/7aee5a52/f5835179.png)


### 应用
cmdb 的应用是真正会线上部署应用相关联的，而不是单独的模型。

支持的类型：
- `jenkins` jenkins 构建后的 artifacts 包
- `gitlab` gitlab-ci 构建后的 artifacts 包
- `docker` 有用目前尚未支持 k8s，docker 导出仅支持从容器中复制项目和原生 docker image
- `git` git repository
- `ansible-fetch` 通过 ansible 从远程拉取目录或文件

欢迎提 issue

### 配置中心
配置中心用户管理 ansible 全局变量。用于动态注册到 ansible-playbook 中。
这里的全局变量区别于 ansible-playbook 的全局变量。eclogue 可以创建很多个 playbook 项目,配置中心的全局变量可以注册并影响所有绑定的 playbook。
譬如说：在配置中心注册了一个 叫 mysql 的 配置:
```yaml
host: 127.00.1
port: 3306
user: develop
password: 123456
database: test
```
那么你可以在多个 playbook 项目中绑定该配置，playbook 在 build 的时候会自动注册到ansible 变量中去。如果你更改 mysql 的 password，那么你无需对每个 playbook 中引用的配置进行更改，下次构建的时候会自动拉取最新的mysql配置。
