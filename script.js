const animalCards = document.querySelectorAll('.animal-card');
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
bgMusic.volume = 0.15; // ווליום נמוך כדי שלא יפריע לקולות החיות
let currentAudio = null;
let currentAnimation = null; 
let currentIcon = null;      
let animationTimeout = null; 

// שליטה במוזיקה
musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.innerText = "🔇 Pause Music";
    } else {
        bgMusic.pause();
        musicToggle.innerText = "🔊 Play Music";
    }
});
// ביטול מצבים קודמים כדי למנוע בלגן בסאונד ובאנימציה
function playAnimalSoundAndAnimate(soundFile, element, animalName) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    if (currentAnimation) {
        currentAnimation.cancel(); 
    }
    if (currentIcon) {
        currentIcon.remove(); 
    }
    if (animationTimeout) {
        clearTimeout(animationTimeout); 
    }
    
    // וידוא שכל הכרטיסיות מאחור
    animalCards.forEach(card => card.style.zIndex = '1');
    currentAudio = new Audio('assets/sounds/' + soundFile);
    currentAudio.volume = 1.0; 

    // האזנה לאירוע טעינת הנתונים
    currentAudio.addEventListener('loadedmetadata', () => {
        const durationMs = currentAudio.duration * 1000;
        currentAudio.play();
        triggerAnimalAnimation(element, animalName, durationMs);
    });
}

// יצירת אובייקט השומר לכל חיה את האימוג'י שלה ואת האנימציה הייחודית
const animalAnimations = {
    'Frog': { emoji: '🐸', frames: [{ transform: 'translateY(0)' }, { transform: 'translateY(-80px)' }, { transform: 'translateY(0)' }] },
    'Lion': { emoji: '🦁', frames: [{ transform: 'scale(1) translateX(0)' }, { transform: 'scale(1.5) translateX(50px)' }, { transform: 'scale(1) translateX(0)' }] },
    'Monkey': { emoji: '🐒', frames: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(30deg)' }, { transform: 'rotate(-30deg)' }, { transform: 'rotate(0deg)' }] },
    'Cow': { emoji: '🐮', frames: [{ transform: 'translateX(0)' }, { transform: 'translateX(-20px)' }, { transform: 'translateX(20px)' }, { transform: 'translateX(0)' }] },
    'Wolf': { emoji: '🐺', frames: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-25deg)' }, { transform: 'rotate(0deg)' }] }, // זאב מיילל - הטיה של הראש לאחור
    'Dolphin': { emoji: '🐬', frames: [{ transform: 'translate(0, 0) rotate(0deg)' }, { transform: 'translate(30px, -60px) rotate(45deg)' }, { transform: 'translate(60px, 0) rotate(90deg)' }] }, // דולפין קופץ - שילוב של תנועה למעלה, הצידה וסיבוב שיוצר קשת
    'Elephant': { emoji: '🐘', frames: [{ transform: 'translateY(0)' }, { transform: 'translateY(-15px)' }, { transform: 'translateY(0) scale(1.1)' }, { transform: 'translateY(0) scale(1)' }] }, // פיל רוקע - קפיצה קטנה ומעיכה כלפי מטה שנותנת תחושת כובד
    'Default': { emoji: '✨', frames: [{ opacity: 1 }, { opacity: 0.5 }, { opacity: 1 }] }
};

function triggerAnimalAnimation(element, animalName, durationMs) {
    const animData = animalAnimations[animalName] || animalAnimations['Default'];

    // שמירת האלמנט המונפש למשתנה הגלובלי
    currentIcon = document.createElement('div');
    currentIcon.innerText = animData.emoji;
    currentIcon.style.position = 'absolute';
    currentIcon.style.fontSize = '50px';
    currentIcon.style.pointerEvents = 'none'; 
    
    element.style.position = 'relative';
    element.style.zIndex = '10'; // מקדמים את הכרטיס שנלחץ לחזית
    element.appendChild(currentIcon);

    /* 
     * אלמנט שלא נלמד בכיתה: Web Animations API.
     *    מאפשר להריץ אנימציות גמישות שמתאימות את האורך שלהן לזמן הקובץ המדויק.
     */
    // שמירת האנימציה למשתנה הגלובלי כדי שתתבטל במידת הצורך
    currentAnimation = currentIcon.animate(animData.frames, { duration: durationMs, easing: 'ease-in-out' });

    //   האלמנט ימחק מהדף בסוף האנימציה
    animationTimeout = setTimeout(() => {
        if (currentIcon) {
            currentIcon.remove();
            currentIcon = null; // איפוס 
        }
        element.style.zIndex = '1'; 
    }, durationMs);
}

// לוגיקת הלחיצה על הכרטיסיות
animalCards.forEach(card => {
    card.addEventListener('click', function() {
        const soundFile = this.getAttribute('data-sound');
        const animalName = this.querySelector('img').alt; 
        playAnimalSoundAndAnimate(soundFile, this, animalName);
    });
});

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase(); 
    const card = document.querySelector(`.animal-card[data-key="${key}"]`);
    // הפעלת הפונקציונליות של העכבר גם במקלדת
    if (card) {
        card.click(); 
    }
});