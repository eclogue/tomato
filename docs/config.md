## 常用配置项
### 调试
- debug=true 开启调试，生产环境请将此项设为 false

### 日志
`logging` 按照 python logging 模块格式配置，默认是写入文件及 stdout

### eclogue 工作目录

```yaml
workspace:
  tmp: {{ home_path }}/storage/tmp
  playbook: {{ home_path }}/storage/playbook
  base_dir: {{ home_path }}/storage/eclogue
  job: {{ home_path }}/storage/eclogue/jobs
  build: {{ home_path }}/storage/eclogue/builds
```

- tmp 临时文件夹
- playbook 用户从数据加载构建 ansible-playbook
- job 用户 job 的构建
- build 用于存放构建结果

### Vault secret
存在数据库的敏感信息都经 vault 加密后， 目前此只支持 string 的 secret
```yaml
vault:
  secret: xx
```

### Mongodb
mongodb client 连接配置
```yaml
mongodb:
  uri: 'mongodb://root:password@localhost/?authSource=admin&authMechanism=SCRAM-SHA-1'
  db: 'eclogue'
```

### Redis
redis client 连接配置
```yaml
redis:
  conn:
    host: localhost
    port: 6379
    decode_responses: !!bool "true"
```

### token
前端使用 jws token 和后端进行交互
```yaml
jwt:
  key: '2:sha212233ddf:50000$testset'
  iss: 'https://devops.eclogueio.com'
  aud: 'https://eclogueio.com'
  header:
    alg: 'HS256' # 加密方式
  exp: 604800 # 过期时间
```

### 任务
任务存储历史数，当快照数大于改数时，最早执行的任务快照将被删除
```yaml
task:
  history: 50
```
