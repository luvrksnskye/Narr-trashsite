const audio = document.getElementById('audio');
const playPauseBtn = document.querySelector('.playpause-track');
const progressBar = document.querySelector('.seek-slider');
const currentTimeEl = document.querySelector('.current-time');
const totalDurationEl = document.querySelector('.total-duration');
const volumeSlider = document.querySelector('.volume-slider');
const volumeIcon = document.querySelector('.volume-icon');
const visualizer = document.getElementById('visualizer');
const trackName = document.querySelector('.track-name');
const artistName = document.querySelector('.artist-name');

let previousVolume = 1;
let isCasinoMode = false;
let isPlaying = false;
let updateTimer;

const musicPaths = {
    normal: 'narr/Default-theme.mp3',
    casino: 'narr/Casino-theme.mp3'
};

audio.loop = true;
audio.autoplay = true;

const soundEffects = {
    click: new Audio('visuals/sound-effects/undertale-select-sound.mp3'),
    select: new Audio('narr/visuals/sound-effects/snd_tempbell.wav')
};

const casinoThemeLink = document.createElement('link');
casinoThemeLink.rel = 'stylesheet';
casinoThemeLink.href = 'narr/themes/casino-theme.css';
casinoThemeLink.disabled = true; 

document.head.appendChild(casinoThemeLink);

document.addEventListener('DOMContentLoaded', () => {
    const loadingIndicator = document.getElementById('loadingIndicator');

    if (!document.getElementById('rainContainer')) {
        const rainContainer = document.createElement('div');
        rainContainer.id = 'rainContainer';
        rainContainer.className = 'rain-container'; 
        document.body.appendChild(rainContainer);
    }

    if (loadingIndicator) {
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
            playMusic();
        }, 1500);
    } else {
        playMusic();
    }

    if (!isCasinoMode) {
        createRain();
    }
});

const soundToggle = document.getElementById('soundToggle');
if (soundToggle) {
    soundToggle.addEventListener('click', () => {
        if (soundEffects.click) {
            soundEffects.click.play();
        }

        const isMuted = audio.volume > 0;

        if (isMuted) {
            soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            audio.volume = 0;
            if (soundEffects.click) soundEffects.click.volume = 0;
            if (soundEffects.select) soundEffects.select.volume = 0;
        } else {
            soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            audio.volume = volumeSlider.value / 100;
            if (soundEffects.click) soundEffects.click.volume = 1;
            if (soundEffects.select) soundEffects.select.volume = 1;
        }
    });
}

function createRain() {

    let oldContainer = document.getElementById('rainContainer');
    if (oldContainer) {
        oldContainer.remove();
    }

    if (isCasinoMode) {
        return;
    }

    const rainContainer = document.createElement('div');
    rainContainer.id = 'rainContainer';
    rainContainer.className = 'rain-container'; 
    document.body.appendChild(rainContainer);

    let frontRow = document.createElement('div');
    frontRow.className = 'rain front-row';
    rainContainer.appendChild(frontRow);

    let backRow = document.createElement('div');
    backRow.className = 'rain back-row';
    rainContainer.appendChild(backRow);

    let increment = 0;
    let drops = "";
    let backDrops = "";

    while (increment < 200) {
        const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);

        const randoFiver = Math.floor(Math.random() * (3 - 1 + 1) + 1);
        increment += randoFiver;

        drops += `<div class="drop" style="left: ${increment * 0.5}%; bottom: ${(randoFiver + randoFiver - 1 + 100)}%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
                    <div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
                    <div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
                  </div>`;

        backDrops += `<div class="drop" style="right: ${increment * 0.5}%; bottom: ${(randoFiver + randoFiver - 1 + 100)}%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
                        <div class="stem" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
                        <div class="splat" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
                      </div>`;
    }

    frontRow.innerHTML = drops;
    backRow.innerHTML = backDrops;
}

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        if (soundEffects.switch) {
            soundEffects.switch.play();
        }

        const themeSwitchAudio = document.createElement('audio');
        themeSwitchAudio.src = 'narr/visuals/sound-effects/snd_tempbell.wav';
        themeSwitchAudio.play();

        isCasinoMode = !isCasinoMode;

        body.classList.add('pixelate');
        setTimeout(() => {
            body.classList.remove('pixelate');
        }, 800);

        casinoThemeLink.disabled = !isCasinoMode;

        body.classList.toggle('theme-casino', isCasinoMode);

        if (isCasinoMode) {
            if (trackName) trackName.textContent = 'Dog Casino';
            if (artistName) artistName.textContent = 'Undertale OST';

            audio.src = musicPaths.casino;

            launchConfetti();

            const rainContainer = document.getElementById('rainContainer');
            if (rainContainer) {
                rainContainer.remove();
            }
        } else {
            if (trackName) trackName.textContent = 'Quiet Water';
            if (artistName) artistName.textContent = 'Undertale OST';

            audio.src = musicPaths.normal;

            createRain();
        }

        audio.loop = true;

        if (isPlaying) {
            audio.play();
        }

        updateVisualizer(); 
    });
}

