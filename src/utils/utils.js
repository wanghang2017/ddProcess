export function arrayToStr(array) {
    let str = "";
    for (let i = 0; i < array.length; i++) {
        str += `["${array[i]}"]`;
    }
    return str;
}

if (!Number.prototype.cutNum) {
    Number.prototype.cutNum = function () { //判断Number对象是否有cutNum方法
        let num = '' + this; //this指需要转换的数，然后由number类型转为string类型
        let len = Math.ceil(num.length / 4);
        let arr = [];
        let v_len = num.length;
        while (len > 0) {
            let cut_start = v_len - 4 > 0 ? v_len - 4 : 0;
            let cut_len = v_len - 4 > 0 ? 4 : v_len;
            let v = num.substr(cut_start, cut_len);
            if (v.length != 4) {
                arr.push('0'.repeat(4 - v.length) + v);
            } else {
                arr.push(v);
            }
            len--;
            v_len -= 4;
        }
        return arr.length != 1 ? arr.reverse().join(',') : '' + arr;
    }
}
if (!Number.prototype.numToChinese) {
    Number.prototype.numToChinese = function () {
        //有小数点的分为两部分：小数前的数firstPart和小数后的数secondPart，小数前的数进行cutNum方法处理
        //如果小数前的数不足4位，添0补位
        let $this = '' + this,
            firstPart = '',
            secondPart = '',
            isSmall = false;
        if(isNaN(this))return;
        if( $this.indexOf("-")!=-1){
            // console.log($this.length);
            if($this.length<=1)return;
            $this=$this.split("-")[1];
            isSmall = true;
        }
        if (/\./.test($this)) {
            let arrPre = $this.split('.');
            firstPart = arrPre[0];
            if (firstPart.length > 12) {
                return '数字不能超过仟亿';
            }
            secondPart = arrPre[1];
            if (secondPart.length > 2) {
                return '小数点后的数字不能超过2位';
            }
        } else {
            firstPart = $this;
            if (firstPart.length > 12) {
                return '数字不能超过仟亿';
            }
        }
        //第一部分：处理小数前的数
        let firstPartArr = [];
        if (firstPart.length > 4) {
            firstPartArr = parseInt(firstPart).cutNum().split(','); //firstPart是字符串类型
        } else {
            firstPartArr = firstPartArr.concat('0'.repeat(4 - firstPart.length) + firstPart);
        }
        const arrMap = [['0', '零'], ['1', '壹'], ['2', '贰'], ['3', '叁'], ['4', '肆'],
        ['5', '伍'], ['6', '陆'], ['7', '柒'], ['8', '捌'], ['9', '玖']],
            unit = ['仟', '佰', '拾', ''];
        let map = new Map(arrMap), //创建Map对象
            splitAddUnit = [], //存放4位分割后的单位
            returnArr = []; //最终返回的值
        if(isSmall){
            returnArr.push("负");
        }
        if (firstPartArr.length == 3) {
            splitAddUnit = ['亿', '万'];
        } else if (firstPartArr.length == 2) {
            splitAddUnit = ['万'];
        } else {
            splitAddUnit = [''];
        }
        for (let k = 0; k < firstPartArr.length; k++) {
            for (let j = 0; j < firstPartArr[k].length; j++) {
                if (firstPartArr[k][j] != 0) {
                    //利用Map对象映射相应的值
                    returnArr.push(map.get(firstPartArr[k][j]) + unit[j]);
                }
            }
            if (splitAddUnit[k]) {
                returnArr.push(splitAddUnit[k]);
            }
        }
        returnArr.push('元');
        //第二部分：处理小数后的数
        if (secondPart) {
            if (/^0+$/.test(secondPart)) { //小数后的数全为0时
                returnArr.push('整');
            } else {
                const pointAfterUnit = ['角', '分'];
                for (let j = 0; j < secondPart.length; j++) {
                    let val = map.get(secondPart[j]) + pointAfterUnit[j];
                    returnArr.push(val);
                }
            }
        } else {
            returnArr.push('整');
        }
        return returnArr.join('');
    }
}
(1234660.12).numToChinese(); //number类型需要加圆括号



