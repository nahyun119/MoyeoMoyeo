<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="write">
    <img id="freeboardImg" src="../assets/modifyfreeboard.png" style ="height: 42px; width:250px; margin-left: 150px;">
    <hr align="left" style ="color : #dddfe6; border: 1px solid; margin-left: 120px; margin-right: 120px; border-style: dashed;"/>
    <br>
    <div class ="writeboard">
    <span style="font-size: 30px;" >Title</span>
    <br>
    <br>
    <input type="text" v-model="title" style="height:25px; width: 1100px; border-left: none; border-right: none; border-top:none;" :placeholder ="boardtitle" required>
    <br>
    <br>
    <span style="font-size: 30px;" >Category</span>
    <br>
    <br>
    <select v-model="gatheringCategory" required>
        <option value="" disabled selected>{{ boardcategory }}</option>
        <option value="university">University</option>
        <option value="study">Study</option>
        <option value="contestExhibit">Contest Exhibit</option>
        <option value="culture">Culture Event</option>
        <option value="volunteerWork">Volunteer Work</option>
        <option value="play">Play</option>
        <option value="etc">Etc</option>
    </select>
    <br>
    <br>
    <span style="font-size: 30px;">Image</span>
    <br>
    <br>
    <input type="file" @change="fileUpload"> <!--첨부파일 누르는 부분-->
    <!-- style="height:25px; width: 1100px; border-left: none; border-right: none; border-top:none;" placeholder ="Image URL(optional)">
    <button id ="uploadButton" v-on:change="fileUpload">File Upload</button> 업로드 버튼-->
    <br>
    <br>
    <div id = "userfileImg"/> <!--유저가 올린 이미지 사진-->
    <br>
    <br>
    <span style="font-size: 30px;" >Content</span>
    <br>
    <br>
    <input type="textarea" v-model="content" style="width: 1100px; height: 400px" :placeholder = "boardcontent" required>
    <br>
    <br>
    <button id="modifyButton" v-on:click="modifyContent" style ="margin-left: 500px; width:100px; height: 40px; font-size: 20px;">Modify</button>
    </div>
    </div>
</template>
<script>
import axios from 'axios';


var userid = '';
var imageCount = 0;
var imageURL ='';
var userNickName = '';
var useremail ='';

export default {
    name: 'writefreeboard',
    data() {
        return {
            title : '',
            content: '',
            boardtitle : '',
            boardcontent : '',
            boardcategory : '',
            gatheringCategory :'',
        }
    },

    async beforeCreate() {

        const result = await axios.get("/api/login");
        this.sessionCheck = result.data.logined;
        userid = result.data.name;
        const resultEmail = await axios.get('/api/users/getEmail/'+userid);
        useremail = resultEmail.data;
        userNickName = result.data.nickname;
        const boardresult = await axios.get("/api/gatheringboard/" + this.$route.params.idx);
        this.boardtitle = boardresult.data.title;
        this.boardcontent = boardresult.data.content;
        this.boardcategory = boardresult.data.category;

    },
    methods: {
        modifyContent: function() { //제목이랑 내용 없이 완료 버튼 누르면 경고창 나오는거
            var boardindex = this.$route.params.idx;
            if(this.title == "" || this.content == "")
            {
                alert("Please write Title and Content")
                this.title = '';
                this.content ='';
                document.getElementById("userfileImg").innerHTML='';
                
                //document.getElementById("userfileImg").removeChild(document.getElementById("userfileImg").firstChild);
            }
            else {
                if(this.imageURL != ''){
                     axios.put("/api/gatheringboard/modify/"+boardindex,{title: this.title, category : this.gatheringCategory, url :imageURL, content : this.content, userID : userid, writer: userNickName, email : useremail});
                }
                else {
                     axios.put("/api/gatheringboard/modify/"+boardindex,{title: this.title, category : this.gatheringCategory,content :this.content, userID : userid, writer: userNickName, email : useremail});

                }
            this.$router.push({
                name: 'free'
            });
                this.title='';
                this.content='';
            }
        },
        fileUpload : function(event) { //첨부파일을 올리는 메또드 
            var fr = new FileReader();
            if (imageCount == 0) {
            var newImg = document.createElement("img");
            fr.onload = function() {
                 //inputImgSrc = fr.result;
                 newImg.src = fr.result;
                 imageURL = fr.result;
                 newImg.classList.add("userUploadImg");
                 newImg.style.height = '200px';
                 newImg.style.width = '200px';
                
                 document.querySelector("#userfileImg").appendChild(newImg);
            }
            fr.readAsDataURL(event.target.files[0]);
            imageCount++;
            //document.getElementById("userfileImg").innerHTML = 
            }
            else {
                alert("You can upload one Image file.");
            }
        }
    }

}
</script>
<style>
.writeboard {
    margin-left: 170px;
    display: inline-block;
    border : 1.5px solid #9DC3C1;
    padding : 20px;
}
#writeButton {
    background-color : #9DC3C1;
    border : 1.5px solid #9DC3C1;
}
#writeButton:hover{
    background-color : white;
    border : 1.5px solid #9DC3C1;
}




</style>