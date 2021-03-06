import React, { Component } from 'react';
import './styles/TimersView.css'

class TimerBox extends Component {
  handleClick() {
    window.location = `/timer#${this.props.id}`
  }
  render() {
    const style = {
      box: {
        minHeight: '100px',
        padding: '15px 5px',
        border: '1px solid rgb(209, 209, 209)',
        position: 'relative',
        zIndex: '3',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        float: 'left',
        textAlign: 'center',
        cursor: 'pointer',
      },
      info: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
      title: {
        fontSize: '1.2rem',
        fontWeight: '600',
        width: '100%',
        marginBottom: '7px',
      },
      time: {
        minWidth: '40%',
        display: 'flex',
        flexDirection: 'column',
        // borderLeft: '1px solid white',
      },
      backgroundcolor: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: '.3',
        backgroundColor: this.props.color,
        top: '0',
        left: '0',
        zIndex: '-1',
      },
      shade: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgb(0,0,0)',
        zIndex: '-1',
        top: '0',
        left: '0',
        transition: '400ms'
      }
    }
    // TODO remove the division by having if statements?!?!?
    let total = this.props.expiration;
    const days = Math.trunc(total / 86400);
    const dayDiv = days > 0 ? (<div style={style.time}>{days} <div>days</div></div>) : '';
    total = total - (days*86400);
    const hours = Math.trunc(total / 3600);
    const hoursDiv = hours > 0 ? (<div style={style.time}>{hours} <div>hrs</div></div>) : '';
    total = total - (hours * 3600);
    const minutes = Math.trunc(total / 60);
    const minDiv = minutes > 0 ? (<div style={style.time}>{minutes} <div>mins</div></div>) : '';
    const seconds = Math.trunc(total - (minutes * 60));
    const secDiv = (<div style={style.time}>{seconds}<div>secs</div></div>);
    return(
      <div style={style.box} className='TimerBox' onClick={this.handleClick.bind(this)}>
        <div style={style.info}>
          <div style={style.title}>{this.props.name}</div>
          {secDiv}
          {minDiv}
          {hoursDiv}
          {dayDiv}
        </div>
        <div style={style.backgroundcolor}/>
        <div style={style.shade} className='shade'/>
      </div>
    )
  }
}

export default class TimersView extends Component {
  constructor(props){
    super(props);
    this.state = {
      // timesLeft holds milliseconds left for i timer
      timesLeft: [],
      data: {},
    }
    this.makeTimerBoxes = this.makeTimerBoxes.bind(this);
    this.timersChange = this.timersChange.bind(this);
  }
  componentDidMount() {
    document.title = 'Unknown Timers';
    fetch('/gettimers')
    .then((res)=>{return res.json()})
    .then((data)=>{
      const timesLeft = [];
      const now = new Date().valueOf();
      for(let i = 0; i < data.length; i++){
        timesLeft.push(parseInt(((new Date(data[i].expiration).valueOf() - now)/1000),10));
      }
      // dummy data for testing quick expiration
      // timesLeft.splice(0,0,2);
      // data.splice(0, 0, {name: '', expiration: '', color: 'yellow'});
      // timesLeft.splice(0,0,2);
      // data.splice(0, 0, {name: '', expiration: '', color: 'yellow'});
      this.setState({
        data: data,
        timesLeft: timesLeft,
      })
      this.timer = setInterval(this.timersChange, 1000);
    })
  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }

  timersChange(){
    if(this.state.timesLeft.length === 0) {
      clearInterval(this.timer);
      return
    }
    const timesLeft = [];
    const data = this.state.data.slice();
    let removed = 0;
    for(let i = 0; i < this.state.timesLeft.length; i++){
      const time = this.state.timesLeft[i]-1;
      if(time < 1){
        data.splice(i-(removed--), 1);
      }
      else{
        timesLeft.push(time);
      }
    }
    this.setState({
      timesLeft: timesLeft,
      data: data
    });
  }

  makeTimerBoxes(timesLeft, data){
    const timersBoxes = [];
    for(let i = 0; i < data.length; i++){
      timersBoxes.push(
        <TimerBox
          key={data[i].id+'timerbox'}
          color={data[i].color}
          expiration={timesLeft[i]}
          name={data[i].name}
          id={data[i].id}/>
      )
    }
    return timersBoxes;
  }

  render() {
    const style = {
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      }
    }
    return(
      <div style={style.wrapper} className='TimersViewWrapper'>
        {this.makeTimerBoxes(this.state.timesLeft, this.state.data)}
      </div>
    )
  }
}
