<template>
  <div class="item-upload">
    <div class="upload-title">
      <span class="title-neccesarry" v-if="validator.required">*</span>
      {{text}}
    </div>
    <div class="upload-content">
      <div v-for="(file,index) in fileList" :key="index" class="file-container">
        <div class="file-left">
          <span>
            <img :src="file.url" v-if="file.isImg" />
            <span v-else>{{file.show}}</span>
          </span>
        </div>
        <div class="file-center">
          <p>{{file.name}}</p>
          <span>{{file.size}}</span>
        </div>
        <div class="file-right" @click="handleDelete(index)">
          <span>X</span>
        </div>
      </div>
      <el-upload
        class="avatar-uploader"
        :action="uploadFileHost"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :on-error="handleAvatarError"
        :on-progress="handleAvatarProgress"
        :before-upload="beforeAvatarUpload"
      >
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { arrayToStr, uploadFileHost } from "@/api/form.js";

export default {
  name: "itemUploadFile",
  props: {
    text: String,
    column: String,
    tips: String,
    validator: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      uploadFileHost:`${uploadFileHost}?cuid=${localStorage.getItem("userId")}`,
      // imageUrl:"",
      fileList: []
    };
  },
  computed: {
    computedColumn() {
      return this.column.split(",");
    },
    ...mapState({
      ddd(state) {
        let key = this.computedColumn;
        let str = `state.form.form`;
        if (key.length > 1) {
          str += arrayToStr([...key, "value"]);
          return eval(str);
        }
        return state.form.form[this.column].value;
      }
    })
  },
  methods: {
    ...mapMutations("form", ["changeFormData"]),

    // handelImgeChange(file, fileList) {
    //   // console.log(file, fileList);
    // },
    handleDelete(index) {
      let fileList = [...this.fileList];
      fileList.splice(index, 1);
      this.fileList = fileList;
      this.changeFormData({ key: this.computedColumn, value: this.fileList });
    },
    handleAvatarSuccess(res, file) {
    //   console.log(file);
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      const isGIF = file.raw.type === "image/gif";
      let isImg = false;
      if (isJPG || isPNG || isGIF) {
        isImg = true;
      }
      let show = "";
      if (!isImg) {
        let arr = file.name.split(".");
        show = arr[arr.length - 1];
      }
      let size = (file.size / 1024).toFixed(2) + "k";
      let name = file.name;

      this.fileList = [...this.fileList, { size, name, url: res, isImg, show }];
      //   console.log(fileList);
      this.changeFormData({
        key: this.computedColumn,
        value: this.fileList.map(item => item.url)
      });
    },
    handleAvatarError(err, file, fileList) {
      this.$message.error(err.toString());
    },
    handleAvatarProgress(event, file, fileList) {},
    beforeAvatarUpload(file, ...args) {
      // console.log(file);
      const isLt2M = file.size / 1024 / 1024 < 100;
      if (!isLt2M) {
        this.$message.error("大小不超过100M");
        return false;
      }
      return isLt2M;
    }
  }
};
</script>

<style lang="less">
.item-upload {
  padding: 0.5em;
  background: #fff;
  .title-neccesarry {
    color: red;
    font-size: 1em;
  }
  span {
    width: 6em;
    text-align: left;
  }
  .upload-title {
    text-align: left;
    margin-bottom: 1em;
  }
}
.upload-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .file-container {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 0.5em 0;
    .file-left {
      width: 20%;
      height: 3em;
      // height: auto;
      //   background: red;
      display: flex;
      align-items: center;
      span {
        width: 3em;
        height: 3em;
        // background: red;
        img {
          width: 100%;
          height: 100%;
        }
        span {
          display: inline-block;
          width: 3em;
          height: 3em;
          line-height: 3em;
          background: #555;
          color: #fff;
          text-align: center;
        }
      }
    }
    .file-center {
      width: 70%;
      text-align: left;
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 70%;
      }
    }
    .file-right {
      width: 10%;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        background: #000;
        color: #fff;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        text-align: center;
        line-height: 1em;
        padding: 0.2em;
      }
    }
  }
}
.avatar-uploader {
  width: 3em;
  height: 3em;
  overflow: hidden;
  .el-upload {
    width: 100%;
    height: 100%;
  }
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  background: #f1f1f1;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>