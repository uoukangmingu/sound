const sounds = [
    { name: "1장(1) 라벨 - '교수대'", file: "1장(1) 라벨 - 밤의 가스파르 '교수대'.mp3" },
    { name: "1장(2) 나레이션, 배경", file: "1장(2) 나레이션, 배경.mp3" },
    { name: "1장(3,4) M,계향", file: "1장(3,4) M,계향.mp3" },
    { name: "1장(5) 암전", file: "1장(5) 암전.mp3" },
    { name: "2장(1) 암전", file: "2장(1) 암전.mp3" },
    { name: "3장(1) 암전", file: "3장(1) 암전.mp3" },
    { name: "4장(1) 나레이션 배경음", file: "4장(1) 나레이션 배경음.mp3" },
    { name: "4장(2) 암전", file: "4장(2) 암전.mp3" },
    { name: "5장(0) 휴지", file: "5장(0) 휴지.mp3" },
    { name: "5장(1) 아이 울음 소리", file: "5장(1) 아이 울음 소리.mp3" },
    { name: "6장(1) 독백", file: "6장(1) 독백.mp3" },
    { name: "7장(1) 암전", file: "7장(1) 암전.mp3" },
    { name: "7장(2) 까마귀", file: "7장(2) 까마귀.mp3" },
    { name: "7장(3) 아이 울음 소리", file: "7장(3) 아이 울음 소리.mp3" },
    { name: "노들강변", file: "노들강변.mp3" }
];

const soundButtons = document.getElementById('soundButtons');

const audioElements = sounds.map(sound => {
    const audio = new Audio(sound.file);
    audio.loop = false;
    return audio;
});

function toggleSound(index) {
    const button = document.querySelectorAll('.play-button')[index];
    const icon = button.querySelector('i');
    const audio = audioElements[index];

    if (audio.paused) {
        audio.play();
        button.classList.add('playing');
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        updateTimeline(index);
    } else {
        audio.pause();
        button.classList.remove('playing');
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
}

function updateTimeline(index) {
    const audio = audioElements[index];
    const timelineSlider = document.querySelectorAll('.timeline-slider')[index];
    const timeDisplay = document.querySelectorAll('.time-display')[index];

    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        const percentage = (currentTime / duration) * 100;
        timelineSlider.value = percentage;
        timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    });

    timelineSlider.addEventListener('input', () => {
        const time = audio.duration * (timelineSlider.value / 100);
        audio.currentTime = time;
    });
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function changeVolume(index, volume) {
    const normalizedVolume = volume / 100;  // 0-100 값을 0-1 범위로 정규화
    audioElements[index].volume = normalizedVolume;
    const volumeDisplay = document.querySelectorAll('.volume-display')[index];
    volumeDisplay.textContent = Math.round(volume);  // 반올림된 정수 값 표시
}

sounds.forEach((sound, index) => {
    const button = document.createElement('div');
    button.className = 'sound-button';
    button.innerHTML = `
        <div class="button-group">
            <button class="play-button" onclick="toggleSound(${index})">
                <i class="fas fa-play"></i>
            </button>
            <button class="refresh-button" onclick="refreshSound(${index})">
                <i class="fas fa-sync-alt"></i>
            </button>
        </div>
        <div class="sound-info">
            <span class="sound-name">${sound.name}</span>
            <div class="timeline">
                <input type="range" min="0" max="100" value="0" class="timeline-slider">
                <span class="time-display">0:00 / 0:00</span>
            </div>
        </div>
        <div class="volume-control">
            <input type="range" min="0" max="100" step="1" value="100" oninput="changeVolume(${index}, this.value)">
            <span class="volume-display">100</span>
        </div>
    `;
    document.querySelector('.container').appendChild(button);
});

function addTouchSupport() {
    const buttons = document.querySelectorAll('.play-button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.click();
        });
    });
}

// 모든 버튼이 생성된 후에 이 함수를 호출해야 해
addTouchSupport();


// 다크모드 전환 함수
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// 페이지 로드 시 다크모드 상태 확인
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});

// 단축키 이벤트 리스너
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        toggleDarkMode();
    }
});

// 새로고침 함수
function refreshSound(index) {
    const audio = audioElements[index];
    audio.currentTime = 0;
    if (!audio.paused) {
        audio.pause();
        audio.play();
    }
    updateTimeline(index);
}
