# openproxy-ui 

Reverse Proxy for Front-End Developers 

Front-End 개발자를 위해 만든 nodejs 와 electronjs 기반의  Reverse Proxy 입니다 

# What is Reverse Proxy 

Reverse Proxy 는  특정 http 요청을 내가 원하는 곳으로 보내는 기법입니다 

일반적으로 Proxy Server 라고 하며  Forward Proxy 라고 하는데요.  

naver.com 라는 주소를 쳤을 때  Proxy 를 통해서 naver.com 을 가는 형태를 말합니다.

여기서 좀 더 나아가서  naver.com 를 주소로 입력했는데  실제로는 dev.naver.com 로 가게 하는 것이 Reverse Proxy 입니다 

즉, 내가 보는 것과  실제 내부에서 실제 연결되는 곳을 제어하는 방식입니다 

# Why Reverse Proxy Is Need 

Reverse Proxy 는 왜 필요할까요.  그냥 단순히 Proxy 만 쓰면 되는거 아니에요? 

Reverse Proxy 를 많이 쓰는 용도를 예를 들어서 한번 보시죠 

## 도메인은 하나, 다양한 포트로 서버를 뛰울 때 

일반적으로  메인 도메인 하나를 가지고  여러개의 포트로 접속을 할려면
 
```sh
http://www.easylogic.co.kr:8080/  -- WAS 서버 
http://www.easylogic.co.kr:9999/  -- CDN 서버 
http://www.easylogic.co.kr:4567/  -- 이미지 서버 
http://www.easylogic.co.kr:7777/  -- php 서버 
```
같은 서버에서 이렇게 포트가 다른 서버들이 있다면  과연 유저들이 포트를 매번 기억하고 들어갈까요? 당연히 모르겠지요. 

그래서 보통은 이렇게 구성합니다 

```sh
http://www.easylogic.co.kr/ ->  http://www.easylogic.co.kr:8080/  -- WAS 서버 
http://cdn.easylogic.co.kr/ ->  http://www.easylogic.co.kr:9999/  -- CDN 서버 
http://img.easylogic.co.kr/ ->  http://www.easylogic.co.kr:4567/  -- 이미지 서버 
http://login.easylogic.co.kr/ ->  http://www.easylogic.co.kr:7777/  -- php 서버 
```

이러면 유저들이 쉽게 도메인만 가지고도 내가 원하는 곳으로 접속할 수 있게 됩니다 

## 특정 URL 만 내부  서버 포트로 연결할때 

```http://www.easylogic.co.kr/``` 라는 서비스가 있다고 할 때 

```http://www.easylogic.co.kr/doc/``` 이라는 디렉토리만  내부 문서 서버로 연결하고 싶습니다. 

이럴 때도 활용할 수 있습니다 

```sh
http://www.easylogic.co.kr/doc/ -> http://www.easylogic.co.kr:8888/   -- 문서 서버 
```

이런 형태로 특정 디렉토리만 특정 서버로 연결할 수 있습니다. 
 





# ElectronJS based 

# Install

```
git clone https://github.com/easylogic/openproxy-ui.git 
cd openproxy-ui 
npm install 
npm start 
  
```  

# Documents 

https://easylogic.github.io/openproxy-ui/
 
## To Use

```
npm start
```

## Screen

<img src='https://easylogic.github.io/openproxy-ui/images/default.png' />

#### License MIT
