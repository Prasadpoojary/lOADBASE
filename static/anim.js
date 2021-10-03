$(document).ready(function () {
    var music = new Audio();
    music.src = 'static/onclick.mp3';


    // next Page
    $('table td a').on('click', function () {
        $(this).html("loading...");
    });

    $('.searchbar .form input').on('focus', function () {
        $('.issue , .footer').css('display', 'none');
    });

    $('.searchbar .form input').on('blur', function () {
        $('.issue , .footer').css('display', 'block');
    });

    var isInsta = false;
    var isYou = false;
    var instaCount = 0;
    var youCount = 0;
    $('.instagram').on('click', function () {
        isInsta = true;
        isYou = false;
        instaCount++;
        $(this).addClass('button-active');
        $('.nav-container .youtube').removeClass('button-active');

        $(this).attr('disabled', true);
        $('.youtube').attr('disabled', false);
        $('.searchbar').css({ "visibility": "visible", "padding": "20px" });
        $('.ajaxSearch').attr('id', 'ajaxInstagram');
        $('#ajaxSearchText').attr('placeholder', 'Paste your Instagram link');
        music.play().then(() => {
        }).catch(e => {
        });
        $('#ajaxInstagram').on('click', function () {
            if (isInsta) {
                while (instaCount > 0) {
                    music.play();
                    var query = $("#ajaxSearchText").val();
                    if (query.trim().length > 0) {
                        $('#ajaxSearchBtn').removeClass();
                        $('#ajaxSearchBtn').addClass("fas fa-spinner fa-spin");
                        $('.ajaxSearch').attr("disabled", true);

                        query = query.includes('https://') ? query : "https://" + query;

                        var tail = query.includes('?') ? '&__a=1' : '?__a=1';

                        $.ajax({
                            type: "GET",
                            url: query + tail,
                            dataType: "json",
                            success: function (response) {
                                window.location = response.graphql.shortcode_media.video_url + '&dl=1';
                                $('#ajaxSearchBtn').removeClass();
                                $('#ajaxSearchBtn').addClass("fa fa-search");
                                $('.ajaxSearch').attr("disabled", false);
                            },
                            error: function () {
                                message('Something went wrong');
                                $('#ajaxSearchBtn').removeClass();
                                $('#ajaxSearchBtn').addClass("fa fa-search");
                                $('.ajaxSearch').attr("disabled", false);
                            }

                        });
                    }
                    else {
                        message('invalid LINK');
                        $('#ajaxSearchBtn').removeClass();
                        $('#ajaxSearchBtn').addClass("fa fa-search");
                        $('.ajaxSearch').attr("disabled", false);
                    }
                    instaCount = 0;
                }
            }
        });

    });

    $('.instagram').click();

    $('.youtube').on('click', function () {
        music.play();
        isInsta = false;
        isYou = true;
        youCount++;
        $(this).addClass('button-active');
        $('.nav-container .instagram').removeClass('button-active');
        $(this).attr('disabled', true);
        $('.instagram').attr('disabled', false);
        $('.searchbar').css({ "visibility": "visible", "padding": "20px" });
        $('.ajaxSearch').attr('id', 'ajaxYoutube');
        $('#ajaxSearchText').attr('placeholder', 'Paste your YouTube link');
        $('#ajaxYoutube').on('click', function () {
            if (isYou) {
                while (youCount > 0) {
                    music.play();
                    var query = encodeURIComponent($("#ajaxSearchText").val());
                    if (decodeURIComponent(query).trim().length > 0) {
                        $('#ajaxSearchBtn').removeClass();
                        $('#ajaxSearchBtn').addClass("fas fa-spinner fa-spin");
                        $('.ajaxSearch').attr("disabled", true);

                        var re;

                        // Request for Data
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            contentType: "application/json",
                            url: "https://loadbasedebug.herokuapp.com/youtube/api",
                            data: "url=" + query,
                            success: function (response) {
                                $('#ajaxSearchBtn').removeClass();
                                $('#ajaxSearchBtn').addClass("fa fa-search");
                                $('.ajaxSearch').attr("disabled", false);
                                $('.ajaxLoadContainer').empty();
                                re = response;
                                $('.ajaxLoadContainer').load('youtube.html');
                            }
                        });

                        $(document).ajaxError(function () {
                            message("Server under maintenance");
                            $('#ajaxSearchBtn').removeClass();
                            $('#ajaxSearchBtn').addClass("fa fa-search");
                            $('.ajaxSearch').attr("disabled", false);
                        });

                        var second_request = false;
                        var ajax_url;
                        var ajax_type;

                        $(document).ajaxStop(function () {
                            if (second_request) {
                                message("Click on 3 dots to Download");
                                $('#video source').attr('src', ajax_url);
                                if (ajax_type == '/download') {
                                    $('#video source').attr('type', 'video/mp4');
                                }
                                else {
                                    $('#video source').attr('type', 'audio/mp3');
                                }
                            }
                            else {
                                let videoList = re.video;
                                let audioList = re.audio;
                                let videoDOM = $('.videoTableBody');
                                let audioDOM = $('.audioTableBody');

                                if (videoList.length != 0) {
                                    videoList.forEach(video => {
                                        if (video.format == "720p") {
                                            if (video.filesize == "null" || (video.filesize / 1048576).toFixed(1) == 0.0) {
                                                let child = $("<tr><td style='position:relative;'><span>HD</span>" + video.format + "</td><td><b style='color:#c0c0c0;font-size:12px;letter-spacing:2px;'>NA</b><td><form action='/download' method='get'><input name='url' type='hidden' value='" + video.url + "'><button type='button' class='ajaxDownload' style='cursor:pointer;outline:none;border:none;background: transparent;'><a class='link' >download</a></button></form></td></tr>");
                                                videoDOM.append(child);
                                            }
                                            else {
                                                let child = $("<tr><td style='position:relative;'><span>HD</span>" + video.format + "</td><td>" + (video.filesize / 1048576).toFixed(1) + " MB</td><td><form action='/download' method='get'><input name='url' type='hidden' value='" + video.url + "'><button type='button' class='ajaxDownload' style='cursor:pointer;outline:none;border:none;background: transparent;'><a class='link' >download</a></button></form></td></tr>");
                                                videoDOM.append(child);
                                            }
                                        }
                                        else {
                                            if (video.filesize == "null" || (video.filesize / 1048576).toFixed(1) == 0.0) {
                                                let child = $("<tr><td>" + video.format + "</td><td><b style='color:#c0c0c0;font-size:12px;letter-spacing:2px;'>NA</b><td><form action='/download' method='get'><input name='url' type='hidden' value='" + video.url + "'><button type='button' class='ajaxDownload' style='cursor:pointer;outline:none;border:none;background: transparent;'><a class='link' >download</a></button></form></td></tr>");
                                                videoDOM.append(child);
                                            }
                                            else {
                                                let child = $("<tr><td>" + video.format + "</td><td>" + (video.filesize / 1048576).toFixed(1) + " MB</td><td><form action='/download' method='get'><input name='url' type='hidden' value='" + video.url + "'><button type='button' class='ajaxDownload' style='cursor:pointer;outline:none;border:none;background: transparent;'><a class='link' >download</a></button></form></td></tr>");
                                                videoDOM.append(child);
                                            }
                                        }
                                    });
                                }
                                else {
                                    let child = $("<tr><td style='font-weight:600;'>Sorry, video is not available</td><td><a href='https://en.savefrom.net'>Try This</a></td></tr>");
                                    videoDOM.append(child);
                                }

                                if (audioList.length != 0) {
                                    audioList.forEach(audio => {
                                        if (audio.filesize == "null" || (audio.filesize / 1048576).toFixed(1) == 0.0) {
                                            if (audio.type == "m4a") {
                                                audio.type = "MP3";
                                                let child = $("<tr><td style='position:relative;'><span><i class='fa fa-check'></i> </span>" + audio.type + "</td><td><b style='color:#c0c0c0;font-size:12px;letter-spacing:2px;'>NA</b></td><td><form action='/download-mp3' method='get'><input name='url' type='hidden' value='" + audio.url + "'><button type='button' style='cursor:pointer;outline:none;border:none;background: transparent;'><a class='link' >download</a></button></form></td></tr>");
                                                audioDOM.append(child);
                                            }
                                            else {
                                                let child = $("<tr><td>" + audio.type + "</td><td><b style='color:#c0c0c0;font-size:12px;letter-spacing:2px;'>NA</b></td><td><form action='/download-mp3' method='get'><input name='url' type='hidden' value='" + audio.url + "'><button type='button' style='cursor:pointer;outline:none;border:none;background: transparent;'><a class='link' >download</a></button></form></td></tr>");
                                                audioDOM.append(child);
                                            }
                                        }
                                        else {
                                            if (audio.type == "m4a") {
                                                audio.type = "MP3";
                                                let child = $("<tr><td style='position:relative;'><span><i class='fa fa-check'></i> </span>" + audio.type + "</td><td>" + (audio.filesize / 1048576).toFixed(1) + " MB</td><td><form action='/download-mp3' method='get'><input name='url' type='hidden' value='" + audio.url + "'><button type='button' style='cursor:pointer;outline:none;border:none;background: transparent;'><a class='link' >download</a></button></form></td></tr>");
                                                audioDOM.append(child);
                                            }
                                            else {
                                                let child = $("<tr><td>" + audio.type + "</td><td>" + (audio.filesize / 1048576).toFixed(1) + " MB</td><td><form action='/download-mp3' method='get'><input name='url' type='hidden' value='" + audio.url + "'><button type='button' style='cursor:pointer;outline:none;border:none;background: transparent;'><a class='link' >download</a></button></form></td></tr>");
                                                audioDOM.append(child);
                                            }
                                        }
                                    });
                                }
                                else {
                                    let child = $("<tr><td style='font-weight:600;'>Sorry, audio is not available</td><td><a href='https://en.savefrom.net/'>Try This</a></td></tr>");
                                    audioDOM.append(child);
                                }

                                $('.settings-button').on('click', function () {
                                    $('.instruction-base').css('display', 'block');
                                });

                                $('.settings-close-button').on('click', function () {
                                    $('.instruction-base').css('display', 'none');
                                });



                                $('.link').on('click', function () {
                                    music.play();
                                    $('.link').html('download');
                                    $('.link').css({ 'color': 'white', 'background': 'green', 'box-shadow': 'none' });
                                    $(this).html('Loading...');
                                    $(this).css({ 'color': 'green', 'background': 'white', 'box-shadow': '0px 0px 12px 0px #d3d3d4' });
                                    ajax_url = $(this).parent().siblings('input').val();
                                    ajax_type = $(this).parents('form').attr('action');
                                    //AJAX for download Page
                                    $.ajax({
                                        type: "GET",
                                        url: "",
                                        success: function (response) {
                                            second_request = true;
                                            $('.ajaxLoadContainer').empty();
                                            $('.ajaxLoadContainer').load('download.html');
                                        }
                                    });
                                });
                            }
                        });
                    }
                    else {
                        message('invalid LINK');
                        $('#ajaxSearchBtn').removeClass();
                        $('#ajaxSearchBtn').addClass("fa fa-search");
                        $('.ajaxSearch').attr("disabled", false);
                    }

                    youCount = 0;
                }
            }
        });
    });
});
