const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

function renderPostList() {
    return `
        <h1>좋아하는 것</h1>
        <ul>
            <li>스피드클라이밍</li>
            <li>KERT</li>
        </ul>
    `;
}

app.get('/', (req, res)=>{
    res.send('<h1>Hello Express!</h1>');
});

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});

app.get('/about', (req, res)=>{
    res.send('<h1>경북대학교 KERT 소속 변진명입니다.</h1><p>KERT 웹 백엔드 스터디 1기 참여 중에 있습니다.</p>');
});

app.get('/photo', (req, res) => {
    res.send('<img src="/photo.jpg" alt="kert 사진">');
});

app.get('/time', (req, res) => {
    const now = new Date();
    res.send(`<h1>현재 시각</h1><p>${now.toLocaleString('ko-KR')}</p>`);
});

app.get('/posts', (req, res) => {
    res.send(renderPostList());
});

app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - 페이지를 찾을 수 없습니다.</h1>
        <p>요청하신 주소가 존재하지 않습니다.</p>
    `);
});