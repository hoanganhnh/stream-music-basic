/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable no-useless-concat */
/* eslint-disable no-unused-expressions */

const API_PLAY_MUSIC_BASE = `${window.location.origin}/play`;
const songDatas = [
    {
        srcImg: "./assets/img/1.jfif",
        nameAudio: "Feded",
        description: "Alan Walker-You were the shadow to my light",
    },
    {
        srcImg: "./assets/img/2.jfif",
        nameAudio: "Robin Hustin",
        description: "Alan Walker-You were the shadow to my light",
    },
    {
        srcImg: "./assets/img/3.jfif",
        nameAudio: "Linked",
        description: "Alan Walker-You were the shadow to my light",
    },
    {
        srcImg: "./assets/img/4.jfif",
        nameAudio: "Unknown Brain",
        description: "Alan Walker-You were the shadow to my light",
    },
    {
        srcImg: "./assets/img/5.jfif",
        nameAudio: "Ngôi Nhà Hoa Hồng",
        description: "Alan Walker-You were the shadow to my light",
    },
    {
        srcImg: "./assets/img/6.jfif",
        nameAudio: "The Ocean",
        description: "Alan Walker-You were the shadow to my light",
    },
    {
        srcImg: "./assets/img/7.jfif",
        nameAudio: "Hẹn Yêu",
        description: "Alan Walker-You were the shadow to my light",
    },
    {
        srcImg: "./assets/img/8.jfif",
        nameAudio: "Feded",
        description: "Alan Walker-You were the shadow to my light",
    },
    {
        srcImg: "./assets/img/9.jfif",
        nameAudio: "Zedd - Beautiful Now",
        description: "Alan Walker-You were the shadow to my light",
    },
    {
        srcImg: "./assets/img/10.jfif",
        nameAudio: "Waiting For Love",
        description: "Alan Walker-You were the shadow to my light",
    },
];

function render() {
    return songDatas
        .map(
            song => `
        <div class="col c-12 item-music">
            <a href="#" class="item song1">
                <div class="item__img">
                    <img class="img" src="${song.srcImg}" alt="">
                </div>
                <div class="item__info">
                    <h2 class="name-audio">${song.nameAudio}</h2>
                    <p>${song.description}</p>
                </div>
                <div class="item__icon">
                    <button>
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
                <audio id="song" class="song1"/>
            </a>
        </div>
        `,
        )
        .join("");
}

document.querySelector(".row").innerHTML = render();

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const audios = $$("#song");
const items = $$(".item");
const imgs = $$(".img");
const nameAudios = $$(".name-audio");

const pause = $(".fa-pause-circle");
const play = $(".btn-pause .fa-play-circle");
const displayImg = $(".item-img");
const displayHeading = $(".heading-audio");
const process = $(".progress");
const iconMenu = $(".icon-menu");
const toggleMenu = $(".toggle-menu");
const menuContent = $(".toggle-menu__content");
const logoutBtn = $("#logout");

iconMenu.onclick = () => {
    const classToggleMenu = toggleMenu.getAttribute("class");
    if (classToggleMenu.includes("hidden")) {
        toggleMenu.classList.remove("hidden");
        toggleMenu.classList.add("show");
        menuContent.classList.add("show-content");
    }
};

window.onclick = event => {
    if (event.target === toggleMenu) {
        const classToggleMenu = toggleMenu.getAttribute("class");
        if (classToggleMenu.includes("show")) {
            menuContent.classList.remove("show-content");
            toggleMenu.classList.remove("show");
            toggleMenu.classList.add("hidden");
        }
    }
};

logoutBtn.onclick = () => {
    window.localStorage.removeItem("username");
    fetch(`${window.location.origin}/logout`)
        .then(data => {
            // eslint-disable-next-line no-console
            console.log(data);
            window.location.href = "/login";
        })
        .catch(err => {
            // eslint-disable-next-line no-console
            console.log(err);
        });
};

(function getCurrentDate() {
    const timeCurrent = $(".time-current");
    const currentdate = new Date();

    const datetime = `${currentdate.getDate()}/${
        currentdate.getMonth() + 1
    }/${currentdate.getFullYear()}`;

    timeCurrent.innerHTML = datetime;
})();

(function getCurrentUser() {
    const userHeading = $(".display-control__heading--info p");
    const username = window.localStorage.getItem("username");

    if (username) {
        userHeading.innerHTML = username.toUpperCase();
    }
})();

const imgRotate = displayImg.animate([{ transform: "rotate(360deg)" }], {
    duration: 10000,
    iterations: Infinity,
});

imgRotate.pause();

