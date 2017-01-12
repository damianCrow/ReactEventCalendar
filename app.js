var calendar = React.createClass({

	getInitialState: function() {
    return {

      selected: this.monthName + '-' + this.currentDate.getDate() + '-' + this.year
    }
  },
  componentDidMount: function() {

    this.showEvents(this.currentDate.getDate());
  },
	showEvents: function(day) {

		this.setState({selected: this.monthName + '-' + day + '-' + this.year});
		this.isActive(this.monthName + '-' + day + '-' + this.year);
	},
	 isActive:function(value) {

    return ((value === this.state.selected) ? 'calendar-day selected-day' : 'calendar-day');
  },
	days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	months: ['January', 'February', 'March', 'April','May', 'June', 'July', 'August', 'September','October', 'November', 'December'],
	monthLengths: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	currentDate: new Date(),
	creatMonthWeeks: function (arr, n) {

	  var res = [];

	  while(arr.length) {

	    res.push(<tr>{arr.splice(0, n)}</tr>);
	  }

	  return res;
	},
	createCalendar: function(month, year) {

		this.month = (isNaN(month) || month == null) ? this.currentDate.getMonth() : month;
		this.year  = (isNaN(year) || year == null) ? this.currentDate.getFullYear() : year;
		this.monthName = this.months[this.month];
		this.monthLength = this.monthLengths[this.month];

		if(this.month == 1) { 

		  if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0) {

		    this.monthLength = 29;
		  }
		}
		this.firstDay = new Date(this.year, this.month, 1);
		this.startingDay = this.firstDay.getDay();
		this.dayHeaders = [];
		this.monthWeeks = [];
		this.monthDays = [];

		for(var i = 0; i < this.days.length; i++) {
			
			this.dayHeaders.push(<td className="calendar-header-day">{this.days[i]}</td>);
		}

		var day = 1;

		for (var i = 0; i < 9; j++) {

		  for (var j = 0; j <= 6; j++) { 

		    if(day <= this.monthLength && (i > 0 || j >= this.startingDay)) {

		    	if(day === this.currentDate.getDate() && this.month === this.currentDate.getMonth() && this.year === this.currentDate.getFullYear()) {

		    		this.monthDays.push(<td ref={this.monthName + '-' + day + '-' + this.year} onClick={this.showEvents.bind(this, day)} id="today" className={this.isActive(this.monthName + '-' + day + '-' + this.year)}>{day}</td>);
		    	}
		    	else {

		    		this.monthDays.push(<td ref={this.monthName + '-' + day + '-' + this.year} onClick={this.showEvents.bind(this, day)} className={this.isActive(this.monthName + '-' + day + '-' + this.year)}>{day}</td>);
		    	}

		      day++;
		    }
		  }
		  
		  if(day > this.monthLength) {

		  	for(var i = 0; i < this.startingDay; i++) {
		  		
		  		this.monthDays.splice(0, 0, <td className="calendar-day"></td>);
		  	}

		  	if(this.monthDays.length === this.monthLength + this.startingDay) {

		  		this.monthWeeks.push(this.creatMonthWeeks(this.monthDays, 7));
		  	}

		    break;
		  } 
		}
	},
	render: function() {
		
		this.createCalendar(this.props.month, this.props.year);

		return (

			<table className="calendar">
				<tr><th className="calendar-header">{this.monthName + " " + this.year}</th></tr>
				<tr className="calendar-day-headers">{this.dayHeaders}</tr>

				{this.monthWeeks}
				
			</table>

		);
	}
});

var event = React.createClass({

	render: function() {
		
		// return (

		// );
	}
});

var app = React.createClass({

	getInitialState: function() {

		return {

			month: new Date().getMonth(),
			year:new Date().getFullYear()
		};
	},
	showPreviousMonth: function() {

		if(this.state.month === 0) {

			var newYear = this.state.year - 1;
			this.setState({month: 11, year: newYear});
		}
		else {

			var newMonth = this.state.month - 1;
			this.setState({month: newMonth});
		}
	},
	showNextMonth: function() {

		if(this.state.month === 11) {

			var newYear = this.state.year + 1;
			this.setState({month: 0, year: newYear});
		}
		else {

			var newMonth = this.state.month + 1;
			this.setState({month: newMonth});
		}
	},
	createNewEvent: function() {
		
	}
	render: function() {
		
		return (

			<div id="app">

				<button className="button" onClick={this.showPreviousMonth}>Last Month</button>
				<button className="button button-next" onClick={this.showNextMonth}>Next Month</button>

				{React.createElement(calendar, {month: this.state.month, year: this.state.year})}

				<button className="button button-event" onClick={this.createNewEvent}>Create Event</button>
			</div>
		);
	}
});

ReactDOM.render(React.createElement(app), document.getElementById('view'));