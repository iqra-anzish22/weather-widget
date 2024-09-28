"use client";

import { useState, ChangeEvent, FormEvent } from "react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { CloudIcon, Divide, MapPinIcon, ThermometerIcon } from "lucide-react";
import { networkInterfaces } from "os";

interface WeatherData {
    temperature: number;
    description: string;
    location: string;
    unit:  string;
}

export default function WeatherWidget() {
    const [location, setLocation] = useState<string>("");
const [weather, setWeather] = useState<WeatherData | null> (null);

const [error, setError] = useState<string | null> (null);
const [isLoading, setIsLoading] = useState<boolean>(false);


const handleSearch = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
        setError("please Enter a Valid Location.");
        setWeather(null);
        return;
    }

    setIsLoading(true);
    setError(null);


    try {
      const response = await fetch(
       `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );
      if(!response.ok){
        throw new Error("City not found.");
      }
      const data = await response.json();
      const WeatherData: WeatherData = {
        temperature:data.current.temp_c,
        description:data.current.condition.text,
        location:data.location.name,
        unit:"C",
      };
      setWeather(WeatherData);
    }catch(error){
       setError("City not found please try again..");
       setWeather(null);
    }finally{
        setIsLoading(false);
    }

};

function getTempMessage(temperature:number, unit: string):string {
    if(unit == "C") {
        if(temperature < 0){
            return`It's freezing at ${temperature}°C! Bundle up!`;
        }else if (temperature <10){
            return `Its's quite cold at ${temperature}°C.Wear warm clothes.`;
        }else if (temperature < 20 ) {
            return `The temperature is ${temperature}°C. Comfortable for a light jacket.`; 
        }else if(temperature < 30){
            return `It's a pleasent  ${temperature}°C. Enjoy the nice weather!`;
        }else {
            return `It's hot at${temperature}°C. Stay hydrated!`;
        }
    }else {
      return `${temperature}°${unit}`;  
    }
}

function getWeatherMessage(description:string):string {
    switch (description.toLowerCase()) {
        case "sunny":
            return "Its a beutifull sunny day!";
            case "Partly cloudy":
                return "Expect some clouds and sunshine";
                 case "cloudy":
                return "Its a cloudy today.";
                 case "overcast":
                return "The sky is overcast"
                 case "Rain":
                return "Don't forget your umbrella It's raining";
                 case "thunderstoms":
                return "thunderstoms are expected today";
                case "snow":
                return "Bundle up! Its snowing";
                case "mist":
                    return "Its misty outside";
                    case "fog":
                        return "Be careful, there is fog outside";
                        default:
                            return description;

    }
}

function getLocataionMessage(location:string):string{
    const currentHour = new Date().getHours();
    const isNight = currentHour >=18 || currentHour < 6;
    return `${location} ${isNight ? "at Night" : "During the Day"}`;
}

return (
    <div className="flex justify-center items-center h-screen ">
        <Card className="w-full max-w-md mx-auto text-center border-cyan-950 rounded-2xl bg-blue-200 shadow-2xl">
            <CardHeader>
                <CardTitle className="font-mono-bold text-center text-4xl  text-blue-800">Weather Widget</CardTitle><br />
                <CardDescription className="font-semibold text-1xl text-zinc-700">Search for the current weather condition in your city.</CardDescription>
            </CardHeader>

            <CardContent>

            <form onSubmit={handleSearch} className="flex items-center gap-2">
                <input className="placeholder-gray-600 font-semibold " type="text" 
                placeholder="Enter a city name"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                />

                <Button className="bg-slate-200 hover:bg-sky-700 font-semibold" type="submit" disabled={isLoading}>
                    {isLoading ? "Loading...": "Search"}
                </Button>
            </form>

            {error && <div className="mt-4 text-red-500">{error}</div>}
             {weather && (
                <div className="mt-4 grid gap-2">
                    <div className="flex items-center gap-2">
                        <ThermometerIcon className="w-6 h-6"/>
                        {getTempMessage(weather.temperature, weather.unit)}
                    </div>

                    <div className="flex items-center gap-2">
                        <CloudIcon className="w-6 h-6"/>
                        {getWeatherMessage(weather.description)}
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPinIcon className="w-6 h-6"/>
                        {getLocataionMessage(weather.location)}
                    </div>
                </div>
             )}
            </CardContent>
        </Card>
    </div>
)

}

