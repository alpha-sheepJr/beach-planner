import { fetchWeatherApi } from "openmeteo";
// Base abstract class
class GetForecast {
    constructor(coordinates, timePeriod) {
        this.coordinates = coordinates;
        this.timePeriod = timePeriod;
    }
    buildBaseParams(extra) {
        return {
            latitude: this.coordinates.latitude,
            longitude: this.coordinates.longitude,
            start_date: this.timePeriod.start,
            end_date: this.timePeriod.end,
            timezone: "America/New_York",
            wind_speed_unit: "mph",
            temperature_unit: "fahrenheit",
            precipitation_unit: "inch",
            ...extra,
        };
    }
}
// -------------------------------------
// Weather Implementation
// -------------------------------------
class Weather extends GetForecast {
    async fetchHourly() {
        const params = this.buildBaseParams({
            hourly: [
                "temperature_2m",
                "precipitation_probability",
                "cloud_cover",
                "wind_speed_10m",
                "wind_direction_10m",
            ],
        });
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const hourly = response.hourly();
        const time = [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map((_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000));
        return {
            time,
            temperature2m: Array.from(hourly.variables(0).valuesArray()),
            precipitationProbability: Array.from(hourly.variables(1).valuesArray()),
            cloudCover: Array.from(hourly.variables(2).valuesArray()),
            windSpeed10m: Array.from(hourly.variables(3).valuesArray()),
            windDirection10m: Array.from(hourly.variables(4).valuesArray()),
        };
    }
    async fetchDaily() {
        const params = this.buildBaseParams({
            daily: [
                "precipitation_sum",
                "precipitation_probability_max",
                "sunrise",
                "sunset",
                "uv_index_max",
                "wind_speed_10m_max",
                "temperature_2m_max",
                "temperature_2m_min",
            ],
        });
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const daily = response.daily();
        const sunrise = daily.variables(2);
        const sunset = daily.variables(3);
        const time = [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map((_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000));
        return {
            time,
            precipitationSum: Array.from(daily.variables(0).valuesArray()),
            precipitationProbabilityMax: Array.from(daily.variables(1).valuesArray()),
            sunrise: [...Array(sunrise.valuesInt64Length())].map((_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)),
            sunset: [...Array(sunset.valuesInt64Length())].map((_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)),
            uvIndexMax: Array.from(daily.variables(4).valuesArray()),
            windSpeed10mMax: Array.from(daily.variables(5).valuesArray()),
            temperature2mMax: Array.from(daily.variables(6).valuesArray()),
            temperature2mMin: Array.from(daily.variables(7).valuesArray()),
        };
    }
}
// -------------------------------------
// Marine Implementation
// -------------------------------------
class Marine extends GetForecast {
    async fetchHourly() {
        const params = this.buildBaseParams({
            hourly: [
                "wave_height",
                "sea_surface_temperature",
                "ocean_current_velocity",
                "ocean_current_direction",
                "sea_level_height_msl",
                "swell_wave_height",
                "swell_wave_period",
            ],
        });
        const url = "https://marine-api.open-meteo.com/v1/marine";
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const hourly = response.hourly();
        const time = [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map((_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000));
        return {
            time,
            waveHeight: Array.from(hourly.variables(0).valuesArray()),
            seaSurfaceTemperature: Array.from(hourly.variables(1).valuesArray()),
            oceanCurrentVelocity: Array.from(hourly.variables(2).valuesArray()),
            oceanCurrentDirection: Array.from(hourly.variables(3).valuesArray()),
            seaLevelHeightMs1: Array.from(hourly.variables(4).valuesArray()),
            swellWaveHeight: Array.from(hourly.variables(5).valuesArray()),
            swellWavePeriod: Array.from(hourly.variables(6).valuesArray()),
        };
    }
    async fetchDaily() {
        const params = this.buildBaseParams({
            daily: ["wave_height_max"],
        });
        const url = "https://marine-api.open-meteo.com/v1/marine";
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const daily = response.daily();
        const time = [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map((_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000));
        const waveHeightMax = Array.from(daily.variables(0).valuesArray());
        return {
            time,
            waveHeightMax,
        };
    }
}
// -------------------------------------
// Exports
// -------------------------------------
export { GetForecast, Weather, Marine, };
