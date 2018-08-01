import React from 'react';

export class Day extends React.Component {
    render() {
        if(this.props.weather) {
            let weather = this.props.weather;
            return (
                <div>
                    <h2>{weather[0].date}</h2>
                    <h3>{weather[0].description}</h3>
                    <p>Low: {weather[weather.length-1].low} F</p>
                    <p>High: {weather[weather.length-1].high} F</p>
                </div>
            );
        } else {
            return <div></div>;
        }
    }
}