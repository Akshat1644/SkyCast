const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");

const dotenv=require("dotenv").config();
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/",function(req,res)
{
    res.sendFile(__dirname + "/index.html");
});

app.post("/",function(req,res)
{
    const query=req.body.cityName;
    const apiKey=process.env.apiKey;
    const unit="metric";
    https.get("https://api.openweathermap.org/data/2.5/weather?q=" +  query + "&appid=" + apiKey + "&units=" + unit,function(response)
    {
        console.log(response);

        response.on("data",function(data)
        {
            const weatherData=JSON.parse(data);
            console.log(weatherData);
            const temp=weatherData.main.temp;
            console.log(temp);
            const weatherDescription=weatherData.weather[0].description;
            console.log(weatherDescription);
            const icon=weatherData.weather[0].icon;
            const imageURL="https://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<p> The weather is "+ weatherDescription + "</p>");
            res.write("<h1> The temperature in " + query +  " is " + temp + " degrees </h1>");
           
            res.write("<img src=" + imageURL + ">");
        })
    });
});

app.listen(3000,function()
{
    console.log("Server is started at port 3000");
});
