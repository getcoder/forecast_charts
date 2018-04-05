import React, { Component } from 'react';
import './App.css';


import Chart from './Chart';



class App extends Component {
  state = {
    serverAnswer: [],
    showCharts: false,
    italy: {},
    moscow: {},
    newZealand: {},
    newYork: {},
  };

  componentWillMount() {
    let italy_url = 'http://api.openweathermap.org/data/2.5/forecast?id=4700234&units=metric&cnt=30&appid=93fd58c7564b7234b7a3ad5615dd8845';
    let moscow_url = 'http://api.openweathermap.org/data/2.5/forecast?id=524901&units=metric&cnt=30&appid=93fd58c7564b7234b7a3ad5615dd8845';
    let newZealand_url = 'http://api.openweathermap.org/data/2.5/forecast?id=2186224&units=metric&cnt=30&appid=93fd58c7564b7234b7a3ad5615dd8845';
    let newYork_url = 'http://api.openweathermap.org/data/2.5/forecast?id=5128581&units=metric&cnt=30&appid=93fd58c7564b7234b7a3ad5615dd8845';

    fetch(italy_url)
      .then(response => response.json())
      .then(parsedJSON => {
        this.setState({
          italy: parsedJSON,
        });
        return fetch(moscow_url)
      }
      )
      .then(response => response.json())
      .then(parsedJSON => {
        this.setState({
          moscow: parsedJSON,
        });
        return fetch(newYork_url)
      }
      )
      .then(response => response.json())
      .then(parsedJSON => {
        this.setState({
          newYork: parsedJSON,
        });
        return fetch(newZealand_url)
      })
      .then(response => response.json())
      .then(parsedJSON => this.setState({
        newZealand: parsedJSON,
      }, () => {
        this.connectMass();
      }
      ))
      .catch(error => console.error('parsing failed', error))
  }

  connectMass = () => { // connect json city-files into massiv for charts
    let italy = this.state.italy;
    let moscow = this.state.moscow;
    let newZealand = this.state.newZealand;
    let newYork = this.state.newYork;

    let mass = [];
    for (var i = 0; i < italy.list.length; i++) {
      let obj = {};
      obj.dt_txt = moscow.list[i].dt_txt;

      obj.temp_moscow = moscow.list[i].main.temp;
      obj.pressure_moscow = moscow.list[i].main.pressure;
      obj.humidity_moscow = moscow.list[i].main.humidity;
      obj.wind_moscow = moscow.list[i].wind.speed;

      obj.temp_italy = italy.list[i].main.temp;
      obj.pressure_italy = italy.list[i].main.pressure;
      obj.humidity_italy = italy.list[i].main.humidity;
      obj.wind_italy = italy.list[i].wind.speed;

      obj.temp_newYork = newYork.list[i].main.temp;
      obj.pressure_newYork = newYork.list[i].main.pressure;
      obj.humidity_newYork = newYork.list[i].main.humidity;
      obj.wind_newYork = newYork.list[i].wind.speed;

      obj.temp_newZealand = newZealand.list[i].main.temp;
      obj.pressure_newZealand = newZealand.list[i].main.pressure;
      obj.humidity_newZealand = newZealand.list[i].main.humidity;
      obj.wind_newZealand = newZealand.list[i].wind.speed;

      mass.push(obj);
    }
    this.setState({
      serverAnswer: mass,
      showCharts: true, // render charts after all datas fetching
    });
  }

  render() {
    return (
      <div>
        {this.state.showCharts ? (
          <div className='charts-list' >

            <div className='top'>
              <Chart serverAnswer={this.state.serverAnswer} chartName='Temperature' chartType='temp' />
              <Chart serverAnswer={this.state.serverAnswer} chartName='Pressure' chartType='pressure' />
            </div>

            <div className='bottom'>
              <Chart serverAnswer={this.state.serverAnswer} chartName='Wind' chartType='wind' />
              <Chart serverAnswer={this.state.serverAnswer} chartName='Humidity' chartType='humidity' />
            </div>

          </div>
        ) : null}
      </div>
    );
  }
}

export default App;
