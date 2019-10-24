# Job
Job 工作原理请参见 [Job流程图](flow.md)

### 创建 playbook job
步骤 1：创建模板
![](http://pic.yupoo.com/craber_v/7f95329a/720c3a00.png)
步骤 2： 添加额外信息
![](http://pic.yupoo.com/craber_v/1d231c43/b69d46aa.png)

**注意** 在点击 preview 最好选择一个的 inventory host，preview 将会同步执行 ansible-playbook dry-run

参数基本和 ansible-playbook 一致，但是会有一些区别

- entry ansible-playbook 入口文件，你选择了入口文件就标志着你选择了哪一个 playbook 项目
- inventory 支持从 cmdb 加载或者使用文件
- app 即 CMDB 模块下创建的应用
- sshkey 来时 credential 凭据模创建的 ssh 私钥
- more options: 你可以自定义 ansible 参数，详情请查看 ansile-playbook --help,
  接受 yaml 格式，more options 提交的参数和表单里提交的参数重叠，将会覆盖表单里的参数。如 --list-hosts 对应：
```yaml
list-hosts: true
```
- schedule 计划任务使用 crontab 格式
- notify 是任务执行后的通知，你可以选择以何种形式发送通知


### 查看 && 手动运行Job
job 创建后你可以在 list 页面点击名称进入 job 详细页

![](http://pic.yupoo.com/craber_v/20f0ebdb/b771b1de.png)

可以在此处查看job 运行记录，最后一次运行日志，以及手动运行 job。点击右侧 history 的列表日期将会进入 Task 运行详细页面

你可以在运行的历史里 rerun 任一节点的任务，该任务不受当前 job template 及 playbook 影响，以快照形式从存储中加载并执行。

### 创建 adhoc job
 adhoc job 比较简单，`more options` 参见 playbook `more optiobns`
 ![](http://pic.yupoo.com/craber_v/b3f8454f/a7a5baf5.jpeg)

### console
你可以在 console 运行一些简单的任务，由于目前还是加入 socket 支持，console 以 http 请求形式同步运行，所以不要在此处运行耗时长的任务
![](http://pic.yupoo.com/craber_v/0516b06b/7bd35a4e.png)
