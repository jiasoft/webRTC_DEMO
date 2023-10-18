# 基于 Node.js 的 lts镜像
FROM node:20.8.1

# 定义环境变量
ENV WORKDIR=/data/node/app
ENV NODE_ENV=production
ENV NODE_PORT=3000

# 创建应用程序文件夹并分配权限给 node 用户
RUN mkdir -p $WORKDIR && chown -R node:node $WORKDIR

# 设置工作目录
WORKDIR $WORKDIR

# 设置活动用户
USER node

# 复制 package.json 到工作目录
COPY --chown=node:node package.json $WORKDIR/

# 安装依赖
RUN npm install && npm cache clean --force

# 复制其他文件
COPY --chown=node:node . .

# 暴露主机端口
EXPOSE $NODE_PORT

# 应用程序启动命令
CMD [ "node", "./server.js" ]

# docker image build -t node-server .
# docker run -it --rm --name node-server -p 3000:3000 -p 3001:3001 node-server

# docker images 列表镜像
# docker image rm

# docker start node-server 启动
# docker restart node-server 重启
# docker stop node-server 停止
# docker kill node-server 强制停止
# docker logs
# docker top