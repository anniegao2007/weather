import React from 'react';
import { Day } from './Day.js';
import axios from 'axios';

export class Week extends React.Component {
    state = {
        city: '',
        forecast: []
    }

    kelvinToFahrenheit(tmp) {
        let celsius = Number(tmp) - 273.15;
        return Math.round(1.8*celsius + 32);
    }

    componentDidMount() {
        //api will return 5 days of data, 8 reports per day
        axios.get('http://api.openweathermap.org/data/2.5/forecast?id=5359777&APPID=d41934cc1f75169422cefc80176d8197')
            .then(res => {
                const city = `${res.data.city.name}, ${res.data.city.country}`;              
                const monsterList = res.data.list;
                const forecast = [];
                let count = 0;
                for(let i = 0; i < 5; i++) {
                    const day = [];
                    let low = Infinity;
                    let high = -Infinity;
                    for(let j = 0; j < 8; j++) {
                        let dayListArr = monsterList[count];
                        if(dayListArr) {
                            let temp = this.kelvinToFahrenheit(dayListArr['main']['temp']);   
                            let tempHigh = this.kelvinToFahrenheit(dayListArr['main']['temp_max']);
                            let tempLow = this.kelvinToFahrenheit(dayListArr['main']['temp_min']);    
                            let dateTime= dayListArr['dt_txt'].split(' ');
                            let date = dateTime[0];
                            let time = dateTime[1];
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
                                time
                            });
                            count++;
                        }
                    }
                    day.push({high, low});
                    forecast.push(day);
                }
                this.setState({ city, forecast });
            });
    }

    render() {
        return (
            <div>
                <h2>{this.state.city}</h2>
                <table>
                    <tbody>
                        <tr>
                            <td><Day weather={this.state.forecast[0]}/></td>
                            <td><Day weather={this.state.forecast[1]}/></td>
                            <td><Day weather={this.state.forecast[2]}/></td>
                            <td><Day weather={this.state.forecast[3]}/></td>
                            <td><Day weather={this.state.forecast[4]}/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}