import { Howl } from "howler";
import { defineStore } from "pinia";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    current_song: {},
    sound: {},
    
  }),
  getters: {
    playing: (state) => {
      if (state.sound.playing) return state.sound.playing();
      return false;
    },
  },
  actions: {
    handlePlaySong(song) {
      console.log(song);
      this.current_song = song;
      this.sound = new Howl({
        src: [song.url],
        html5: true,
      });

      this.sound.play();
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
