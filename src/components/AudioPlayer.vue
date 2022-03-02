<template>
  <v-bottom-sheet v-model="sheet" fullscreen>
    <template v-slot:activator="{ on, attrs }">
      <!-- 播放器 -->

      <div class="player" :class="{ hide: sheet }" v-bind="attrs" v-on="on">
        <div class="left">
          <div class="pic">
            <img src="../assets/test.jpeg" alt="" />
          </div>
          <div class="content">寻常歌 - 不才</div>
        </div>

        <div class="button">
          <v-progress-circular class="button-play" :rotate="-90" :size="26" :width="0.5" :value="value" color="#5e5e5e">
            <v-btn icon @click.stop="isplay = !isplay" plain>
              <v-icon size="18" color="#363636">{{ isplay ? 'mdi-pause' : 'mdi-play' }}</v-icon>
            </v-btn>
          </v-progress-circular>

          <div class="text-center">
            <v-dialog v-model="songList" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon class="button-list" v-bind="attrs" v-on="on" plain>
                  <v-icon size="26" color="#363636">mdi-playlist-music</v-icon>
                </v-btn>
              </template>

              <v-card>
                <v-card-title class="text-h5 grey lighten-2">播放列表</v-card-title>

                <v-card-text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="songList = false"> I accept </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </div>
    </template>
    <!-- 播放器 -->
    <v-sheet class="player-container" height="100vh">
      <v-btn class="mt-6" text color="error" @click="sheet = !sheet"> close </v-btn>
      <div class="my-3">This is a bottom sheet using the inset prop</div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
export default {
  data() {
    return {
      sheet: false,
      value: 10,
      isplay: false,
      songList: false
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: space-between;
  bottom: 0px;
  transition: 0.5s;
  z-index: 4;
  height: 53px;
  width: 100vw;
  border-top: 0.5px solid #ececec;
  background-color: rgba(255, 255, 255, 0.95);

  .left {
    display: flex;
    .pic {
      background-color: #050507;
      width: 40px;
      height: 40px;
      border-radius: 50% !important;
      margin: -18px 9px 0 16px;
      overflow: hidden;
      text-align: center;
      img {
        margin-top: 6.5px;
        width: 27px;
        height: 27px;
        border-radius: 50%;
      }
    }

    .content {
      font-size: 13px;
      color: #2b2b2b;
      width: 180px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .button {
    display: flex;
    align-items: center;
    .button-play {
      margin-right: 23px;
    }
    .button-list {
      margin-right: 17px;
    }
  }
}
.hide {
  bottom: -1000px;
}
</style>
