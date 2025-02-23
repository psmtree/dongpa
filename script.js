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
  console.log(id);
  const broad = document.getElementById(id);

  // 기존의 로컬 서버 주소를 Cloudflare Worker의 URL로 변경
  const broadUrl = 'https://dongpa-proxy.psmtree.workers.dev';  // Cloudflare Worker의 URL
  const path = '/' + id; // 경로 앞에 '/' 추가

  let result = { thumbnail: '', title: '', nickname: '' };

  try {
    const response = await fetch(broadUrl + path);
    if (!response.ok) {
      throw new Error(`오류: 상태 코드 ${response.status}`);
    }
    const data = await response.text();

    const nBroadNo = data.match(/window\.szBroadThumPath\s*=\s*'([^']+)'/);
    result.thumbnail = nBroadNo ? nBroadNo[1] : 'default-thumbnail.jpg';

    const szBroadTitle = data.match(/window\.szBroadTitle\s*=\s*"([^"\\]+)"/);
    result.title = szBroadTitle ? szBroadTitle[1] : '[방송 제목 없음]';

    const szBjNick = data.match(/window\.szBjNick\s*=\s*'([^']+)'/);
    result.nickname = szBjNick ? szBjNick[1] : '[닉네임 없음]';

  } catch (error) {
    result.thumbnail = 'default-thumbnail.jpg';
    result.title = `[오류] ${error.message}`;
  }
  // 방솜 썸네일에서 방송 링크
  const link = broad.querySelector(".thumb-box > a");
  link.href = 'https://play.sooplive.co.kr/' + id;
  // 방송 썸네일
  const img = broad.querySelector('.thumb-box > a > .refresh');
  img.src = result.thumbnail;

  //프로필 방송국 링크
  const channel = broad.querySelector('.details > a');
  channel.href = 'https://ch.sooplive.co.kr/' + id;
  //프로필 이미지
  const profile = broad.querySelector('.profile');
  profile.src = 'https://stimg.sooplive.co.kr/LOGO/' + id.slice(0, 2) + '/' + id + '/m/' + id + '.webp';

  const nick = broad.querySelector('.nick');
  nick.textContent = result.nickname;

  const title = broad.querySelector('.title > a');
  title.textContent = result.title;
  title.href = 'https://play.sooplive.co.kr/' + id;
};

user_id.forEach(id => {
  loadBroadNo(id);
});

// 금메달 이미지 추가
document.querySelectorAll("#gold").forEach(el => {
  // el.src = "https://raw.githubusercontent.com/twitter/twemoji/refs/heads/master/assets/svg/1f947.svg";
  el.src = "media/gold.png";
});

// 은메달 이미지 추가
document.querySelectorAll("#silver").forEach(el => {
  el.src = "https://raw.githubusercontent.com/twitter/twemoji/refs/heads/master/assets/svg/1f948.svg";
  el.src = "media/silver.png";
});

// 동메달 이미지 추가
document.querySelectorAll("#bronze").forEach(el => {
  el.src = "https://raw.githubusercontent.com/twitter/twemoji/refs/heads/master/assets/svg/1f949.svg";
  el.src = "media/bronze.png";
});

// 이미지 새로고침
function refreshImages() {
  document.querySelectorAll('.refresh').forEach(img => {
    const url = new URL(img.src);
    url.searchParams.set('t', Date.now()); // 캐시 방지
    img.src = url.toString();
  });
}
// 5초마다 이미지 새로고침
setInterval(refreshImages, 5000);

// 페이지를 닫기 전 스크롤 위치 저장
window.addEventListener("beforeunload", () => {
  sessionStorage.setItem("scrollPosition", window.scrollY);
});

// 페이지 로드 시 스크롤 위치 복원
window.addEventListener("load", () => {
  const scrollPosition = sessionStorage.getItem("scrollPosition");
  if (scrollPosition !== null) {
    window.scrollTo(0, Number(scrollPosition));
  }
});

// 5분마다 페이지 새로고침
// setInterval(() => {
//   location.reload();
// }, 300000);

// 페이지 상단으로 이동
document.querySelector('.gotop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 일정 열기 /
document.querySelector('.bttn-plan').addEventListener('click', (e) => {
  e.stopPropagation();
  document.querySelector(".hideplan").style.display = 'flex';
  document.body.style.overflow = 'hidden'; // body의 스크롤 비활성화
});

// 일정 닫기 /
document.addEventListener("click", (e) => {
  const plan = document.querySelector(".hideplan");
  if (document.querySelector(".hideplan").style.display === 'flex') {
    const openplan = plan.querySelector('.plan');
    if (!openplan.contains(e.target)) {
      document.querySelector(".hideplan").style.display = 'none';
      document.body.style.overflow = 'auto'; // body의 스크롤 복원
    }
  }
});

// 크레딧 열기 /
document.querySelector('.bttn-say').addEventListener('click', (e) => {
  e.stopPropagation();
  document.querySelector(".hidecredit").style.display = 'flex';
  document.body.style.overflow = 'hidden'; // body의 스크롤 비활성화
});

// 크레딧 내용 불러오기
fetch('sources.txt')
  .then(response => response.text())
  .then(data => {
    document.querySelector('.credit').innerHTML = data;
  })
  .catch(error => console.log('Error:', error));


// 크레딧 닫기 /
document.addEventListener("click", (e) => {
  const credit = document.querySelector(".hidecredit");
  if (document.querySelector(".hidecredit").style.display === 'flex') {
    const opencredit = credit.querySelector('.credit');
    if (!opencredit.contains(e.target)) {
      document.querySelector(".hidecredit").style.display = 'none';
      document.body.style.overflow = 'auto'; // body의 스크롤 복원
    }
  }
});