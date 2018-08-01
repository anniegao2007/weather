import React from 'react';
import { Day } from './Day.js';
import axios from 'axios';

export class Week extends React.Component {
    constructor(props) {
        super(props);
        this.threeHourForecast = this.threeHourForecast.bind(this);
        this.changeZIP = this.changeZIP.bind(this);
    }
    state = {
        zipCode: '[enter zip above]',
        forecast: [],
        threeHours: null,
    }

    kelvinToFahrenheit(tmp) {
        let celsius = Number(tmp) - 273.15;
        return Math.round(1.8*celsius + 32);
    }

    changeZIP(e) {
        const newZip = e.target.value;
        if(newZip.length === 5) {
            this.setState({ zipCode: newZip });
        }
    }

    componentDidUpdate() {
        //api will return 5 days of data, 8 reports per day
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?zip=${this.state.zipCode},us&APPID=6559a29ec4d56e86a6c3eae5dce63640`)
            .then(res => {
                const city = `${res.data.city.name}, ${res.data.city.country}`;              
                const monsterList = res.data.list;
                const forecast = [];
                let count = 0;
                for(let i = 0; i < 5; i++) {
                    const day = [];
                    let low = Infinity;
                    let high = -Infinity;
                    //let problems = new Set();
                    for(let j = 0; j < 8; j++) {
                        let dayListArr = monsterList[count];
                        if(dayListArr) {
                            let temp = this.kelvinToFahrenheit(dayListArr['main']['temp']);   
                            let tempHigh = this.kelvinToFahrenheit(dayListArr['main']['temp_max']);
                            let tempLow = this.kelvinToFahrenheit(dayListArr['main']['temp_min']);    
                            let dateTime= dayListArr['dt_txt'].split(' ');
                            let date = dateTime[0];
                            let time = dateTime[1];

                            /*
                            let weatherCode = dayListArr['weather'][0]['id'];
                            console.log(weatherCode);
                            if(weatherCode.charAt(0) === '2') { problems.add('thunderstorms');}
                            if(weatherCode.charAt(0) === '3') { problems.add('drizzle');}
                            if(weatherCode.charAt(0) === '5') { problems.add('rain');}
                            if(weatherCode.charAt(0) === '6') { problems.add('snow');}
                            if(weatherCode.charAt(0) === '7') { problems.add('weird things in the air');}
                            if(weatherCode.charAt(0) === '8' && weatherCode.charAt(1) === '0' && weatherCode.charAt(2) !== '0') { problems.add('cloudy ');}
*/
                            if(j > 0 && (date !== day[j-1].date)) {
                                break;
                            }
                            if(tempHigh > high) {
                                high = tempHigh;
                            }
                            if(tempLow < low) {
                                low = tempLow;
                            }
                            day.push({
                                temp,
                                tempHigh,
                                tempLow,
                                humidity: dayListArr['main']['humidity'],
                                description: dayListArr['weather'][0]['description'],
                                date,
                                time,
                                icon: `https://openweathermap.org/img/w/${dayListArr['weather'][0]['icon']}.png`
                            });
                            count++;
                        }
                    }
                    let tldr="Nice day today.";
                    //let tldr = problems.length===0 ? "It's a pretty nice today. Go outside and frolick in some daisies." 
                        //: Array.from(problems).join(' ');
                    day.push({high, low, tldr});
                    forecast.push(day);
                }
                this.setState({ city, forecast });
            });
    }

    threeHourForecast(day) {
        //display temp, humidity, time, description
        let tldr = this.state.forecast[day][this.state.forecast[day].length-1].tldr;
        let weather = this.state.forecast[day].filter(block => block.time);
        let forecast = (
            <div className="threeHourForecast">
                <h2>Three Hours Forecast: {weather[0].date}</h2>
                <h3>TL;DR: {tldr} </h3>
                <table className="table">
                    <tbody>
                        <tr>
                            {weather.map(threeHours => (
                                <td key={threeHours.time}>
                                    <div className="threeHourSmall">
                                        <p>{threeHours.time} UTC</p>
                                        <p>{threeHours.description}</p>
                                        <img src={threeHours.icon} />
                                        <p>{threeHours.temp} F</p>
                                        <p>Humidity: {threeHours.humidity}%</p>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        );        
        
        this.setState({ threeHours: forecast });
    }

    render() {
        return (
            <div>
                <br />
                
                <input type="text" ref="newZip" placeholder="Enter U.S. ZIP Code" onChange={this.changeZIP}/>
                <h1>Showing forecast for ZIP: {this.state.zipCode}</h1>
                <table className="table">
                    <tbody>
                        <tr className="week">
                            <td><Day weather={this.state.forecast[0]} onClick={() => this.threeHourForecast(0)}/></td>
                            <td><Day weather={this.state.forecast[1]} onClick={() => this.threeHourForecast(1)}/></td>
                            <td><Day weather={this.state.forecast[2]} onClick={() => this.threeHourForecast(2)}/></td>
                            <td><Day weather={this.state.forecast[3]} onClick={() => this.threeHourForecast(3)}/></td>
                            <td><Day weather={this.state.forecast[4]} onClick={() => this.threeHourForecast(4)}/></td>
                        </tr>
                    </tbody>
                </table>
                <h2>{ this.state.threeHours }</h2>
            </div>
        );
    }
}