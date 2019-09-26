var access_token = null;
var ppt=null;
var permanent_user_token = localStorage.getItem('permanent_user_token');
var permanent_page_access_token=localStorage.getItem('permanent_page_access_token');

var message=null;
console.log( " user token-->"+permanent_user_token);

window.fbAsyncInit = function () {
    FB.init({
        appId: '552802925464394',
        xfbml: true,
        version: 'v4.0',
         cookie:true
    });
    
    if(this.permanent_user_token !=null && this.permanent_page_access_token!=null){
        console.log('already connected..')
      
       readyToPost();
    }else{
       
        FB.getLoginStatus(function (response) {
            console.log(response)
            if (response.status === 'connected') {
               this. access_token = FB.getAccessToken();
                console.log(this.access_token+"----->")
                getPermanentAccessToken();
            } else {
                FB.login(function() {
                    var authResp = FB.getAuthResponse();
                   this. access_token = authResp.accessToken;
                    console.log('just logged in')
                    console.log(this.access_token)
                    getPermanentAccessToken();
                }, { scope: 'manage_pages,publish_pages,publish_to_groups' });
            } 
        });
    }   
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function getPermanentAccessToken(){

    // fetch permament user_token 
    $.ajax({
      url: "https://graph.facebook.com/v2.10/oauth/access_token?grant_type=fb_exchange_token&client_id=552802925464394&client_secret=672ad66e9b7ddb51cc326b708be751fb&fb_exchange_token="+this.access_token, 
      success: function(result){
          if(result.error){
              console.log('error has occurred..')
          }
      
     console.log( "result------------>"+JSON.stringify(result));
     console.log(result.access_token)
     console.log( localStorage.setItem('permanent_user_token',result.access_token))
      
      }});
    
    // this is  to fetch permament user access_token
      $.ajax({url: "https://graph.facebook.com/v2.10/521621015287890/accounts?access_token="+this.permanent_user_token, success: function(result){
      
        console.log( JSON.stringify(result));
        localStorage.setItem('permanent_page_access_token',result.data[2].access_token)
          
          }});
    readyToPost();
}
function getScheduleTime() {
    var dt = new Date();
    var time=parseInt((Number(dt)/1000)+600)
    return time;
  
}
function readyToPost(){
message = document.getElementById('post').value;
console.log(message)
 return message;
}

function schedulerPost() {
    var pageId = '114221043295873';
    FB.api('/' + pageId + '/feed', 'post', {
         message: readyToPost(),
        "scheduled_publish_time": getScheduleTime(),
        "published": false,
        access_token:localStorage.getItem('permanent_page_access_token'),
    }, function (info) {
        if (info.error) {
            document.getElementById('status').innerHTML = ' failed to post message on fb'
        }

        document.getElementById('status').innerHTML = ' shedule posted successfully..'
        document.getElementById('post').style.visibility = 'hidden';
        console.log(info);

    }); 
}

// getting basic user info
function getInfo() {
    FB.api('/me',{accessToken:FB.getAccessToken},function (response) {
            console.log(response)
        document.getElementById('status').innerHTML = 'user name is:' + response.name + 'and id is:' + response.id;
    });
}

function post() {
    // do post here....
    var pageId = '114221043295873'; // facebook page id from page info
    FB.api('/' + pageId + '/feed', 'post', {
        message: readyToPost(),
        access_token:localStorage.getItem('permanent_page_access_token')
    }, function (info) {
        document.getElementById('status').innerHTML = 'posted successfully..'
        document.getElementById('post').style.visibility = 'hidden';
        console.log(localStorage.getItem('permanent_page_access_token'))
        console.log(info);
    });

}

// scheduler post ........

function upload() {
    var imgURL = "http://farm4.staticflickr.com/3332/3451193407_b7f047f4b4_o.jpg";
    var pageId = '114221043295873';
    FB.api('/' + pageId + '/photos', 'post', {
        message: 'photo of tiger',
        url: imgURL,
        access_token: localStorage.getItem('permanent_page_access_token')
    }, function (info) {
        if (info.error) {
            document.getElementById('status').innerHTML = ' failed to post message on fb'
        }

        document.getElementById('status').innerHTML = ' photo posted successfully..'
        //document.getElementById('post').style.visibility = 'hidden';
        console.log(info);

    });
    

}