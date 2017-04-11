# Open Proxy 

Reverse Proxy for Front-End Developers 

Front-End 개발자를 위해 만든 nodejs 와 electronjs 기반의  Reverse Proxy 입니다 

# What is Reverse Proxy 

Reverse Proxy 는  특정 http 요청을 내가 원하는 곳으로 보내는 기법입니다 

일반적으로 Proxy Server 라고 하면   Forward Proxy 라고 하는데요.  

naver.com 라는 주소를 쳤을 때  Proxy 를 통해서 naver.com 을 가는 형태를 말합니다.

여기서 좀 더 나아가서  naver.com 를 주소로 입력했는데  실제로는 dev.naver.com 로 가게 하는 것이 Reverse Proxy 입니다 

즉, 내가 보는 것과  실제 내부에서 실제 연결되는 곳을 제어하는 방식입니다 

# Why Reverse Proxy Is Need 

Reverse Proxy 는 왜 필요할까요.  그냥 단순히 Proxy 만 쓰면 되는거 아니에요? 

Reverse Proxy 를 많이 쓰는 용도를 예를 들어서 한번 보시죠. 

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
 

# How to use open proxy for reverse proxy 
 
Open Proxy 는 nodejs 용으로 만들어진 간단한 http proxy 입니다.  보통 http 서버(아파치나 nginx 같은 서버에서도 proxy 기능을 지원합니다. 

하지만 proxy 설정 자체를 동적으로 할 수가 없고 매번 서버를 켰다 껐다를 반복해야합니다. 

Open Proxy 는 nodejs 와 electronjs 를 결합해서 UI 상에서 바로 Reverse Proxy 를 구현하기 위해서 만들어졌습니다. 

# What Open Proxy can do 

OpenProxy 는 과연 무엇을 할 수 있을까요? 

## 내가 원하는 주소로 접속하기 

개발을 하다보면 보통 alpha 서버, beta 서버 또는 개발서버와 실서버를 따로 만나게 됩니다. 

이렇게 되면 보통은 dev.easylogic.co.kr 같은 개발용 domain 이 붙게 됩니다. 

Open Proxy 를 쓰시게 되면  dev.easylogic.co.kr 도 www.easylogic.co.kr 로 접속하실 수 있습니다. 

## 특정 도메인 또는 특정 페이지의 응답 제어하기 

Front-End 단에서 http 상태를 테스트 한다고 했을 때  서버코드에서 잘 돌아가고 있는 코드를 임의의 코드로 상태로 만들기가 어려울 수 있습니다 

이때 Open Proxy 는 특정 요청에 대해서 내가 원하는 Http 응답을 줄 수 있습니다. 

특정 페이지가 필요없을 때는 404 Not Found 같은 상태로 브라우저로 응답을 바로 보냅니다. 

그러면 브라우저는 없는 것으로 인식하고 스크립트에서 에러를 발생시키겠죠. 

ps. 내가 원하는 영역의 데이타만 볼 수 있게 됩니다. 간단한 예를 들면  특정 광고 url 만 404 로 보내버리면 광고를 안볼 수 도 있습니다. 

## 로컬 디렉토리를  특정 도메인의 static 웹서버로 사용하기 

보통 이 작업을 하기 위해서는 2가지가 필요한데요. 

일단은 웹서버를 설정을 해야하고 /etc/hosts 파일을 수정해서 현재 아이피랑 도메인을 맞추는 작업을 해야합니다. 

웹서버는 아파치같은 서버 설정 정보도 알아야하고  hosts 파일 같은 경우는 변경하고 나면 브라우저를 껐다 다시 켜야 적용이 됩니다. 

OpenProxy 는  특정 도메인 또는 특정 URL 을  내가 원하는 로컬 디렉토리나 파일로 쉽게 연결가능합니다. 

파일 확장자에 따른 Content-Type 속성도 지원합니다. 

## HTTP 접근 제어(CORS) 없이 브라우저 통신하기 

https://developer.mozilla.org/ko/docs/Web/HTTP/Access_control_CORS

브라우저는 보안상의 이유로 서로 다른 도메인에 ajax 같은 요청을 날릴 수 없게 되어 있습니다. 

예를 들어 localhost 로 뛰운 테스트 페이지로 dev.easylogic.co.kr 으로 실제 원하는 데이타를 받아올 수가 없습니다. 

그러면 보통은 가짜 데이타로 테스트를 계속 하는 수 밖에 없습니다. 

Open Proxy 를 사용하게 되면  도메인을 무한대로 생성할 수 있게 되기 때문에 CORS 걱정은 안하셔도 됩니다. 

```sh
http://sample.easylogic.co.kr -> localhost:8888  -- 로컬 테스트 서버  
```

이렇게 특정 도메인을  로컬 서버로 연결만 해도  easylogic.co.kr 까지 도메인이 같다면 브라우저에서 같은 도메인 영역으로 인식할 수 있게 됩니다. 

## 실서비스는 xxx.min.js, 로컬에서 테스트 할 때는 xxx.js 로 하기 
 
브라우저에서 실행되는 javascript 가 날로 커지고 있고 이것도 하나의 리소스이기 때문에 minify 를 실행해서 실제 서비스에 많이들 적용합니다. 

실제 xxx.min.js 를 디버깅 할려면 xxxx.map 같은 특정 파일을 가지고 브라우저의 개발자도구에서 디버깅을 제공해야 제대로된 디버깅을 할 수 있습니다. 

하지만 map 을 만들 수 없는 여건도 많은데요.  이럴 때 Open Proxy 를 사용하면 쉽게 해결이 됩니다. 

```sh
    .min.js -> .js 
```

특정 min.js 파일을 .js 파일로 주소만 바꿔줘도  Open Proxy 내부에서  .js 파일을 읽어들여서 브라우저로 보내주기 때문에 쉽게 디버깅 할 수 있습니다.

심지어 내가 지금 개발하고 있는 로컬 소스에 있는 것으로 대체할 수 있습니다.

```sh
    .min.js ->   c:\sample.dir\sample.js 
```

내가 원하는 url 을  특정 파일로 응답을 줄 수 있기 때문에 가능한 현상입니다. 

로컬에서만 작업하고 쉽게 리얼데이타로 테스트 하실 수 있게 됩니다. 

# Install

아래와 같이 설치할 수 있습니다. 

```
git clone https://github.com/easylogic/openproxy-ui.git 
cd openproxy-ui 
npm install 
  
```  
 
# To Use

Proxy 서버를 시작할려면 아래와 같이 합니다. 

```
npm start
```

## Screenshot

### 기본 설정 화면 

<img src='https://easylogic.github.io/openproxy-ui/images/default.png' />

### Rule 설정 화면 

<img src='https://easylogic.github.io/openproxy-ui/images/rule_table_add_rule.png' />

# Plugin 시스템 

Open Proxy 의 기본 구조는 모두 Plugin 시스템으로 되어 있습니다. 

누구든지 소스를 가져다가 기본 정보 설정만으로 쉽게 확장 할 수 있습니다.
 

# Documents 

https://easylogic.github.io/openproxy-ui/

# To do 

* linux, mac, window installer 제공 
* rule table 공유하기 
* ssl 인증서 지원
* websocket frame 분석도구  
* http 세션 분석 도구 (request, response) 
* http 리소스 다운로드 받기 


# Inspired

* Fiddler AutoResponder (http://docs.telerik.com/fiddler/KnowledgeBase/AutoResponder)
* Apache Reverse PRoxy (https://httpd.apache.org/docs/2.4/howto/reverse_proxy.html )
* Apache Rewrite Module (https://httpd.apache.org/docs/2.0/en/misc/rewriteguide.html)
* PLink (https://github.com/easylogic/plink)

#### License MIT
