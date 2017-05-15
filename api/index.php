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
    $config['db']['dbname'] = "aether_project";

    $config['twitter']['consumer_key'] = "";
    $config['twitter']['consumer_secret'] = "";
    $config['twitter']['access_token'] = "";
    $config['twitter']['access_token_secret'] = "";

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

    $app->get('/data/location',function(Request $request, Response $response){
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
        
        $data = new Data();
        $data->dbConn = $dbConn;
        $data->twitterConn = $twitConn;
        $response->getBody()->write(json_encode($data->retrieve("location")));
        return $response;
    });

    $app->get('/data/weather',function(Request $request, Response $response){
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

        $data = new Data();
        $data->dbConn = $dbConn;
        $data->twitterConn = $twitConn;
        $response->getBody()->write(json_encode($data->retrieve("weather")));
        return $response;
    });

    $app->get('/tweets/recent',function(Request $request, Response $response){
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

        $tweets = new Tweets();
        $tweets->twitterConn = $twitConn;
        $tweets->dbConn = $dbConn;
        $response->getBody()->write(json_encode($tweets->getRecentTweet()));
        return $response;
    });

    $app->get("/tweets/test", function(Request $request, Response $response){
        $twitConn = $this->twitter;
        if($twitConn == "Failed to connect to Twitter API."){
            $response->getBody()->write(json_encode($twitConn));
            return $response;
        }
        return json_encode($twitConn->get("application/rate_limit_status", ["resources" => "statuses,application"]));
    });

    $app->run();
?>
