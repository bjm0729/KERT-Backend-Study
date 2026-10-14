const express = require('express');
const app = express();
const PORT = 3000;

// EJS 템플릿 엔진 및 URL-encoded 폼 데이터 파싱 미들웨어 설정 [3]
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// 시작 데이터 [4]
const posts = [
    {
        id: 1,
        title: 'Express 설치했어요',
        author: 'kim',
        content: 'npm install express 끝!'
    },
    {
        id: 2,
        title: '서버가 안 켜져요',
        author: 'lee',
        content: 'EADDRINUSE 에러가 나요'
    },
    {
        id: 3,
        title: 'EJS 질문',
        author: 'park',
        content: '<%= %> 랑 <%- %> 차이가 뭔가요?'
    },
];

// GET / -> /posts 로 redirect [4]
app.get('/', (req, res) => {
    res.redirect('/posts');
});

// GET /posts -> 글 목록 (도전 과제: keyword 검색 지원) [5]
app.get('/posts', (req, res) => {
    const { keyword } = req.query;

    let filteredPosts = posts;

    if (keyword) {
        filteredPosts = posts.filter((post) =>
            post.title.includes(keyword)
        );
    }

    res.render('list', { posts: filteredPosts });
});

// GET /posts/new -> 글쓰기 폼
// (:id 라우트보다 위에 위치해야 함) [6]
app.get('/posts/new', (req, res) => {
    res.render('new');
});

// POST /posts -> 새 글 저장
// (도전 과제: 빈 제목 방지 400 처리) [5]
app.post('/posts', (req, res) => {
    const { title, author, content } = req.body;

    // 빈 제목 또는 공백만 있는 제목 막기
    if (!title || !title.trim()) {
        return res.status(400).send('제목을 입력해주세요.');
    }

    // 삭제 후에도 id가 겹치지 않게 (가장 큰 id + 1) [7, 8]
    const maxId = posts.reduce(
        (max, post) => Math.max(max, post.id),
        0
    );

    const newPost = {
        id: maxId + 1,
        title: title.trim(),
        author: author ? author.trim() : '',
        content: content ? content.trim() : '',
    };

    posts.push(newPost);

    // PRG 패턴 적용 [9]
    res.redirect(`/posts/${newPost.id}`);
});

// GET /posts/:id -> 상세 페이지
// (도전 과제: 없는 글일 때 views/404.ejs 렌더) [5, 10]
app.get('/posts/:id', (req, res) => {
    const id = Number(req.params.id); // [11]

    const post = posts.find((p) => p.id === id);

    if (!post) {
        return res.status(404).render('404');
    }

    res.render('detail', { post });
});

// POST /posts/:id/delete -> 글 삭제 [12]
app.post('/posts/:id/delete', (req, res) => {
    const id = Number(req.params.id);

    const index = posts.findIndex((p) => p.id === id);

    if (index !== -1) {
        posts.splice(index, 1);
    }

    res.redirect('/posts');
});

// 없는 주소 처리 (도전 과제: views/404.ejs 렌더) [5]
app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});