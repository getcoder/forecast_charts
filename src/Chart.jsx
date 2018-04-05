import React, { Component } from 'react';
import './react-super-select.css';
import './App.css';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import './react-datepicker.css';

import ReactSuperSelect from 'react-super-select';

var testData = [ // searchable cities
  { "id": "1", "name": 'Italy' },
  { "id": "2", "name": 'New York' },
  { "id": "3", "name": 'Moscow' },
  { "id": "4", "name": 'New Zealand' },
];



class Chart extends Component {
  state = {
    mydata: [],
    fmass: [],
    cities: [true, false, false, false],
    startDate: moment(),
    endDate: moment(),
    chartWidth: 100,
    chartHeight: 50,
  }

  handleChange = ({ startDate, endDate }) => { // set date interval
    startDate = startDate || this.state.startDate
    endDate = endDate || this.state.endDate

    if (startDate.isAfter(endDate)) {
      endDate = startDate
    };

    this.setState({ startDate, endDate }, () => this.filterMass());
  }

  handleChangeStart = (startDate) => this.handleChange({ startDate })

  handleChangeEnd = (endDate) => this.handleChange({ endDate })

  componentWillMount() {
    this.setState({
      mydata: this.props.serverAnswer,
      fmass: this.props.serverAnswer,
      startDate: moment(this.props.serverAnswer[0].dt_txt),
      endDate: moment(this.props.serverAnswer[29].dt_txt),
      chartWidth: window.innerWidth / 2.5,
      chartHeight: window.innerWidth / 2.5 - 150,
    });
  }

  updateDimensions() { // chenge chart width and height after window resize
    if (window.innerWidth <= 800) {
      this.setState({ chartWidth: window.innerWidth * 0.95 * 0.94, chartHeight: window.innerWidth * 0.95 * 0.94 * 0.6 });
    } else {
      this.setState({ chartWidth: window.innerWidth * 0.95 * 0.44, chartHeight: window.innerWidth * 0.95 * 0.44 * 0.6 });
    }
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
    console.log('componentWillUnmount');
  }

  filterMass = () => { // bad date filter, but it works
    let newMass = [];
    let start;
    let end;
    for (let i = 0; i < this.state.mydata.length; i++) {
      if (this.state.mydata[i].dt_txt.indexOf(this.state.startDate.set('second', 0).format("YYYY-MM-DD HH:mm:ss")) === 0) {
        start = i;
        console.log('start ', start);
        break;
      }
    }
    for (let i = 0; i < this.state.mydata.length; i++) {
      if (this.state.mydata[i].dt_txt.indexOf(this.state.endDate.set('second', 0).format("YYYY-MM-DD HH:mm:ss")) === 0) {
        end = i;
        console.log('end ', end);
        break;
      }
    }
    newMass = this.state.mydata.slice(start, end + 1);
    console.log('newMass ', newMass);
    this.setState({
      fmass: newMass,
    });
  }

  handlerCitySelect = (options) => { // in options get massiv with selected cities
    let mass = [false, false, false, false];
    if (options === undefined) {
      mass = [false, false, false, false];
    } else {
      for (let i = 0; i < options.length; i++) {
        mass[options[i].id - 1] = !mass[options[i].id - 1];
      };
    }
    this.setState({
      cities: mass,
    })
  };

  render() {
    return (
      <div className='chart' id='chart' >
        <div className='container-title' >
          <h1 className='title' id='title' >{this.props.chartName}</h1>
        </div>

        <div className='container-inline' >

          <div className='i' >
            <div className='from' >
              <font color='45ADE9'>From</font>
              <DatePicker
                selected={this.state.startDate}
                selectsStart
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                onChange={this.handleChangeStart}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={180}
                dateFormat="YYYY-MM-DD HH:mm"
              />
            </div>

            <div className='to' >
              <font color='45ADE9'>To</font>
              <DatePicker
                selected={this.state.endDate}
                selectsEnd
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                onChange={this.handleChangeEnd}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={180}
                dateFormat="YYYY-MM-DD HH:mm"
              />
            </div>
          </div>

          <div className="select" >
            <ReactSuperSelect placeholder="Make Your Selections"
              dataSource={testData}
              onChange={this.handlerCitySelect}
              multiple={true}
              keepOpenOnSelection={true}
              initialValue={[testData[0],]}
              tags={true}
            />
          </div>
        </div>

        <LineChart width={this.state.chartWidth} height={this.state.chartHeight} data={this.state.fmass} >
          <XAxis hide dataKey="dt_txt" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          {this.state.cities[0] ? <Line type="monotone" dataKey={`${this.props.chartType}_italy`} stroke="#000000" activeDot={{ r: 8 }} /> : null}
          {this.state.cities[1] ? <Line type="monotone" dataKey={`${this.props.chartType}_newYork`} stroke="#00ff00" activeDot={{ r: 8 }} /> : null}
          {this.state.cities[2] ? <Line type="monotone" dataKey={`${this.props.chartType}_moscow`} stroke="#0000ff" activeDot={{ r: 8 }} /> : null}
          {this.state.cities[3] ? <Line type="monotone" dataKey={`${this.props.chartType}_newZealand`} stroke="#ff0000" activeDot={{ r: 8 }} /> : null}
        </LineChart>

      </div>
    );
  }
}

export default Chart;
