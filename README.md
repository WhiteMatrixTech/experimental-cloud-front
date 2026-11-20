experimental-cloud-front
实验云平台

本地开发

`npm run start`

若想更改api地址，使用命令`BAAS_BACKEND_LINK=xxxxx npm run start`启动

生产构建

`npm run build`

若想更改api地址，使用命令`BAAS_BACKEND_LINK=xxxxx npm run build`构建

外部登录

带`redirect`参数访问时会进入外部登录，登录成功后 access_token 会发送给`redirect`指向的站点。只有当前站点和`CHAIN_IDE_LINK`所在的站点可以作为`redirect`；需要允许其他站点时，使用`EXTERNAL_LOGIN_REDIRECT_ORIGINS=https://a.example.com,https://b.example.com`配置（多个站点用逗号分隔）
