---
layout: post
title: README
post: 
  title: README
  type: article
---

[![Codeship Status for uhfun/Uhfun-Jekyll](https://app.codeship.com/projects/f6209f60-009c-0138-cf9c-6ab62c942013/status?branch=master)](https://app.codeship.com/projects/378092) [![Join the chat at https://gitter.im/uhfun_opoen_source/Uhfun-Jekyll](https://badges.gitter.im/uhfun_opoen_source/Uhfun-Jekyll.svg)](https://gitter.im/uhfun_opoen_source/Uhfun-Jekyll?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

<div style="text-align:center;margin:30px 0"><img src='https://uhfun.cn/assets/img/uhfun-jekyll logo.png' width = "280" height = "280" /></div>

　　Uhfun-Jekyll是一套基于Jekyll框架的模板，目前运行在 [UhfunBlog](https://uhfun.cn) 网站上。由于GitHub Pages 无法使用不支持的插件构建网站，如果想使用不支持的插件，需要在本地生成网站，然后将网站的静态文件推送到 GitHub。于是我选择了使用Codeship持续继承，自动提交编译后的静态文件到gh-pages分支，选择gh-pages 分支作为github pages的分支。

## 特性
* 首页分页
* 标签云
* 分类别归档(LIFE/TECH)
* 文章目录树
* 移动端适配
* 自动化持续集成

## 下载
````bash
git clone -b master https://github.com/uhfun/Uhfun-Jekyll.git
````

## 安装
````bash
brew install ruby
gem install bundler
gem install jekyll
````
> 安装Jekyll请参考 [Jekyll中文官网](http://jekyllcn.com/docs/installation/)

## 本地运行
````bash
jekyll server
# Server address: http://127.0.0.1:4000/
# Server running... press ctrl-c to stop.
````

## 添加文章
本地调试可以在_posts文件夹中添加xxx.md

## 持续集成
1. 前往[Codeship官网](https://codeship.com)，使用github账户注册账号
2. 创建Organization
3. 创建项目(New Project)，选择博客repository
4. 在Deploy为**master分支**添加自定义脚本
  ````bash
  echo '添加posts分支内文章' && cd .. && git clone -b _posts git@github.com:${CI_REPO_NAME}.git _posts && ls _posts && mv _posts/*.md clone/_posts
  echo '下载github pages 静态资源' && cd clone && git clone -b ${GH_PAGES_BRANCH} git@github.com:${CI_REPO_NAME}.git _site
  echo '删除除.git 外所有文件' && rm -rf _site/**/* || exit 0
  echo '重新编译生成静态文件' && bundle install && bundle exec jekyll build
  cd _site && echo '自定义域名' && echo ${CUSTOM_DOAMIN} > CNAME
  git config --global user.email ${GH_USER_EMAIL}
  git config --global user.name ${GH_USER_NAME}
  git add .
  git commit -m "Commit ${CI_COMMIT_ID} ${CI_COMMIT_MESSAGE} to branch ${GH_PAGES_BRANCH}" && git push origin ${GH_PAGES_BRANCH}
  ````
5. 选择触发机制(Build Triggers)
6. 配置环境变量(Environment)
  ````properties
  GH_PAGES_BRANCH=gh-pages
  CUSTOM_DOAMIN=uhfun.cn
  GH_USER_EMAIL=2512500628@qq.com
  GH_USER_NAME=uhfun   
  GH_PAGES_REPOSITORY=Uhfun-Jekyll
  ````

> 如果选择将文章保存在单独的分支，可以创建_posts分支
> 在Build Triggers中为**_posts分支**添加新的脚本
````bash
cd .. && echo '下载github pages 源文件' && git clone -b master git@github.com:${CI_REPO_NAME}.git _source && cd _source
echo '添加posts分支内文章' && mv ../clone/* _posts
echo '下载github pages 静态资源' && git clone -b ${GH_PAGES_BRANCH} git@github.com:${CI_REPO_NAME}.git _site
echo '删除除.git 外所有文件' && rm -rf _site/**/* || exit 0
echo '重新编译生成静态文件' && bundle install && bundle exec jekyll build
cd _site && echo '自定义域名' && echo ${CUSTOM_DOAMIN} > CNAME
git config --global user.email ${GH_USER_EMAIL}
git config --global user.name ${GH_USER_NAME}
git add .
git commit -m "Commit ${CI_COMMIT_ID} ${CI_COMMIT_MESSAGE} to branch ${GH_PAGES_BRANCH}" && git push origin ${GH_PAGES_BRANCH}
````



## 版权

````
Copyright (c) 2020 uhfun

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
````

