---
title: SSH常用操作
lang: zh-CN
pageClass: ssh-class
---

# SSH常用操作

[[toc]]

## 生成

```bash
ssh-keygen -t rsa -C "zhangjunbin@wanda.cn"
```

## 使用

将公钥添加到会话中去
```bash
ssh-add <file-path:这里是公钥>
```

## 在GIT中使用

```bash
ssh-add ~/.ssh/xxxxxxxx
pbcopy < ~/.ssh/xxxxxxxx.pub
```
复制到git的setting中的sshkeys中添加即可

## 在服务器上使用

1. 将本地生成的key的公钥复制到目标服务器中
```bash	
scp ~/.ssh/KEY.pub user@[targetServer]:~/.ssh/
```
2. 登录目标服务器,然后将公钥的内容写入到authorized_keys中
```bash
cat ~/.ssh/KEY.pub >> ~/.ssh/authorized_keys
```
3. 然后将KEY写入到会话中
```bash	
ssh-add ~/.ssh/KEY
```
就可以实现免密码登录了


## 测试

ssh -T git@github.xxx.net
成功会提示用户名

## 常见问题

1. 失效问题

    `ssh-add`只是将密钥添加到会话中.仅本次**会话有效**,**重启失效**
    所以经常会遇到permission denied (publick key)的问题
    原因是因为重启之后会话中已经添加的密钥被清空
    需要重新执行`ssh-add`

    当然这个有解决办法:
    **添加.ssh/config文件**
    ```bash
    Host github.xxx.net
    User zhangjunbin
    Hostname github.xxx.net
    IdentityFile ~/.ssh/id_rsa
    ```
    添加完了之后 访问指定域名时将会优先使用指定的密钥
    ::: tip
    每次访问最多重试6次ssh-key,如果添加的太多并且靠后,在失败6次之后任没遇到正确的,则依然会失败
    ::: 

2. 指纹对比

    最新的SSH 命令将finger print 以SHA256的形式列出
    ```
    ssh-keygen -l -v  -f  ~/.ssh/xxx
    4096 SHA256:CF+LL0hN5SVbrMyGg5yjjWFkwumGU9qSCv3MlKdGdbo zhangjunbin@wanda.cn (RSA)
    ```
    而git上的ssh-key的指纹是MD5,所以当遇到自己忘了添加的是哪个key的时候可以通过计算本地的key的MD5来做比较
    ```bash
    ssh-keygen -E md5 -lf ~/.ssh/id_rsa.pub
    2048 MD5:b7:92:03:03:9d:b5:43:c5:dc:98:14:4e:3b:65:3a:d8 zhangjunbin@wanda.cn (RSA)
    ```
