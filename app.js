// import express, { Application, Response, Request } from "express";
// import redis, { createClient } from "redis";

const express=require('express')
const redis=require('redis')
const app= express();

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

// const client = createClient({
//   password: "dssYpBnYQrl01GbCGVhVq2e4dYvUrKJB",
//   socket: {
//     host: "redis-12675.c212.ap-south-1-1.ec2.cloud.redislabs.com",
//     port: 12675,
//   },
// });

const client = redis.createClient({ 
    url: "redis://redis-12675.c212.ap-south-1-1.ec2.cloud.redislabs.com:12675", // Redis server host
    
  });

  client.connect()

// Handle connection event
client.on("connect", () => {
  console.log("Connected to Redis");
});

// Handle error event
client.on("error", (err) => {
  console.error("Redis error:", err);
});

app.listen(port, () => {
  console.log("server running on port 6000");
});
