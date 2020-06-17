---
layout: post
post: 
  title: Ubuntu-server 安装后续
  type: 
date: 2018-07-23 22:31:00 +0800
categories: 
  - tech
tags:
  - Ubuntu
---
安装完 Ubuntu-server 后，额外的一些设置

### 修改 root 密码
```bash
sudo passwd root
```
### 使用root开启ssh登录
```bash
sudo vi /etc/ssh/sshd_config
```
**找到下面的配置**

```bash
# Authentication:
LoginGraceTime 120
PermitRootLogin prohibit-password
StrictModes yes
```

**改为**

```bash
# Authentication:
LoginGraceTime 120
#PermitRootLogin prohibit-password
PermitRootLogin yes
StrictModes yes
```

**重启ssh**

```bash
sudo service ssh restart
```

### 设置开机默认root账户登录
**将当前用户切换为root账户**

```bash
su root
```
**安装mingetty**

```bash
apt-get install mingetty
```
**修改启动文件**

```bash
vi /etc/init/tty1.conf
```
**找到下面的配置**

```bash
exec /sbin/getty -8 38400 tty1
```
**改为**

```bash
#exec /sbin/getty -8 38400 tty1
exec /sbin/mingetty –-autologin root tty1
```

### 修改DNS
**修改文件 /etc/network/interfaces**

```bash
dns-nameservers 114.114.114.114
dns-nameservers 8.8.8.8
```

**通过/etc/resolv.conf查看DNS设置**

```bash
nameserver 114.114.114.114
nameserver 8.8.8.8
```

### 安装 Shell Integration （ iterm2 ）
好东西，前提得先安装 **iterm2**  
解决了我虚拟机Ubuntu上 下载文件慢，开代理也无济于事的问题   
直接把主机下载的文件拖上去上传就行。  
[查看 Shell Integration 使用 ](https://phpor.net/blog/post/3665)
>我在使用时，出现连接不上的问题，item2 不知道对应虚拟机主机名的ip 所以你必须自己在host里面加上对应主机名的ip地址
>例如 192.168.56.101 UU (主机名是 **`root@UU:~#`** 的 UU 是在创建时自己设置的)