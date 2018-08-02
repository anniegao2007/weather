import React from 'react';

export class Day extends React.Component {
    render() {
        if(this.props.weather) {
            let weather = this.props.weather;
            return (
                <div className="Day" onClick={this.props.onClick}>
                    <h2>{weather[0].date}</h2>
                    <h3>{weather[0].description}</h3>
                    <img src={weather[0].icon} />
                    <p>Low: {weather[weather.length-1].low} F</p>
                    <p>High: {weather[weather.length-1].high} F</p>
                </div>
            );
        } else {
            return null;
        }
    }
}