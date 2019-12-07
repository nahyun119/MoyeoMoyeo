var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var myDataBase=require('../db/db_conn.js');
var connection = myDataBase.init();
var selectedNickName = '';

connection.connect(function (err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});
router.get('/getNickName:userid',function(req,res,next){
    connection.query(`SELECT nickname FROM university_list.user_info WHERE identity='${req.params.userid}'`,
        function(err,results){
            selectedNickName= results;
            res.send(selectedNickName);
        });
});
module.exports = router;
