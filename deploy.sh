rm -r _site
echo '下载github pages 静态资源' && git clone -b gh-pages https://github.com/uhfun/Uhfun-Jekyll.git _site
echo '删除除.git 外所有文件' && rm -rf _site/**/* || exit 0
echo '重新编译生成静态文件' && bundle install && bundle exec jekyll build
cd _site
echo '自定义域名' && echo 'uhfun.cn' > CNAME
git config user.email "2512500628@qq.com"
git config user.name "uhfun"
git add -A .
git commit -m "Commit ${CI_COMMIT_ID} ${CI_COMMIT_MESSAGE} to branch gh-pages"
echo '提交重新生成的静态资源' && git push origin gh-pages