import { Howl } from "howler";
import { defineStore } from "pinia";
import helper from "../includes/helper";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    current_song: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    playerProgress: "0%",
  }),
  getters: {
    playing: (state) => {
      if (state.sound.playing) return state.sound.playing();
      return false;
    },
  },
  actions: {
    progress() {
      this.seek = helper.formatTime(this.sound.seek());
      this.duration = helper.formatTime(this.sound.duration());

      this.playerProgress = `${
        (this.sound.seek() / this.sound.duration()) * 100
      }%`;

      if (this.sound.playing()) {
        requestAnimationFrame(this.progress);
      }
    },
    handlePlaySong(song) {
      if (this.sound instanceof Howl) this.sound.unload();

      this.current_song = song;
      this.sound = new Howl({
        src: [song.url],
        html5: true,
      });

      this.sound.play();

      this.sound.on("play", () => {
        requestAnimationFrame(this.progress);
      });
    },
    updateSeek(event) {
      if (!this.sound.playing) return;

      const { x, width } = event.currentTarget.getBoundingClientRect();
      // Document = 2000, Timeline - 1000, clientx = 1000 Distance - 50
      const clientX = event.clientX - x;
      const percentage = clientX / width;
      const seconds = this.sound.duration() * percentage;

      this.sound.seek(seconds);
      this.sound.once("seek", this.progress);
    },
    async toggleAudio() {
      console.log("TOGGLE AUDIO");
      if (!this.sound.playing) return;

      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    },
  },
});
