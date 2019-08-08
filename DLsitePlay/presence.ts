var presence = new Presence({
        clientId: "608835741501620226",
        mediaKeys: true
    }),
    strings = presence.getStrings({
        play: "presence.playback.playing",
        pause: "presence.playback.paused"
    });

presence.on("MediaKeys", (key: string) => {
    const miniPlayer: HTMLElement = document.querySelector(".mini-player");

    function clickForwardButton() {
        const forwardButton: HTMLElement = document.querySelector(
            ".forward.button"
        );
        if (forwardButton) forwardButton.click();
    }

    function clickBackwardButton() {
        const backwardButton: HTMLElement = document.querySelector(
            ".backward.button"
        );
        if (backwardButton) backwardButton.click();
    }

    switch (key) {
        case "pause":
        case "play": {
            const pauseButton: HTMLElement = document.querySelector(
                ".play-pause"
            );
            if (pauseButton) pauseButton.click();
            break;
        }
        case "nextTrack": {
            if (!!miniPlayer) {
                miniPlayer.click();
                setTimeout(clickForwardButton, 500);
            } else {
                clickForwardButton();
            }
            break;
        }
        case "previousTrack": {
            if (!!miniPlayer) {
                miniPlayer.click();
                setTimeout(clickBackwardButton, 500);
            } else {
                clickBackwardButton();
            }
            break;
        }
    }
});

const workMeta = { title: null, maker: null };

presence.on("UpdateData", async () => {
    if (document.querySelector(".workinfo")) {
        const workinfo = document.querySelector(".workinfo");
        workMeta.title = workinfo.querySelector(".work-name").textContent;
        workMeta.maker = workinfo.querySelector(".maker-name").textContent;
    }

    if (document.querySelector(".photo-viewer")) {
        const viewer = document.querySelector(".photo-viewer");
        const title =
            workMeta.title || viewer.getAttribute("path").split("/")[0];
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
    } else if (document.querySelector(".audio-player, .mini-player")) {
        const player = document.querySelector(".audio-player, .mini-player");
        const isMiniPlayer = player.classList.contains("mini-player");

        const title = player.querySelector(".title").textContent;
        const album = player.querySelector(".album").textContent;
        const isPlaying = !!player.querySelector(
            ".play-pause svg[viewBox='0 0 77 100']"
        );
        let elapsedSec; //, remainingSec;

        if (!isMiniPlayer) {
            const elapsed = player
                .querySelector(".elapsed-time")
                .textContent.split(":");
            // const remaining = player
            //     .querySelector(".remaining-time")
            //     .textContent.split(":");

            elapsedSec = parseInt(elapsed[0]) * 60 + parseInt(elapsed[1]);
            // remainingSec = parseInt(remaining[0]) * 60 + parseInt(remaining[1]);
        }

        const presenceData: presenceData = {
            details: title,
            state: album,
            largeImageKey: "lg",
            smallImageKey: isPlaying ? "play" : "pause",
            smallImageText: isPlaying
                ? (await strings).play
                : (await strings).pause
        };

        if (isPlaying) {
            presenceData.startTimestamp =
                Math.floor(Date.now() / 1000) - elapsedSec;
        }

        presence.setActivity(presenceData, isPlaying);
    } else {
        presence.clearActivity();
    }
});
