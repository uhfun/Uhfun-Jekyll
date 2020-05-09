<<<<<<< HEAD
<<<<<<< HEAD
#uhfun-jekyll
=======
# minima

*Minima is a one-size-fits-all Jekyll theme for writers*. It's Jekyll's default (and first) theme. It's what you get when you run `jekyll new`.

[Theme preview](https://jekyll.github.io/minima/)

![minima theme preview](/screenshot.png)

## Installation

Add this line to your Jekyll site's Gemfile:

```ruby
gem "minima"
```

And add this line to your Jekyll site:

```yaml
theme: minima
```

And then execute:

    $ bundle


## Contents At-A-Glance

Minima has been scaffolded by the `jekyll new-theme` command and therefore has all the necessary files and directories to have a new Jekyll site up and running with zero-configuration.

### Layouts

Refers to files within the `_layouts` directory, that define the markup for your theme.

  - `default.html` &mdash; The base layout that lays the foundation for subsequent layouts. The derived layouts inject their contents into this file at the line that says ` \{\{ content \}\} ` and are linked to this file via [FrontMatter](https://jekyllrb.com/docs/frontmatter/) declaration `layout: default`.
  - `home.html` &mdash; The layout for your landing-page / home-page / index-page. [[More Info.](#home-layout)]
  - `page.html` &mdash; The layout for your documents that contain FrontMatter, but are not posts.
  - `post.html` &mdash; The layout for your posts.

### Includes

Refers to snippets of code within the `_includes` directory that can be inserted in multiple layouts (and another include-file as well) within the same theme-gem.

  - `disqus_comments.html` &mdash; Code to markup disqus comment box.
  - `footer.html` &mdash; Defines the site's footer section.
  - `google-analytics.html` &mdash; Inserts Google Analytics module (active only in production environment).
  - `head.html` &mdash; Code-block that defines the `<head></head>` in *default* layout.
  - `header.html` &mdash; Defines the site's main header section. By default, pages with a defined `title` attribute will have links displayed here.

### Sass

Refers to `.scss` files within the `_sass` directory that define the theme's styles.

  - `minima.scss` &mdash; The core file imported by preprocessed `main.scss`, it defines the variable defaults for the theme and also further imports sass partials to supplement itself.
  - `minima/_base.scss` &mdash; Resets and defines base styles for various HTML elements.
  - `minima/_layout.scss` &mdash; Defines the visual style for various layouts.
  - `minima/_syntax-highlighting.scss` &mdash; Defines the styles for syntax-highlighting.

### Assets

Refers to various asset files within the `assets` directory.
Contains the `main.scss` that imports sass files from within the `_sass` directory. This `main.scss` is what gets processed into the theme's main stylesheet `main.css` called by `_layouts/default.html` via `_includes/head.html`.

This directory can include sub-directories to manage assets of similar type, and will be copied over as is, to the final transformed site directory.

### Plugins

Minima comes with [`jekyll-seo-tag`](https://github.com/jekyll/jekyll-seo-tag) plugin preinstalled to make sure your website gets the most useful meta tags. See [usage](https://github.com/jekyll/jekyll-seo-tag#usage) to know how to set it up.

## Usage

### Home Layout

`home.html` is a flexible HTML layout for the site's landing-page / home-page / index-page. <br/>

#### Main Heading and Content-injection

From Minima v2.2 onwards, the *home* layout will inject all content from your `index.md` / `index.html` **before** the **`Posts`** heading. This will allow you to include non-posts related content to be published on the landing page under a dedicated heading. *We recommended that you title this section with a Heading2 (`##`)*.

Usually the `site.title` itself would suffice as the implicit 'main-title' for a landing-page. But, if your landing-page would like a heading to be explicitly displayed, then simply define a `title` variable in the document's front matter and it will be rendered with an `<h1>` tag.

#### Post Listing

This section is optional from Minima v2.2 onwards.<br/>
It will be automatically included only when your site contains one or more valid posts or drafts (if the site is configured to `show_drafts`).

The title for this section is `Posts` by default and rendered with an `<h2>` tag. You can customize this heading by defining a `list_title` variable in the document's front matter.

--

### Customization

To override the default structure and style of minima, simply create the concerned directory at the root of your site, copy the file you wish to customize to that directory, and then edit the file.
e.g., to override the [`_includes/head.html `](_includes/head.html) file to specify a custom style path, create an `_includes` directory, copy `_includes/head.html` from minima gem folder to `<yoursite>/_includes` and start editing that file.

The site's default CSS has now moved to a new place within the gem itself, [`assets/main.scss`](assets/main.scss). To **override the default CSS**, the file has to exist at your site source. Do either of the following:
- Create a new instance of `main.scss` at site source.
  - Create a new file `main.scss` at `<your-site>/assets/`
  - Add the frontmatter dashes, and
  - Add `@import "minima";`, to `<your-site>/assets/main.scss`
  - Add your custom CSS.
- Download the file from this repo
  - Create  a new file `main.scss` at `<your-site>/assets/`
  - Copy the contents at [assets/main.scss](assets/main.scss) onto the `main.scss` you just created, and edit away!
- Copy directly from Minima 2.0 gem
  - Go to your local minima gem installation directory ( run `bundle show minima` to get the path to it ).
  - Copy the `assets/` folder from there into the root of `<your-site>`
  - Change whatever values you want, inside `<your-site>/assets/main.scss`

--

### Customize navigation links

This allows you to set which pages you want to appear in the navigation area and configure order of the links.

For instance, to only link to the `about` and the `portfolio` page, add the following to you `_config.yml`:

```yaml
header_pages:
  - about.md
  - portfolio.md
```

--

### Change default date format

You can change the default date format by specifying `site.minima.date_format`
in `_config.yml`.

```
# Minima date format
# refer to http://shopify.github.io/liquid/filters/date/ if you want to customize this
minima:
  date_format: "%b %-d, %Y"
```

--

### Enabling comments (via Disqus)

Optionally, if you have a Disqus account, you can tell Jekyll to use it to show a comments section below each post.

To enable it, add the following lines to your Jekyll site:

```yaml
  disqus:
    shortname: my_disqus_shortname
```

You can find out more about Disqus' shortnames [here](https://help.disqus.com/customer/portal/articles/466208).

Comments are enabled by default and will only appear in production, i.e., `JEKYLL_ENV=production`

If you don't want to display comments for a particular post you can disable them by adding `comments: false` to that post's YAML Front Matter.

--

### Social networks

You can add links to the accounts you have on other sites, with respective icon, by adding one or more of the following options in your config:

```yaml
twitter_username: jekyllrb
github_username:  jekyll
dribbble_username: jekyll
facebook_username: jekyll
flickr_username: jekyll
instagram_username: jekyll
linkedin_username: jekyll
pinterest_username: jekyll
youtube_username: jekyll
googleplus_username: +jekyll
rss: rss

mastodon:
 - username: jekyll
   instance: example.com
 - username: jekyll2
   instance: example.com
```

--

### Enabling Google Analytics

To enable Google Analytics, add the following lines to your Jekyll site:

```yaml
  google_analytics: UA-NNNNNNNN-N
```

Google Analytics will only appear in production, i.e., `JEKYLL_ENV=production`

--

### Enabling Excerpts on the Home Page

To display post-excerpts on the Home Page, simply add the following to your `_config.yml`:

```yaml
show_excerpts: true
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/jekyll/minima. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## Development

To set up your environment to develop this theme, run `script/bootstrap`.

To test your theme, run `script/server` (or `bundle exec jekyll serve`) and open your browser at `http://localhost:4000`. This starts a Jekyll server using your theme and the contents. As you make modifications, your site will regenerate and you should see the changes in the browser after a refresh.

## License

The theme is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
>>>>>>> initialize
=======
---
layout: post
title: README
post: 
  title: README
  type: article
---

<p align ='center' style='margin:30px 0;'><img src='https://uhfun.cn/assets/img/uhfun-jekyll logo.png' width = "280" height = "280" /></p>

[![Codeship Status for uhfun/Uhfun-Jekyll](https://app.codeship.com/projects/f6209f60-009c-0138-cf9c-6ab62c942013/status?branch=master)](https://app.codeship.com/projects/378092) [![Join the chat at https://gitter.im/uhfun_opoen_source/Uhfun-Jekyll](https://badges.gitter.im/uhfun_opoen_source/Uhfun-Jekyll.svg)](https://gitter.im/uhfun_opoen_source/Uhfun-Jekyll?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

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

>>>>>>> 更新README
