const video = document.querySelector('.bga');

  // 재생 속도 변경 (예: 2배속)
  video.playbackRate = 1;

const user_id = [];
const elements = document.querySelectorAll('.broad');
elements.forEach(element => {
  user_id.push(element.id);
});
console.log(user_id); // ['ecvhao', 'cotton1217', 'danchu17', 'kjhh0029']

async function loadBroadNo(id) {
  const broad = document.getElementById(id);
  const user_id = broad.id;
  console.log(user_id);
  const img = broad.querySelector('a > img');

  const broadUrl = 'http://localhost:3000/api/';
  const path = '/' + user_id; // 경로 앞에 '/' 추가
  try {
    const response = await fetch(broadUrl + path);
    if (!response.ok) {
      throw new Error(`오류: 상태 코드 ${response.status}`);
    }
    const data = await response.text();
    const match = data.match(/window\.szBroadThumPath\s*=\s*'([^']+)'/);
    result = match[1]
  } catch (error) {
    result = `[${path}] 요청 오류: ${error.message}`;
  }
  const link = broad.querySelector('a');
  link.href = 'https://play.sooplive.co.kr/' + id;
  img.src = result;
};
user_id.forEach(id => {
  loadBroadNo(id);
});

function refreshImages() {
  document.querySelectorAll('.refresh').forEach(img => {
    const url = new URL(img.src);
    url.searchParams.set('t', Date.now()); // 캐시 방지
    img.src = url.toString();
  });
}
setInterval(refreshImages, 5000); // 5초마다 새로고침

// 스크롤 시 헤더 속성 변경 /
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});