const app = {
    resetAudio() {
        const preIndex = app.currentIndex;
        audios[preIndex].removeAttribute("src");
    },
    displayHeadingAudio(indexName) {
        const nameAudio = nameAudios[indexName].textContent;
        displayHeading.textContent = nameAudio;
    },
    displayImgae(indexImage) {
        const linkImg = imgs[indexImage].getAttribute("src");
        displayImg.style.backgroundImage = `url(${linkImg})`;
    },
    playAudio(indexAudio) {
        audios.forEach((audio, index) => {
            audio?.pause();
            items[index].style.backgroundColor = "#fff";
        });

        const audio = audios[indexAudio];
        audio.setAttribute("src", `${API_PLAY_MUSIC_BASE}/${indexAudio}`);
        items[indexAudio].style.backgroundColor = "#d1ceff";
        audio.play();
        audio.currentTime = 0;

        // auto next audio
        audio.onended = app.next;
        // time up date
        audio.ontimeupdate = () => {
            if (audio.duration) {
                process.value = audio.currentTime * (100 / audio.duration);

                let curmins = Math.floor(audio.currentTime / 60);
                let cursecs = Math.floor(audio.currentTime - curmins * 60);
                const durmins = Math.floor(audio.duration / 60);
                let dursecs = Math.floor(audio.duration - durmins * 60);

                cursecs < 10 && (cursecs = `0${cursecs}`);
                dursecs < 10 && (dursecs = `0${dursecs}`);
                curmins < 10 && (curmins = `0${curmins}`);
                $(".curtime").innerHTML = `${curmins}:${cursecs}`;
                $(".durtime").innerHTML = `${durmins}:${dursecs}`;
            } else {
                $(".curtime").innerHTML = "00" + ":" + "00";
                $(".durtime").innerHTML = "00" + ":" + "00";
            }
        };
        // mouse controls

        process.addEventListener("change", () => {
            const seekTime = (audio.duration * process.value) / 100;
            audio.currentTime = seekTime;
        });
    },
    run() {
        items.forEach((item, index) => {
            item.onclick = () => {
                app.playAudio(index);
                app.displayImgae(index);
                app.displayHeadingAudio(index);
                app.currentIndex = index;
                pause.style.display = "block";
                play.style.display = "none";
                imgRotate.play();
            };
        });
    },
    next() {
        app.resetAudio();
        app.currentIndex++;
        if (app.currentIndex > audios.length - 1) {
            app.currentIndex = 0;
        }
        pause.style.display = "block";
        play.style.display = "none";
        app.playAudio(app.currentIndex);
        app.displayImgae(app.currentIndex);
        app.displayHeadingAudio(app.currentIndex);

        return audios[app.currentIndex];
    },
    previous() {
        app.resetAudio();
        app.currentIndex--;
        if (app.currentIndex < 0) {
            app.currentIndex = audios.length - 1;
        }
        pause.style.display = "block";
        play.style.display = "none";
        app.playAudio(app.currentIndex);
        app.displayImgae(app.currentIndex);
        app.displayHeadingAudio(app.currentIndex);
    },
    pauseAudio() {
        const audio = audios[app.currentIndex];
        if (audio && audio.paused) {
            audio?.play();
            imgRotate?.play();
            pause.style.display = "block";
            play.style.display = "none";
        } else {
            pause.style.display = "none";
            play.style.display = "block";
            audio?.pause();
            imgRotate.pause();
        }
    },
    repeat() {
        const audio = audios[app.currentIndex];

        if (audio.loop) {
            audio.loop = false;
            $(".btn-repeat i").style.color = "#8884b7";
        } else {
            $(".btn-repeat i").style.color = "#eb003e";
            audio.loop = true;
        }
    },
    random() {
        const randomIndex = Math.floor(
            Math.floor(Math.random() * audios.length),
        );
        app.resetAudio();
        app.currentIndex = randomIndex;
        app.playAudio(app.currentIndex);
        app.displayImgae(app.currentIndex);
        app.displayHeadingAudio(app.currentIndex);
        pause.style.display = "block";
        play.style.display = "none";
        imgRotate.play();
    },
    handleEvent() {
        // event scroll top
        const itemImg = $(".item-img");
        const itemImgWidth = itemImg.offsetWidth;

        document.onscroll = () => {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newItemImgWidth = itemImgWidth - scrollTop;

            itemImg.style.width =
                newItemImgWidth > 0 ? `${newItemImgWidth}px` : 0;
            itemImg.style.height =
                newItemImgWidth > 0 ? `${newItemImgWidth}px` : 0;
            itemImg.style.opacity = newItemImgWidth / itemImgWidth;
        };

        $(".btn-next").onclick = app.next;
        $(".btn-previous").onclick = app.previous;
        $(".btn-pause").onclick = app.pauseAudio;
        $(".btn-repeat").onclick = app.repeat;
        $(".btn-random").onclick = app.random;
    },
};

app.run();
app.handleEvent();
