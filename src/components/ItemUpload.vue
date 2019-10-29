<template>
  <div class="item-upload">
    <div class="upload-title">
      <span class="title-neccesarry" v-if="validator.required">*</span>
      {{text}}
    </div>
    <div class="upload-content">
      <div v-for="(file,index) in fileList" :key="index" class="img-container">
        <img :src="file" class="upload-img" />
        <span class="img-delete" @click="handleDelete(index)">X</span>
      </div>
      <el-upload
        class="avatar-uploader"
        :multiple="true"
        :action="uploadHost"
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
import { arrayToStr, uploadHost } from "@/api/form.js";
let count = 0;
export default {
  name: "itemUpload",
  created(){
    count = 0;
  },
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
      uploadHost: `${uploadHost}?cuid=${localStorage.getItem("userId")}`,
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
      count--;
      // console.log(count);
      let fileList = [...this.fileList];
      fileList.splice(index, 1);
      this.fileList = fileList;
      this.changeFormData({ key: this.computedColumn, value: this.fileList });
    },
    handleAvatarSuccess(res, file) {
      this.fileList = [...this.fileList, res];
      this.changeFormData({ key: this.computedColumn, value: this.fileList });
    },
    handleAvatarError(err, file, fileList) {
      count --;
      this.$message.error(err.toString());
    },
    handleAvatarProgress(event, file, fileList) {},
    beforeAvatarUpload(file, ...args) {
      // console.log(args);
      count++;
      if (count >9) {
        count = 9;
        // console.log(count);
        this.$message.error("最多上传九张图片");
        return false;
      }
      // return;
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isGIF = file.type === "image/gif";
      // const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error("上传图片只能是 JPG, PNG,GIF  格式!");
      }
      if (this.fileList.length >= 9) {
        this.$message.error("最多上传九张图片");
        return false;
      }
      return isJPG || isPNG || isGIF;
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
  .img-container {
    width: 3em;
    height: 3em;
    // overflow: hidden;
    margin-right: 1em;
    position: relative;
    margin-bottom: 0.5em;
    img {
      width: 100%;
      height: 100%;
      // height: auto;
    }
    .img-delete {
      cursor: pointer;
      width: 0.9em;
      height: 0.9em;
      font-size: 0.8em;
      text-align: center;
      position: absolute;
      top: -0.45em;
      right: -0.3em;
      border-radius: 50%;
      // border: 1px solid red;
      background: #555;
      color: #fff;
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