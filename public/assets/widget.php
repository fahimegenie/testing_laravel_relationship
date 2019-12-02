<!DOCTYPE html>
<html>
<head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="https://www.hapity.com/assets/js/jwplayer.js"></script>
    <script type="text/javascript">jwplayer.key="fyA++R3ayz2ubL4Ae9YeON9gCFRk3VUZo+tDubFgov8=";</script>
    <style>
        h1 {
            text-align: center;
            font-family: arial;
        }
    </style>
</head>
<body>
<?php
if(isset($_GET['stream'])){
    if(isset($_GET['broadcast_image']) && $_GET['broadcast_image']!=''){
        $image = $_GET['broadcast_image'];
    }
    else{
        $image = 'default001.jpg';
    }
    $stream = $_GET['stream'];
    $title = isset($_GET['title']) ? $_GET['title'] : 'Untitle';
    $id = isset($_GET['bid']) ? $_GET['bid'] : 0;
    $status = isset($_GET['status']) ? $_GET['status'] : 'offline';
    $stream = str_replace("rtsp", "rtmp", $stream);

    // Temporary change IP address
    $stream = str_replace("52.17.132.36", "52.18.33.132", $stream);
    // Remove Port
    $stream = str_replace(":1935", "", $stream);


    // Replace Ip Address With SubDomain
    $stream = str_replace(["52.17.132.36", "52.18.33.132"], 'media.hapity.com', $stream);
    
    $second = $stream;
    $stream_http =  str_replace(array("rtmp", "rtsp"), "https", $second).'/playlist.m3u8';
    if($status != 'online'){
        $stream = str_replace("live", "vod", $stream);
        $stream_http = str_replace(array("rtmp", "rtsp"), "https", $stream).'/playlist.m3u8';
    }
    $host_name = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";

    // echo $host_name; exit;
    $widget = urlencode($host_name."/widget?stream='".$stream_http. "'&title='" . $title . "'&status='" . $status . "'&bid='" . $id . "'&broadcast_image='" . $image);

    echo $widget; exit;

    // header(“Location : $your_target_url”);
    // exit();
    
    $second_http =  str_replace(array("rtmp", "rtsp"), "https", $second).'/playlist.m3u8';

    // $stream_http = str_replace(array("rtmp", "rtsp"), "https", $stream).'/playlist.m3u8';
    echo urlencode($second_http); exit;
    ?>
    <h1><?php echo strtoupper($title);?></h1>
    <div id="broadcast-<?php echo $id;?>"><h1>Loading Stream</h1></div>
    <script type="text/javascript">
        $(document).ready(function(){
            var player = jwplayer('broadcast-<?php echo $id;?>');
            var initial_load = true;
            player.setup({
                sources: [
                    {
                        file:'<?php echo $second;?>'
                    },
                    {
                        file:'<?php echo $second_http;?>'
                    }
                ],
                playButton: 'https://www.hapity.com/images/play.png',
                androidhls: true,
                height: 500,
                width: "100%",
                image: '<?php echo $image;?>',
                hlshtml: true
            });
            player.on('error', function() {
                player.load(

                    {
                        file:"<?php echo $stream_http;?>",
                        playButton: 'https://www.hapity.com/images/play.png',
                        androidhls: true,
                        image: '<?php echo $image;?>'
                    });
                player.play();
            });
            player.on('play', function(){

                if(initial_load) {
                    setTimeout(function() {
                    $.ajax({
                        url: 'https://api.hapity.com/webservice/stream_count',
                        type: 'POST',
                        data: {stream: "<?php echo $id;?>"},
                    })
                    .done(function(data) {
                        console.log(data);
                    });
                    
                    initial_load = false;
                }, 2000);
                }
                
            });
        });


        

        // jQuery(document).ready(function($) {
        //     $.ajax({
        //         url:'https://api.hapity.com/counter.php',
        //         success:function(data) {
        //             alert(data);
        //         }
        //     })
        // });

    </script>
    <?php
}
else{
    echo "<h1>No broadcast found</h1>";
}
?>

</body>
</html>