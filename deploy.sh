echo '下载posts分支...'
rm -rf _posts || exit 0
git clone -b _posts https://github.com/uhfun/Uhfun-Jekyll.git  _posts
echo '重建_site...'
rm -rf _site
git clone -b gh-pages https://github.com/uhfun/Uhfun-Jekyll.git _gh_site
rm -rf _gh_site/**/* || exit 0
echo '编译...'
bundle install && bundle exec jekyll build -d _gh_site
echo 'uhfun.cn > CNAME' 
echo 'uhfun.cn' > CNAME
echo '提交_site...'
cd _gh_site
git config --global user.email 2512500628@qq.com
git config --global user.name fuhangbo
git add . 
git commit -m '...' 
git push
cd ..
rm -rf _gh_site