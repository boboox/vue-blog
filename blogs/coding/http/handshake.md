---
title: http的三次握手
---

# http的三次握手

[[toc]]

## 基础概念

TCP (transmission control protocol) 传输控制协议

码位,即TCP标志位,有六种标识:
- SYN synchronous建立联机
- ACK acknowledgement 确认
- PSH push 传送
- FIN push传送
- ST reset重置
- URG reset重置

Sequence number 顺序号码 SEQN
Acknowledge number 确认号码 ACKN

## 三次握手

![三次握手](http://dl.iteye.com/upload/picture/pic/52632/af92abd0-c8bc-3954-a06c-9f6a9f049452.jpg)

- 第一次: 客户端发送 SYN(1),SEQN(J),进入到`SYN_SEND状态`,等待服务器确认
- 第二次: 服务端返回 SYN(1),SEQN(X),ACKN(J+1),ACK(1),进入到`SYN_RECV状态`,
- 第三次: 客户端判断 
    - if(ACKN === SEQN+1 (J+1) && ACK === 1 )
    -  发送ACKN(X+1) ACK(1)
    -  服务端收到确认后开始通信(服务端和客户端进入`ESTABLISHED状态`)


