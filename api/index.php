<?php
    use \Psr\Http\Message\ServerRequestInterface as Request;
    use \Psr\Http\Message\ResponseInterface as Response;
    use Abraham\TwitterOAuth\TwitterOAuth;

    require 'libs/vendor/autoload.php';

    //Load class files
    require("classes/Tweets.php");
    require("classes/Data.php");
    require("classes/Sources.php");

    $config['displayErrorDetails'] = true;
    $config['addContentLengthHeader'] = false;

    $config['db']['server'] = "localhost";
    $config['db']['username'] = "root";
    $config['db']['password'] = "";
    $config['db']['dbname'] = "aether";

    //Never push with the following variables filled
    $config['twitter']['consumer_key'] = "YlBJJfYG1iFEBB9UITMLZAEC1";
    $config['twitter']['consumer_secret'] = "5bTHZCA5WjMyIlaFpyFwvx6iMGuLLG9qa3IRxg1hCj9e363Orf";
    $config['twitter']['access_token'] = "821437608316325888-VCW7QVvDZorhslL2GzPA4hf0GH9Jw4v";
    $config['twitter']['access_token_secret'] = "DidYjUg3fvcVIxkNYMtiSfRRwcoTGEDuoj38BTjA8v8xh";

    $app = new \Slim\App(["settings" => $config]);

    $container = $app->getContainer();
    $container["twitter"] = function ($c) {
        $twitter = $c["settings"]["twitter"];
        $connection = new TwitterOAuth($twitter["consumer_key"], $twitter["consumer_secret"], $twitter["access_token"], $twitter["access_token_secret"]);
        $content = $connection->get("account/verify_credentials");
        if(isset($content->errors[0]->code)){
            if($content->errors[0]->code == 89){
                return "Failed to connect to Twitter API.";
            }
        }
        return $connection;
    };
    $container["db"] = function ($c) {
       $db = $c["settings"]["db"];
       $connection = new mysqli($db["server"],$db["username"],$db["password"]);
       if(!$connection){
           return "Failed to connect to the server.";
       }
       if(!mysqli_select_db($connection,$db["dbname"])){
           return "Failed to connect to the database.";
       }
       return $connection;
   };

    $app->get('/data/update',function(Request $request, Response $response){
        $twitConn = $this->twitter;
        if($twitConn == "Failed to connect to Twitter API."){
            $response->getBody()->write(json_encode($twitConn));
            return $response;
        }
        $dbConn = $this->db;
        if(is_string($dbConn)){
            if(strpos($dbConn, "Failed") >= 0){
                $response->getBody()->write(json_encode($dbConn));
                return $response;
            }
        }
        $tweet = new Tweets();
        $tweet->twitterConn = $twitConn;
        $tweet->dbConn = $dbConn;
        $response->getBody()->write(json_encode("tmp1"));
        return $response;
    });

    $app->get('/data',function(Request $request, Response $response){
        $dbConn = $this->db;
        if(is_string($dbConn)){
            if(strpos($dbConn, "Failed") >= 0){
                $response->getBody()->write(json_encode($dbConn));
                return $response;
            }
        }
        $data = new Data();
        $data->dbConn = $dbConn;
        $response->getBody()->write(json_encode($data->retrieve()));
        return $response;
    });

    $app->run();
?>
