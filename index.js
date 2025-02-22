const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3000;

// CORS 헤더를 자동으로 설정해주는 미들웨어 추가
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 프록시 설정
const targetUrl = 'https://play.sooplive.co.kr';  // 실제 요청을 보낼 서버 URL

app.use('/api', createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,  // 요청의 Origin 헤더를 타겟 서버의 도메인으로 변경
    pathRewrite: {
        '^/api': '',  // "/api" 경로를 제거하고 요청을 타겟 서버로 전달
    },
    onProxyRes: (proxyRes, req, res) => {
        // 응답에 CORS 헤더 추가
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

// 서버 시작
app.listen(port, () => {
    console.log(`프록시 서버가 http://localhost:${port}에서 실행 중입니다.`);
});
