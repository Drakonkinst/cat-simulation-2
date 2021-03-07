const World = (() => {
    const WEATHER = {
        "sunny": {
            greeting: "the curtains open to clear skies",
            causes: {
                "sunny": {
                    weight: 3
                },
                "cloudy": {
                    weight: 1,
                    notification: "the sun yields to white clouds. puffs of soft cotton drift across the horizon"
                }
            }
        },
        "cloudy": {
            greeting: "the curtains open to lazy clouds, floating across the sky",
            causes: {
                "sunny": {
                    weight: 6,
                    notification: "a ray of light breaks the clouded skies. soon, the yellow sun shines anew"
                },
                "cloudy": {
                    weight: 10
                },
                "rain": {
                    weight: 6,
                    notification: "a sea of dark clouds rolls in like the tide. raindrops patter softly above"
                },
                "snow": {
                    weight: 1,
                    notification: "the winds grow colder. crystals of ice flutter from the sky"
                }
            }
        },
        "rain": {
            greeting: "the curtains open to the patter of raindrops across a dark sky",
            causes: {
                "sunny": {
                    weight: 4,
                    notification: "the last drops of water fall from the heavens. the sun shines brightly, filled with hope"
                },
                "cloudy": {
                    weight: 5,
                    notification: "the rain stops. cold wind and muggy skies are poor replacements"
                },
                "rain": {
                    weight: 10
                },
                "storm": {
                    weight: 2,
                    notification: "sheets of rain pour out of the sky. winds howl with a primal fury"
                },
                "hail": {
                    weight: 1,
                    notification: "water turns to ice, shattering against the ground with heightened intensity"
                }
            }
        },
        "storm": {
            greeting: "the curtains open to a storm of thunder and fury",
            causes: {
                "rain": {
                    weight: 9,
                    notification: "the storm lessens. soon, a light drizzle is all that remains"
                },
                "storm": {
                    weight: 10
                },
                "lightning": {
                    weight: 1,
                    notification: "jagged streaks of light split the sky asunder. darkness shatters before its will"
                },
            }
        },
        "lightning": {
            greeting: "a bolt of lightning cracks the sky",
            causes: {
                "storm": {
                    weight: 4,
                    notification: "roaring thunder grips the earth"
                },
                "rain": {
                    weight: 1,
                    notification: "with a final rumble of thunder, the gods relent their fury"
                }
            }
        },
        "snow": {
            greeting: "the curtains open to snowflakes, fluttering to the ground",
            causes: {
                "cloudy": {
                    weight: 2,
                    notification: "the snowfall stops. cold wind and muggy skies are poor replacements"
                },
                "rain": {
                    weight: 2,
                    notification: "snowfall gives way to light rain"
                },
                "hail": {
                    weight: 3,
                    notification: "soft flakes turn to ice. they shatter upon impact"
                },
                "snow": {
                    weight: 10
                }
            }
        },
        "hail": {
            greeting: "ice pelts the roof from above",
            causes: {
                "snow": {
                    weight: 1,
                    notification: "ice melts to soft white flakes of snow."
                },
                "hail": {
                    weight: 3
                },
                "storm": {
                    weight: 1,
                    notification: "the hail ends. a wall of rain continues its assault"
                }
            }
        }
    };
    const WEATHER_LIST = Utils.keysAsList(WEATHER);
    
    const UPDATE_INTERVAL = 5000;
    const WEATHER_INTERVAL_MIN = 1;
    const WEATHER_INTERVAL_MAX = 3;
    const LIGHTNING_WEATHER_SCALE = 0.3;
    
    let currentWeather = "sunny";
    let weatherTask = null;
    let currentDay = 1;
    
    return {
        Init() {
            weatherTask = new Task("weather", World.nextWeather, WEATHER_INTERVAL_MIN, WEATHER_INTERVAL_MAX);
            
        },
        
        LaunchWorld() {
            
            weatherTask.scheduleNext();
            World.startDay();

            setInterval(World.update, UPDATE_INTERVAL);
        },
        
        update() {
            
        },
        
        saveWorldData() {
            let data = [
                currentDay, "|",
                Utils.encodeArrayIndex(WEATHER_LIST, currentWeather), "|"
            ];
            return data.join("");
        },
        
        loadWorldData(str) {
            let dataArr = str.split("|");
            currentDay = parseInt(dataArr[0]);
            currentWeather = Utils.decodeArrayIndex(WEATHER_LIST, dataArr[1])
        },
        
        nextWeather(noAnnouncement) {
            let nextWeather = "sunny";
            let notificationMsg = null;
            if(currentWeather != null) {
                let possibilities = WEATHER[currentWeather].causes;
                nextWeather = Utils.chooseWeighted(possibilities, "weight");
                notificationMsg = possibilities[nextWeather].notification;
            }
            
            if(!noAnnouncement && notificationMsg != null) {
                Logger.log("Changed weather to " + nextWeather);
                Notifications.notify(notificationMsg);
            }
            
            currentWeather = nextWeather;
            
            if(currentWeather == "lightning") {
                // shouldn't stay on lightning for very long
                weatherTask.scheduleNext(LIGHTNING_WEATHER_SCALE);
            } else {
                weatherTask.scheduleNext();
            }
        },
        
        endDay() {
            ++currentDay;
            World.nextWeather(true);
            World.startDay();
        },
        
        startDay() {
            Notifications.notify(WEATHER[currentWeather].greeting);
            Notifications.quickNotify("day " + currentDay);
        },
        
        sleep() {
            
        },
        
        dream() {
            
        }
    };
})();