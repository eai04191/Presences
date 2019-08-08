var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var presence = new Presence({
    clientId: "608835741501620226",
    mediaKeys: true
}), strings = presence.getStrings({
    play: "presence.playback.playing",
    pause: "presence.playback.paused"
});
presence.on("MediaKeys", (key) => {
    const miniPlayer = document.querySelector(".mini-player");
    function clickForwardButton() {
        const forwardButton = document.querySelector(".forward.button");
        if (forwardButton)
            forwardButton.click();
    }
    function clickBackwardButton() {
        const backwardButton = document.querySelector(".backward.button");
        if (backwardButton)
            backwardButton.click();
    }
    switch (key) {
        case "pause":
        case "play": {
            const pauseButton = document.querySelector(".play-pause");
            if (pauseButton)
                pauseButton.click();
            break;
        }
        case "nextTrack": {
            if (!!miniPlayer) {
                miniPlayer.click();
                setTimeout(clickForwardButton, 500);
            }
            else {
                clickForwardButton();
            }
            break;
        }
        case "previousTrack": {
            if (!!miniPlayer) {
                miniPlayer.click();
                setTimeout(clickBackwardButton, 500);
            }
            else {
                clickBackwardButton();
            }
            break;
        }
    }
});
const workMeta = { title: null, maker: null };
presence.on("UpdateData", () => __awaiter(this, void 0, void 0, function* () {
    if (document.querySelector(".workinfo")) {
        const workinfo = document.querySelector(".workinfo");
        workMeta.title = workinfo.querySelector(".work-name").textContent;
        workMeta.maker = workinfo.querySelector(".maker-name").textContent;
    }
    if (document.querySelector(".photo-viewer")) {
        const viewer = document.querySelector(".photo-viewer");
        const title = workMeta.title || viewer.getAttribute("path").split("/")[0];
        const pages = viewer
            .querySelector(".photo-page-count")
            .textContent.split(" / ");
        presence.setActivity({
            details: workMeta.title || title,
            state: workMeta.maker
                ? `${workMeta.maker} - ${pages[0]} / ${pages[1]}`
                : `${pages[0]} / ${pages[1]}`,
            largeImageKey: "lg"
        });
    }
    else if (document.querySelector(".audio-player, .mini-player")) {
        const player = document.querySelector(".audio-player, .mini-player");
        const isMiniPlayer = player.classList.contains("mini-player");
        const title = player.querySelector(".title").textContent;
        const album = player.querySelector(".album").textContent;
        const isPlaying = !!player.querySelector(".play-pause svg[viewBox='0 0 77 100']");
        let elapsedSec;
        if (!isMiniPlayer) {
            const elapsed = player
                .querySelector(".elapsed-time")
                .textContent.split(":");
            elapsedSec = parseInt(elapsed[0]) * 60 + parseInt(elapsed[1]);
        }
        const presenceData = {
            details: title,
            state: album,
            largeImageKey: "lg",
            smallImageKey: isPlaying ? "play" : "pause",
            smallImageText: isPlaying
                ? (yield strings).play
                : (yield strings).pause
        };
        if (isPlaying) {
            presenceData.startTimestamp =
                Math.floor(Date.now() / 1000) - elapsedSec;
        }
        presence.setActivity(presenceData, isPlaying);
    }
    else {
        presence.clearActivity();
    }
}));
