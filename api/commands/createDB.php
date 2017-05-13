<?php
    $server = "localhost";
    $username = "root";
    $password = "";
    $database = "aether_project";

    $conn = new mysqli($server,$username,$password) or die("Failed to connect to the server.");
    $sql = "CREATE DATABASE IF NOT EXISTS aether_project CHARACTER SET utf8; ";
    $conn->query($sql);

    mysqli_select_db($conn,$database) or die("Failed to connect to the database.");

    $sql = "";
    $sql .="CREATE TABLE IF NOT EXISTS spottrace_location_data(
                unix_time varchar(255) CHARACTER SET utf8 NOT NULL,
                latitude varchar(255) CHARACTER SET utf8 NOT NULL,
                longitude varchar(255) CHARACTER SET utf8 NOT NULL,
                creation datetime NOT NULL,
                PRIMARY KEY(unix_time)
            ) CHARACTER SET utf8; ";
    $sql .="CREATE TABLE IF NOT EXISTS aprs_location_data(
                unix_time varchar(255) CHARACTER SET utf8 NOT NULL,
                latitude varchar(255) CHARACTER SET utf8 NOT NULL,
                longitude varchar(255) CHARACTER SET utf8 NOT NULL,
                altitude varchar(255) CHARACTER SET utf8,
                creation datetime NOT NULL,
                PRIMARY KEY(unix_time)
            ) CHARACTER SET utf8; ";
    $sql .="CREATE TABLE IF NOT EXISTS aprs_weather_data(
                unix_time varchar(255) CHARACTER SET utf8 NOT NULL,
                temperature varchar(255) CHARACTER SET utf8,
                pressure varchar(255) CHARACTER SET utf8,
                creation datetime NOT NULL,
                PRIMARY KEY(unix_time)
            ) CHARACTER SET utf8; ";
    $sql .="CREATE TABLE IF NOT EXISTS sources(
                id varchar(255) CHARACTER SET utf8 NOT NULL,
                last_update datetime,
                PRIMARY KEY(id)
            ) CHARACTER SET utf8; ";
    $sql .="CREATE TABLE IF NOT EXISTS tweets(
                id varchar(255) CHARACTER SET utf8 NOT NULL,
                body varchar(255) CHARACTER SET utf8,
                media text CHARACTER SET utf8,
                creation datetime NOT NULL,
                PRIMARY KEY (id)
            ) CHARACTER SET utf8; ";

    $result = mysqli_multi_query($conn,$sql);
    if (!$result){
        die ("The SQL command was not processed correctly.");
    } else{
        echo "MySQL tables setup successfully.";
    }

    mysqli_close($conn);
?>
