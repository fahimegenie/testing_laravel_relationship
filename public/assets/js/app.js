var baseurl = "";

console.log(window.location.host);

if (window.location.host == "dev.hapity.local")
    baseurl = "http://dev.hapity.local/";
else baseurl = "https://www.hapity.com/";

var picture_change = "false";

var APP_KEY = "c80c003b77f7f1722120";

/**
 * Tries to show browser's promt for enabling flash
 *
 * Chrome starting from 56 version and Edge from 15 are disabling flash
 * by default. To promt user to enable flash, they suggest to send user to
 * flash player download page. Then this browser will catch such request
 * and show a promt to user:
 * https://www.chromium.org/flash-roadmap#TOC-Developer-Recommendations
 * In this method we are forcing such promt by navigating user to adobe
 * site in iframe, instead of top window
 */

var hasFlash = false;
try {
    var fo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
    if (fo) {
        hasFlash = true;
    }
} catch (e) {
    if (
        navigator.mimeTypes &&
        navigator.mimeTypes["application/x-shockwave-flash"] != undefined &&
        navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin
    ) {
        hasFlash = true;
    }
}
var is_safari = navigator.userAgent.indexOf("Safari") > -1;
jQuery(document).ready(function($) {
    if (!hasFlash) {
        jQuery(".flash-error").show();
        if (!is_safari) {
            jQuery("#start-streaming")
                .attr("disabled", true)
                .addClass("disabled");
        }
    }
});

