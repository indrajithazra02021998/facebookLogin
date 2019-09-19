var access_token = null;
var ppt=null;
var permanent_user_token = localStorage.getItem('permanent_user_token');
var permanent_page_access_token=localStorage.getItem('permanent_page_access_token');
//var ppt1="EAAG3O7pwx9UBADOXUAZAW1HWe5aZCs1HfLZCefG9YgHVLXPgNr24xF8yTtETvpZAXD9iY6mVVoHXMbp1hkYTBxO0jOGjKh8uIsZBL1uyXpOKIufSHbNubq9N8OGKaog1BrEnOpzX4nflY54py5fnCcGa8krweDay7waxNWElQsz4c3rxah0wg";
//var ppt_new="EAAG3O7pwx9UBABPZAQ77gSDncfLTjAdMZCsZCZAd76jFgCWwzpIa4d2OUhQDuiCCZB7efQ0gQhNlFRDqM0ODx34j9E9E2M7mW6pe2O5t9r63FeIrz8wTsWAO4tZAcA7Io7OHJNuK3yarz1mph6NrdUZCfW6kvV5aKPWYvTD9IpgQrLloyeeVuWc"
var message=null;
console.log(permanent_page_access_token);

window.fbAsyncInit = function () {
    FB.init({
        appId: '482942135617493',
        xfbml: true,
        version: 'v4.0'
    });

    if(permanent_user_token !=null){
        console.log('already connected..')
     readyToPost();
    }else{
       
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                access_token = FB.getAccessToken();
               
                getPermanentAccessToken();
            } else {
                FB.login(function() {
                   
                    var authResp = FB.getAuthResponse();
                    access_token = authResp.accessToken;
                    console.log('just logged in')
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

      $.ajax({url: "https://graph.facebook.com/v2.10/oauth/access_token?grant_type=fb_exchange_token&client_id=482942135617493&client_secret=60cd2cd2d4497e6a1f83af885a5b7c09&fb_exchange_token="+access_token, success: function(result){
      
    console.log( JSON.stringify(result));
    localStorage.setItem('permanent_user_token',result.access_token)
      
      }});
         // fetch permament page_access_token 

      $.ajax({url: "https://graph.facebook.com/v2.10/515145435935448/accounts?access_token="+permanent_user_token, success: function(result){
      
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
 return message;
}

function schedulerPost() {
    var pageId = '114221043295873';
    // $.ajax({url: "https://graph.facebook.com/v2.10/515145435935448/accounts?access_token=EAAG3O7pwx9UBAPTV5z5HluJYFuhJjbmf81us9xZCxyExdkPv6IdIEnSxSuvnfZCw9CIvwTIuddVyvOZBK3EUQCHQ9dKBhPtlOVBJUpYHtayWkGTwVLE4rWZAImS0QTTnllFEXZApB02M5NlBGiSZB1k0o0I6mKYc5x9aBu7CndggZDZD", success: function(result){
    //     for( i in result.data){
    //         console.log(result.data[i].id)
    //     if(result.data[i].id==pageId){
    //         ppt=result.data[i].access_token;
    //         console.log(ppt)
    //     }
    //     }
        
    //     }});
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
// posting on user timeline
function post() {
    //var p_accessToken = "EAAdZCyZCorabkBAIB9gWNczUDYNtMrqMB6TcdZBhRlcMZCdtq0JI6ZCyH3XP3ukryVzs8h6w7SCLZADrMpJIDLpVxUJPebj4sZBFNRbhKVMh1TKZCITgMDZAMa4U9Gg32AdBz5nk9xSAsjYbSdaXoZAyyxqcqwV6oIyzF336NBEJgFWEOzgyTBU9dUr4nY3uZAgr50ZD"

    // do post here....
    var pageId = '114221043295873'; // facebook page id from page info
    FB.api('/' + pageId + '/feed', 'post', {
        message: readyToPost(),
        access_token:localStorage.getItem('permanent_page_access_token')
    }, function (info) {
        document.getElementById('status').innerHTML = 'posted successfully..'
        document.getElementById('post').style.visibility = 'hidden';
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