function launchConfetti() {
    if (typeof confetti === 'undefined') {
        console.log("Confetti library not available");
        return;
    }

    const duration = 5000; 
    const animationEnd = Date.now() + duration;
    const defaults = {
        startVelocity: 50, 
        spread: 360,
        ticks: 100, 
        zIndex: 0
    };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 100 * (timeLeft / duration); 

        for (let i = 0; i < 3; i++) {
            confetti({
                ...defaults,
                particleCount: particleCount / 3,
                origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0, 0.3) },
                colors: ['#FFD700', '#FFFF00', '#FF5555', '#FFFFFF', '#ff7124', '#43256E'],
                scalar: randomInRange(0.8, 1.5),
                shapes: ['square', 'circle']
            });
        }
    }, 150); 

    setTimeout(() => {
        confetti({
            particleCount: 40,
            spread: 70,
            origin: { y: 0.6 },
            gravity: 1,
            scalar: 2,
            colors: ['#FFD700', '#FF5555']
        });
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
}

function createVisualizer() {
    if (!visualizer) return;

    visualizer.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${Math.floor(Math.random() * 20) + 5}px`;
        visualizer.appendChild(bar);
    }
}

function updateVisualizer() {
    if (!visualizer || !isPlaying) return;

    const bars = visualizer.querySelectorAll('.bar');
    bars.forEach(bar => {
        const height = Math.floor(Math.random() * 25) + 5;
        bar.style.height = `${height}px`;
    });

    requestAnimationFrame(updateVisualizer);
}

function playMusic() {
    isPlaying = true;
    if (playPauseBtn) {
        playPauseBtn.innerHTML = '<i class="fa fa-pause"></i>';
    }

    audio.play();
    updateTimer = setInterval(updateTrackTime, 1000);
    updateVisualizer();
}

function pauseMusic() {
    isPlaying = false;
    if (playPauseBtn) {
        playPauseBtn.innerHTML = '<i class="fa fa-play"></i>';
    }

    audio.pause();
    clearInterval(updateTimer);
}

function updateTrackTime() {
    if (!audio || isNaN(audio.duration)) return;

    const currentMinutes = Math.floor(audio.currentTime / 60);
    const currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
    const durationMinutes = Math.floor(audio.duration / 60);
    const durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

    if (currentTimeEl) {
        currentTimeEl.textContent = `${currentMinutes < 10 ? '0' + currentMinutes : currentMinutes}:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`;
    }

    if (totalDurationEl) {
        totalDurationEl.textContent = `${durationMinutes < 10 ? '0' + durationMinutes : durationMinutes}:${durationSeconds < 10 ? '0' + durationSeconds : durationSeconds}`;
    }

    if (progressBar) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
    }
}

if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
        if (soundEffects.click) {
            soundEffects.click.play();
        }

        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });
}

if (progressBar) {
    progressBar.addEventListener('input', () => {
        const seekTo = audio.duration * (progressBar.value / 100);
        audio.currentTime = seekTo;
    });
}

if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value / 100;
    });
}

const prevBtn = document.querySelector('.prev-track');
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (soundEffects.click) {
            soundEffects.click.play();
        }
        audio.currentTime = 0;
    });
}

const nextBtn = document.querySelector('.next-track');
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (soundEffects.click) {
            soundEffects.click.play();
        }
        audio.currentTime = 0;
    });
}

const navLinks = document.querySelectorAll('nav a, nav button');
if (navLinks) {
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (soundEffects.select) {
                soundEffects.select.cloneNode(true).play();
            }
        });
    });
}

document.querySelectorAll('a, button, .character-card, .gallery-item').forEach(element => {
    element.addEventListener('click', () => {
        if (soundEffects.click) {
            soundEffects.click.cloneNode(true).play();
        }
    });
});

audio.addEventListener('play', () => {
    isPlaying = true;
    if (playPauseBtn) {
        playPauseBtn.innerHTML = '<i class="fa fa-pause"></i>';
    }
});

audio.addEventListener('pause', () => {
    isPlaying = false;
    if (playPauseBtn) {
        playPauseBtn.innerHTML = '<i class="fa fa-play"></i>';
    }
});

audio.volume = volumeSlider ? volumeSlider.value / 100 : 0.5;

window.addEventListener('load', () => {
    if (!document.getElementById('rainContainer') && !isCasinoMode) {
        const rainContainer = document.createElement('div');
        rainContainer.id = 'rainContainer';
        rainContainer.className = 'rain-container'; 
        document.body.appendChild(rainContainer);
        createRain();
    }

    createVisualizer();

    audio.src = musicPaths.normal;

    if (localStorage.getItem('casinoMode') === 'true') {
        if (themeToggle) {
            themeToggle.click();
        }
    }

    if (isPlaying) {
        playMusic();
    }
});

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        localStorage.setItem('casinoMode', isCasinoMode);
    });
}

window.addEventListener('resize', () => {
    if (!isCasinoMode) {
        createRain();
    }
});

function enablePinchZoom(element) {
    let initialDistance = 0;
    let currentScale = 1;
    let initialScale = 1;
    let lastTouchEndTime = 0;
    const DOUBLE_TAP_DELAY = 300;

    let initialTouchX = 0;
    let initialTouchY = 0;
    let offsetX = 0;
    let offsetY = 0;

    function getDistance(touches) {
        return Math.hypot(
            touches[0].pageX - touches[1].pageX,
            touches[0].pageY - touches[1].pageY
        );
    }

    function getMidpoint(touches) {
        return {
            x: (touches[0].pageX + touches[1].pageX) / 2,
            y: (touches[0].pageY + touches[1].pageY) / 2
        };
    }

    element.addEventListener('touchstart', (e) => {
        e.preventDefault();

        if (e.touches.length === 2) {

            initialDistance = getDistance(e.touches);
            initialScale = currentScale;
        } else if (e.touches.length === 1) {

            const now = new Date().getTime();
            const timeSince = now - lastTouchEndTime;

            if (timeSince < DOUBLE_TAP_DELAY) {

                currentScale = currentScale === 1 ? 2 : 1;
                offsetX = offsetY = 0;
                updateTransform();
            }

            initialTouchX = e.touches[0].pageX - offsetX;
            initialTouchY = e.touches[0].pageY - offsetY;
        }
    }, { passive: false });

    element.addEventListener('touchmove', (e) => {
        e.preventDefault();

        if (e.touches.length === 2) {

            const currentDistance = getDistance(e.touches);
            const scale = (currentDistance / initialDistance) * initialScale;
            currentScale = Math.min(Math.max(0.5, scale), 4); 

            if (currentScale > 1) {
                const midpoint = getMidpoint(e.touches);

            }

            updateTransform();
        } else if (e.touches.length === 1 && currentScale > 1) {

            offsetX = e.touches[0].pageX - initialTouchX;
            offsetY = e.touches[0].pageY - initialTouchY;
            updateTransform();
        }
    }, { passive: false });

    element.addEventListener('touchend', (e) => {
        if (e.touches.length === 0) {
            lastTouchEndTime = new Date().getTime();

            if (currentScale < 0.7) {
                currentScale = 1;
                offsetX = offsetY = 0;
                updateTransform();
            }

            if (currentScale > 1) {
                const maxOffsetX = (currentScale - 1) * element.width / 2;
                const maxOffsetY = (currentScale - 1) * element.height / 2;

                offsetX = Math.min(Math.max(offsetX, -maxOffsetX), maxOffsetX);
                offsetY = Math.min(Math.max(offsetY, -maxOffsetY), maxOffsetY);
                updateTransform();
            }
        }
    });

    function updateTransform() {
        element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${currentScale})`;
    }
}

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        if (soundEffects.select) {
            soundEffects.select.cloneNode(true).play();
        }

        document.body.classList.add('gallery-open');

        const overlay = document.createElement('div');
        overlay.classList.add('gallery-overlay');
        document.body.appendChild(overlay);

        const closeButton = document.createElement('button');
        closeButton.classList.add('close-gallery');
        closeButton.innerHTML = '&times;';
        document.body.appendChild(closeButton);

        const fullImageContainer = document.createElement('div');
        fullImageContainer.classList.add('fullscreen-image-container');
        document.body.appendChild(fullImageContainer);

        const imgElement = this.querySelector('img');
        if (imgElement) {
            const fullImage = document.createElement('img');
            fullImage.src = imgElement.src;
            fullImage.alt = imgElement.alt || 'Gallery Image';
            fullImage.classList.add('fullscreen-image');
            fullImageContainer.appendChild(fullImage);

            enablePinchZoom(fullImage);
        }

        this.classList.add('expanded');

        const closeGallery = () => {
            this.classList.remove('expanded');
            overlay.remove();
            closeButton.remove();
            fullImageContainer.remove();

            document.body.classList.remove('gallery-open');

            if (soundEffects.click) {
                soundEffects.click.cloneNode(true).play();
            }
        };

        closeButton.addEventListener('click', closeGallery);
        overlay.addEventListener('click', (e) => {

            if (e.target === overlay) {
                closeGallery();
            }
        });

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeGallery();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.removeEventListener('keydown', handleKeyDown);
            }
        });
    });
});

const galleryStyle = document.createElement('style');
galleryStyle.textContent = `
    .fullscreen-image-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1001;
        max-width: 95vw;
        max-height: 95vh;
        display: flex;
        justify-content: center;
        align-items: center;
        touch-action: none; 
    }

    .fullscreen-image {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        transform-origin: center;
        transition: transform 0.1s ease-out;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
    }

    .gallery-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        z-index: 1000;
        touch-action: none;
    }

    .close-gallery {
        position: fixed;
        top: 20px;
        right: 20px;
        font-size: 2.5rem;
        color: white;
        background: none;
        border: none;
        cursor: pointer;
        z-index: 1002;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .close-gallery:hover {
        color: #ff5555;
    }

    @media (max-width: 768px) {
        .close-gallery {
            top: 10px;
            right: 10px;
            font-size: 2rem;
            width: 40px;
            height: 40px;
        }

        .fullscreen-image-container {
            max-width: 100vw;
        }

        .fullscreen-image {
            max-width: 100%;
            max-height: 85vh;
        }
    }

    body.gallery-open {
        overflow: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
    }
`;

document.head.appendChild(galleryStyle);