$("#reset-submit").click(function() {
    email = $("#reset-email")
        .val()
        .trim();
    password = $("#password")
        .val()
        .trim();
    conpassword = $("#conpassword")
        .val()
        .trim();
    if (password == "" || conpassword == "")
        alertify.alert("Please enter password and confirm password.");
    else if (password != conpassword) alertify.alert("Passwords do not match.");
    else {
        $.ajax({
            url: baseurl + "users/reset_password_callback",
            type: "POST",
            data: {
                email: email,
                password: password
            },
            success: function(msg) {
                if (msg == "success") {
                    alertify.alert(
                        "Your pasword has been changed.",
                        function() {
                            window.location = baseurl + "home/login";
                        }
                    );
                } else {
                    alertify.alert("Error: Please try again!");
                }
            }
        });
    }
    return false;
});
$("#forget-submit").click(function() {
    email = $("#email-forget")
        .val()
        .trim();
    if (email == "") alertify.log("Please enter email address.");
    else {
        $.ajax({
            url: baseurl + "home/forget_password_validation",
            type: "GET",
            data: {
                email: email
            },
            success: function(msg) {
                //   console.log(msg);
                if (msg == "invalid") {
                    alertify.alert(
                        "We don't have any account with this email address."
                    );
                } else if (msg == "done") {
                    $("#email-forget").val("");
                    alertify.alert(
                        "We have sent you an email, please check your inbox to reset your password."
                    );
                }
            }
        });
    }
    return false;
});
$("#account-save").click(function() {
    $.loader({
        className: "blue",
        content:
            "<i class='fa fa-refresh fa-spin fa-3x fa-fw margin-bottom loadingclass'></i>"
    });

    email = $("#email")
        .val()
        .trim();
    username = $("#username")
        .val()
        .trim();
    user_id = $("#user_id")
        .val()
        .trim();
    // alert($(this).parent());
    logintype = $("#login-type")
        .val()
        .trim();
    var profile_picture = "";

    if ($("#is_sensitive").is(":checked")) {
        is_sensitive = "yes";
    } else {
        is_sensitive = "no";
    }
    if (picture_change == "true") profile_picture = cropper.getDataURL();
    else if (picture_change == "false")
        profile_picture = $("#profile_picture").val();

    if (username == "") {
        $.loader("close");
        alertify.log("Please enter username.");
    } else if (email == "") {
        $.loader("close");
        alertify.log("Please enter email address.");
    } else if (!validateEmail(email)) {
        $.loader("close");
        alertify.alert("Invalid email address, please enter correct email.");
        error = "true";
    } else {
        $.ajax({
            type: "GET",
            url: baseurl + "webservice/is_user_username/",
            data: {
                username: username,
                user_id: user_id
            },
            success: function(msg) {
                if (msg == "true") {
                    $.loader("close");
                    alertify.alert(
                        "Username already exist, please choose different username."
                    );
                } else {
                    $.ajax({
                        type: "GET",
                        url: baseurl + "webservice/is_user_email/",
                        data: {
                            email: email,
                            user_id: user_id
                        },
                        success: function(msg) {
                            if (msg == "true") {
                                $.loader("close");
                                alertify.alert(
                                    "Email already exist, please choose different email."
                                );
                            } else {
                                if (logintype == "simple") {
                                    // alert(email);
                                    // alert(user_id);
                                    // alert(username);
                                    // alert(profile_picture);
                                    // alert(picture_change);
                                    // alert(is_sensitive);
                                    $.ajax({
                                        type: "POST",
                                        url: baseurl + "main/save_settings/",
                                        data: {
                                            email: email,
                                            user_id: user_id,
                                            username: username,
                                            profile_picture: profile_picture,
                                            type: "account",
                                            picture_change: picture_change,
                                            is_sensitive: is_sensitive
                                        },
                                        success: function(msg) {
                                            if (msg == "success") {
                                                $.loader("close");
                                                alertify.alert(
                                                    "Account settings have been successfully changed.."
                                                );
                                                var url =
                                                    baseurl +
                                                    "profile/" +
                                                    username;
                                                var html =
                                                    '<a href="' +
                                                    url +
                                                    '">' +
                                                    url +
                                                    "</a>";
                                                $(".url").html(html);
                                            }
                                            location.reload();
                                        }
                                    });
                                } else {
                                    $.ajax({
                                        type: "POST",
                                        url: baseurl + "main/save_settings/",
                                        data: {
                                            email: email,
                                            user_id: user_id,
                                            username: username,
                                            type: "facebook"
                                        },
                                        success: function(msg) {
                                            if (msg == "success") {
                                                $.loader("close");
                                                alertify.alert(
                                                    "Account settings have been successfully changed."
                                                );
                                                var url =
                                                    baseurl +
                                                    "profile/" +
                                                    username;
                                                var html =
                                                    '<a href="' +
                                                    url +
                                                    '">' +
                                                    url +
                                                    "</a>";
                                                $(".url").html(html);
                                            }

                                            location.reload();
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
    }
    return false;
});

$("#privacy-save").click(function() {
    $.loader({
        className: "blue",
        content:
            "<i class='fa fa-refresh fa-spin fa-3x fa-fw margin-bottom loadingclass'></i>"
    });
    user_id = $(this)
        .parent()
        .attr("id");
    current_password = $("#current-password")
        .val()
        .trim();
    password = $("#new-password")
        .val()
        .trim();
    conpassword = $("#confirm-password")
        .val()
        .trim();
    if (current_password == "" || password == "" || conpassword == "") {
        $.loader("close");
        alertify.alert("Please enter all password fields then proceed.");
    } else if (password != conpassword) {
        $.loader("close");
        alertify.alert("New password and confirm password do not match.");
    } else {
        $.ajax({
            url: baseurl + "webservice/verify_password",
            type: "POST",
            data: {
                password: current_password,
                user_id: user_id
            },
            success: function(msg) {
                if (msg == "false") {
                    $.loader("close");
                    alertify.alert("Current Password is incorrect.");
                } else if (msg == "true") {
                    $.ajax({
                        type: "POST",
                        url: baseurl + "main/save_settings/",
                        data: {
                            user_id: user_id,
                            password: password,
                            type: "privacy"
                        },
                        success: function(msg) {
                            if (msg == "success") {
                                $.loader("close");
                                alertify.alert(
                                    "Privacy settings have been successfully changed."
                                );
                                $("#current-password").val("");
                                $("#new-password").val("");
                                $("#confirm-password").val("");
                            }
                        }
                    });
                }
            }
        });
    }
    return false;
});

// $('.create-content-form > form').submit(function(event) {
//     event.preventDefault();
//     $.loader({className:"blue", content:"<i class='fa fa-refresh fa-spin fa-3x fa-fw margin-bottom loadingclass'></i>"});
//     var content_type = $(this).data('type');
//     if(content_type == 'edit'){
//         var url = baseurl+'main/edit-content/submit/';
//     } else if(content_type == 'create'){
//         var url = "{{url({{url('create_content_submission')}})}}";
//     }
//     var data = new FormData(this);
//     $.ajax({
//         url:url,
//         type:'POST',
//         data: data,
//         cache:false,
//         contentType: false,
//         processData: false,
//         success: function(msg) {
//             window.location = baseurl+'main';
//         }
//     });
// });

$("#login-submit").click(function() {
    username = $("#username")
        .val()
        .trim();
    password = $("#password")
        .val()
        .trim();
    if (username == "" || password == "")
        alertify.alert("Please enter username and password");
    else {
        if (validateEmail(username)) {
            $.ajax({
                url: baseurl + "home/simpleLogin",
                type: "POST",
                data: {
                    email: username,
                    password: password
                },
                success: function(msg) {
                    if (msg == "found") {
                        window.location = baseurl + "main";
                    } else if (msg == "not found") {
                        alertify.alert("Invalid username or password.");
                    }
                }
            });
        } else {
            $.ajax({
                url: baseurl + "home/simpleLogin",
                type: "POST",
                data: {
                    username: username,
                    password: password
                },
                success: function(msg) {
                    if (msg == "found") {
                        window.location = baseurl + "main";
                    } else if (msg == "not found") {
                        alertify.alert("Invalid username or password.");
                    }
                }
            });
        }
    }
    return false;
});
$("#register-submit").click(function() {
    email = $("#email")
        .val()
        .trim();
    username = $("#username")
        .val()
        .trim();
    login_type = $("#login_type")
        .val()
        .trim();

    error = "false";
    if (login_type == "simple") {
        password = $("#password")
            .val()
            .trim();
        conpassword = $("#conpassword")
            .val()
            .trim();
        if (username == "") {
            alertify.alert("Please enter username.");
            error = "true";
        } else if (email == "") {
            alertify.alert("Please enter email address.");
            error = "true";
        } else if (!validateEmail(email)) {
            alertify.alert(
                "Invalid email address, please enter correct email."
            );
            error = "true";
        } else if (password == "") {
            alertify.alert("Please enter password.");
            error = "true";
        } else if (conpassword == "") {
            alertify.alert("Please enter confirm password.");
            error = "true";
        } else if (password != conpassword) {
            alertify.alert("Passwords do not match.");
            error = "true";
        }
    } else {
        if (username == "") {
            alertify.alert("Please enter username.");
            error = "true";
        } else if (email == "") {
            alertify.alert("Please enter email address.");
            error = "true";
        } else if (!validateEmail(email)) {
            alertify.alert(
                "Invalid email address, please enter correct email."
            );
            error = "true";
        }
    }
    if (error == "false") {
        $.ajax({
            type: "GET",
            url: baseurl + "webservice/is_user_username/",
            data: {
                username: username
            },
            success: function(msg) {
                // console.log(msg);
                if (msg == "true") {
                    alertify.alert(
                        "Username already exist, please choose different username."
                    );
                } else {
                    $.ajax({
                        type: "GET",
                        url: baseurl + "webservice/is_user_email/",
                        data: {
                            email: email
                        },
                        success: function(msg) {
                            if (msg == "1") {
                                alertify.alert(
                                    "Email already exist, please choose different email."
                                );
                            } else {
                                if (email == "") {
                                    alertify.alert(
                                        "Please enter email address."
                                    );
                                } else {
                                    $("#register-form").submit();
                                }
                            }
                        }
                    });
                }
            }
        });
    }
});
function unfollowuser(follower_id, following_id) {
    $("#loader").show();
    $.ajax({
        type: "GET",
        url: baseurl + "home/unfollowUser",
        data: {
            follower_id: follower_id,
            following_id: following_id
        },
        success: function(msg) {
            var but =
                "<img id='loader' style='display: none' src='" +
                baseurl +
                "/assets/images/gloader.gif' alt='spinner'> <button type='button' class='followerbutton' onClick=\"followuser('" +
                follower_id +
                "','" +
                following_id +
                "')\">Follow</button>";
            $(".follow-buttons-" + following_id).html(but);
            $("#loader").hide();
        }
    });
}
function followuser(follower_id, following_id) {
    $("#loader").show();
    $.ajax({
        type: "GET",
        url: baseurl + "home/followUser",
        data: {
            follower_id: follower_id,
            following_id: following_id
        },
        success: function(msg) {
            var but =
                "<img id='loader' style='display: none' src='" +
                baseurl +
                "/assets/images/gloader.gif' alt='spinner'> <button type='button' class='followerbutton' onClick=\"unfollowuser('" +
                follower_id +
                "','" +
                following_id +
                "')\">UnFollow</button>";
            $(".follow-buttons-" + following_id).html(but);
            $("#loader").hide();
        }
    });
}

//home page search bar suggestions
$(".home-search-broadcast").keyup(function(e) {
    var search = $(this)
        .val()
        .trim();
    if (search != "") {
        $.ajax({
            type: "GET",
            url: baseurl + "main/search_broadcast",
            data: {
                search: search
            },
            success: function(data) {
                data = JSON.parse(data);
                var html = "";
                for (i = 0; i < data.length; i++) {
                    html +=
                        '<a href="' +
                        baseurl +
                        "main/view_broadcast/" +
                        data[i].id +
                        '" class="search_by_name"> ' +
                        '<img src="' +
                        data[i].broadcast_image +
                        '">' +
                        "<strong>" +
                        data[i].title +
                        "</strong> </a>";
                }
                $(".search_data").html(html);
                $("div.search_data").addClass("show_result");
            }
        });
    } else {
        $("div.search_data").removeClass("show_result");
        $(".search_data").html("");
    }
});
// ending of home page search bar suggestions

$(".search-broadcast").keyup(function(e) {
    var search = $(this)
        .val()
        .trim();
    var type = $("#search_select option:selected").val();
    if (search != "") {
        if (type == "Broadcast") {
            $.ajax({
                type: "GET",
                url: baseurl + "main/search_broadcast",
                data: {
                    search: search
                },
                success: function(data) {
                    data = JSON.parse(data);
                    var html = "";
                    for (i = 0; i < data.length; i++) {
                        html +=
                            '<a href="' +
                            baseurl +
                            "main/view_broadcast/" +
                            data[i].id +
                            '" class="search_by_name"> ' +
                            '<img src="' +
                            data[i].broadcast_image +
                            '">' +
                            "<strong>" +
                            data[i].title +
                            "</strong> </a>";
                    }
                    $(".search_data").html(html);
                    $("div.search_data").addClass("show_result");
                }
            });
        } else if (type == "Users") {
            $.ajax({
                type: "GET",
                url: baseurl + "main/search_user",
                data: {
                    search: search
                },
                success: function(data) {
                    data = JSON.parse(data);
                    var html = "";
                    for (i = 0; i < data.length; i++) {
                        html +=
                            '<a href="' +
                            baseurl +
                            "profile/" +
                            data[i].username +
                            '" class="search_by_name"> ' +
                            '<img src="' +
                            data[i].profile_picture +
                            '">' +
                            "<strong>" +
                            data[i].username +
                            "</strong> </a>";
                    }
                    $(".search_data").html(html);
                    $("div.search_data").addClass("show_result");
                }
            });
        }
    } else {
        $("div.search_data").removeClass("show_result");
        $(".search_data").html("");
    }
});
$(".new-comment").keyup(function(e) {
    if (e.keyCode == 13) {
        var comment = $(this).val();
        var user_id = $(this)
            .parent()
            .attr("id");
        var broadcast_id = $(this).attr("id");
        var data = {
            user_id: user_id,
            comment: comment,
            broadcast_id: broadcast_id
        };

        //                var socketId = getSocketId();
        //                if(socketId !== null) {
        //                  data.socket_id = socketId;
        //                }
        if (comment != "") {
            post_comment(data);
            $(this).val("");
        }
    }
});
$(".notification-read").click(function() {
    var data = $(this)
        .attr("id")
        .split("-");
    noti_id = data[0];
    broadcast_id = data[1];
    $.ajax({
        type: "GET",
        url: baseurl + "main/read_notification",
        data: {
            noti_id: noti_id
        },
        success: function(data) {
            window.location = baseurl + "main/view_broadcast/" + broadcast_id;
        }
    });
});
function post_comment(data) {
    $.ajax({
        type: "GET",
        url: baseurl + "broadcast/post_comment",
        data: data,
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
        success: postSuccess,
        error: postError
    });
}
function getSocketId() {
    if (pusher && pusher.connection.state === "connected") {
        return pusher.connection.socket_id;
    }
    return null;
}
function postSuccess(data, textStatus, jqXHR) {
    //console.log(data);
    displayComment(JSON.parse(data));
}

function postError(jqXHR, textStatus, errorThrown) {
    // display error
}
function displayComment(data) {
    var commentHtml = createComment(data);
    var commentEl = $(commentHtml);
    commentEl.hide();
    console.log(data);
    $(".comment-" + data.broadcast_id).append(commentEl);
    commentEl.slideDown();
    /*$.ajax({
                type: 'GET',
                url: baseurl+'webservice/insert_notification',
                data: {
                    user_id:data.user_id,
                    broadcast_id:data.broadcast_id,
                    type:'comment'
                },
                success: function(data){

                }
            });*/
    com = $(".comment-count-" + data.broadcast_id)
        .html()
        .split(" ");
    comments = parseInt(com[0]) + 1;
    $(".comment-count-" + data.broadcast_id).html(comments + " comments");
}
function createComment(data) {
    var html =
        "" +
        '<li><figure><a href="javscripti:void(0)"><img src="' +
        data.comment.profile_picture +
        '" alt="#"></a></figure>' +
        '<div class="text">' +
        '<h2><a href="javscripti:void(0)">' +
        data.comment.username +
        "</a><time>" +
        data.comment.date +
        "</time></h2>" +
        "<p>" +
        data.comment.comment.replace(new RegExp("\\\\", "g"), "") +
        "</p>" +
        "</div>" +
        "</li>";

    return html;
}
function like_broadcast(user_id, broadcast_id) {
    $.ajax({
        type: "GET",
        url: baseurl + "webservice/like_broadcast",
        data: {
            user_id: user_id,
            broadcast_id: broadcast_id
        },
        success: function(data) {
            data = $(".likes-" + broadcast_id)
                .html()
                .split(" ");
            likes = parseInt(data[0]) + 1;
            $(".likes-" + broadcast_id).html(likes + " likes");
            var html =
                '<img src="' +
                baseurl +
                'assets/images/icon-unlike.png" onClick="unlike_broadcast(' +
                user_id +
                "," +
                broadcast_id +
                ')">';
            $(".like-button-" + broadcast_id).html(html);

            $.ajax({
                type: "GET",
                url: baseurl + "webservice/insert_notification",
                data: {
                    user_id: user_id,
                    broadcast_id: broadcast_id,
                    type: "like"
                },
                success: function(data) {}
            });
        }
    });
}
function unlike_broadcast(user_id, broadcast_id) {
    $.ajax({
        type: "GET",
        url: baseurl + "webservice/dislike_broadcast",
        data: {
            user_id: user_id,
            broadcast_id: broadcast_id
        },
        success: function(data) {
            data = $(".likes-" + broadcast_id)
                .html()
                .split(" ");
            likes = parseInt(data[0]) - 1;
            $(".likes-" + broadcast_id).html(likes + " likes");
            var html =
                '<img src="' +
                baseurl +
                'assets/images/icon-like1.png" onClick="like_broadcast(' +
                user_id +
                "," +
                broadcast_id +
                ')">';
            $(".like-button-" + broadcast_id).html(html);

            $.ajax({
                type: "GET",
                url: baseurl + "webservice/delete_notification",
                data: {
                    user_id: user_id,
                    broadcast_id: broadcast_id,
                    type: "like"
                },
                success: function(data) {}
            });
        }
    });
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function fbshare(title, url, picture) {
    FB.ui(
        {
            method: "feed",
            link: url,
            name: title,
            caption: title,
            picture: picture
        },
        function(response) {}
    );
}

var options = {
    thumbBox: ".thumbBox",
    spinner: ".spinner",
    imgSrc: ""
};
var cropper = $(".imageBox").cropbox(options);
$("#file").on("change", function() {
    var reader = new FileReader();
    reader.onload = function(e) {
        options.imgSrc = e.target.result;
        cropper = $(".imageBox").cropbox(options);
    };
    $(".imageBox").css("display", "block");
    $(".controls").css("display", "block");
    $(".profile_picture").css("display", "none");
    picture_change = "true";
    reader.readAsDataURL(this.files[0]);
    this.files = [];
});
$("#btnCrop").on("click", function() {
    var img = cropper.getDataURL();
    $("#profile_picture").val(img);
});
$("#btnZoomIn").on("click", function() {
    cropper.zoomIn();
});
$("#btnZoomOut").on("click", function() {
    cropper.zoomOut();
});
//alert('asjhgjdgsagdas');
