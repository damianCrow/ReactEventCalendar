if(!localStorage.getItem('uniqueId')) {

	localStorage.setItem('uniqueId', 0);
}

if(!localStorage.getItem('events')) {

	localStorage.setItem('events', JSON.stringify({}));
}

function generateUniqueId() {

	var lastId = JSON.parse(localStorage.getItem('uniqueId'));
	var nextId = lastId + 1;
	localStorage.setItem('uniqueId', nextId);
	return nextId;
}

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

		this.props.showDateEvents(JSON.parse(localStorage.getItem('events'))[this.monthName + '-' + day + '-' + this.year]);
		this.setState({selected: this.monthName + '-' + day + '-' + this.year});
		this.isActive(this.monthName + '-' + day + '-' + this.year);
	},
	calendarSaveEvent: function(eventObj) {

		var storedEvents =  JSON.parse(localStorage.getItem('events'));

		if(!storedEvents[eventObj.startDate]) {

			storedEvents[eventObj.startDate] = [eventObj];
			localStorage.setItem('events', JSON.stringify(storedEvents));
			this.props.showDateEvents(JSON.parse(localStorage.getItem('events'))[eventObj.startDate]);
		}
		else {

			storedEvents[eventObj.startDate].push(eventObj);
			localStorage.setItem('events', JSON.stringify(storedEvents));
			this.props.showDateEvents(JSON.parse(localStorage.getItem('events'))[eventObj.startDate]);
		}
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

			<div>

				<table className="calendar">
					<tr><th className="calendar-header">{this.monthName + " " + this.year}</th></tr>
					<tr className="calendar-day-headers">{this.dayHeaders}</tr>

					{this.monthWeeks}
					
				</table>

				<button type="button" className="button button-event" onClick={this.props.createEvent.bind(this, this.state.selected, 'create', this.calendarSaveEvent)}>Create Event</button>

			</div>
		);
	}
});

var event = React.createClass({

	getInitialState: function() {

		if(this.props.eventView === 'edit') {

			return {

	      view: this.props.eventView,
	      eventBeingEdited: this.props.event,
	      eventEndDate: this.props.event.endDate,
	      eventTitle: this.props.event.eventTitle,
	      eventLocation: this.props.event.location
	    }
		}
		else {

			return {

				view: this.props.eventView,
	      formData: {}
			}
		}
  },
	createNewEventTemplate: function(eventDate, eventView) {

		return(

			<form ref={eventDate}>

				<div className="form-section">
					<label for="eventStartDate">Event Start Date</label>
					<input ref="eventStartDate" name="eventStartDate" className="event-date" value={eventDate} disabled/>
				</div>

				<div className="form-section">
					<label for="eventEndDate">Event End Date</label>
					<input ref="eventEndDate" name="eventEndDate" className="event-date" placeholder="Enter Event End Date"/>
				</div>

				<div className="form-section">
					<label for="eventTitle">Event Title</label>
					<input ref="eventTitle" name="eventTitle" className="event-title" placeholder="Enter Event Name/Title"/>
				</div>

				<div className="form-section">
					<label for="eventLocation">Event Location</label>
					<input ref="eventLocation" name="eventLocation" className="event-location" placeholder="Enter Event Location"/>
				</div>

				<div className="form-section">
					<button type="button" className="button" onClick={this.saveEvent}>Save</button>
					<button type="button" className="button button-next" onClick={this.cancelEventCreation}>Cancel</button>
				</div>
			</form>
		);
	},
	listEventsTemplate: function(event) {
		
		if(event !== undefined) {

			return(

				<div>

					<div className="form-section">

						<p>{event.eventTitle}, {event.location}</p>
						
					</div>

					<div className="form-section">
						<button type="button" className="button" onClick={this.props.editEvent.bind(this, event)}>Edit</button>
						<button type="button" className="button button-next" onClick={this.deleteEvent.bind(this, event)}>Delete</button>
					</div>

				</div>

			);
		}
		else {

			return null;
		}
	},
	editEventTemplate: function() {

		return(

			<form ref={this.state.eventBeingEdited.id}>

				<div className="form-section">
					<label for="eventStartDate">Event Start Date</label>
					<input ref="eventStartDate" name="eventStartDate" className="event-date" onChange={this.updateInputValue} value={this.state.eventBeingEdited.startDate} disabled/>
				</div>

				<div className="form-section">
					<label for="eventEndDate">Event End Date</label>
					<input ref="eventEndDate" name="eventEndDate" className="event-date" onChange={this.updateInputValue} value={this.state.eventEndDate}/>
				</div>

				<div className="form-section">
					<label for="eventTitle">Event Title</label>
					<input ref="eventTitle" name="eventTitle" className="event-title" onChange={this.updateInputValue} value={this.state.eventTitle}/>
				</div>

				<div className="form-section">
					<label for="eventLocation">Event Location</label>
					<input ref="eventLocation" name="eventLocation" className="event-location" onChange={this.updateInputValue} value={this.state.eventLocation}/>
				</div>

				<div className="form-section">
					<button type="button" className="button" onClick={this.updateEvent.bind(this, this.state.eventBeingEdited)}>Update</button>
					<button type="button" className="button button-next" onClick={this.props.cancel}>Cancel</button>
				</div>
			</form>
		);
	},
	updateInputValue: function(e) {

		switch(e.target.name) {

			case 'eventEndDate':

			this.setState({eventEndDate: e.target.value});

			break;

			case 'eventTitle':

			this.setState({eventTitle: e.target.value});

			break;

			case 'eventLocation':

			this.setState({eventLocation: e.target.value});

			break;
		}
	},
	cancelEventCreation: function() {
		
		this.props.creatingEvent(false);
	},
	saveEvent: function() {

		this.state.formData.id = generateUniqueId();
		this.state.formData.startDate = this.refs.eventStartDate.value;
		this.state.formData.endDate = this.refs.eventEndDate.value;
		this.state.formData.eventTitle = this.refs.eventTitle.value;
		this.state.formData.location = this.refs.eventLocation.value;

		this.props.save(this.state.formData);
		this.props.creatingEvent(false);
	},
	updateEvent: function(event) {
	
		var self = this;
		
		event.startDate = this.refs.eventStartDate.value;
		event.endDate = this.refs.eventEndDate.value;
		event.eventTitle = this.refs.eventTitle.value;
		event.location = this.refs.eventLocation.value;

		var eventArray = JSON.parse(localStorage.getItem('events'));

		eventArray[event.startDate].forEach(function(item, itemIndex) {

			if(item.id === event.id) {
				
				eventArray[event.startDate][itemIndex] = event;
				localStorage.setItem('events', JSON.stringify(eventArray));
				self.props.showDateEvents(eventArray[event.startDate]);
			}
		});
	},
	deleteEvent: function(event) {

		var self = this;
		var eventArray = JSON.parse(localStorage.getItem('events'));

		eventArray[event.startDate].forEach(function(item, itemIndex) {

			if(item.id === event.id) {
				
				eventArray[event.startDate].splice(itemIndex, 1);
				localStorage.setItem('events', JSON.stringify(eventArray));
				self.props.showDateEvents(eventArray[event.startDate]);
			}
		});
	},
	render: function() {

		switch(this.state.view) {

			case 'create':
			
			return this.createNewEventTemplate(this.props.eventDate, this.props.eventView);

			break;

			case 'list':

			return this.listEventsTemplate(this.props.event);

			break;
			
			case 'edit':

			return this.editEventTemplate();

			break;
		}
	}
});

var app = React.createClass({

	getInitialState: function() {

		return {

			month: new Date().getMonth(),
			year:new Date().getFullYear(),
			showCalendar: true,
			isCreating: false,
			isEditing: false,
			eventList: [],
			newEvent: [],
			eventBeingEdited: [],
			notification: '',
			showEventList: true,
			eventListDate: ''
		};
	},
	showPreviousMonth: function() {

		this.refs[this.state.month].setState({selected: ''})
		this.isCreatingEvent(false);

		if(this.state.month === 0) {

			var newYear = this.state.year - 1;
			this.setState({month: 11, year: newYear, showEventList: false});
		}
		else {

			var newMonth = this.state.month - 1;
			this.setState({month: newMonth, showEventList: false});
		}
	},
	showNextMonth: function() {
		
		this.refs[this.state.month].setState({selected: ''});
		this.isCreatingEvent(false);

		if(this.state.month === 11) {

			var newYear = this.state.year + 1;
			this.setState({month: 0, year: newYear, showEventList: false});
		}
		else {

			var newMonth = this.state.month + 1;
			this.setState({month: newMonth, showEventList: false});
		}
	},
	createNewEvent: function(eventDate, eventView, calendarSaveEvent) {

		if(!eventDate) {

			this.setState({notification: 'No event start date selected!'});
			return null;
		}

		if(this.state.isCreating === true) {

			return null;
		}
		else {

			this.isCreatingEvent(true);
			this.state.newEvent.push(React.createElement(event, {eventDate: eventDate, eventView: eventView, creatingEvent: this.isCreatingEvent, save: calendarSaveEvent}));
		}
	},
	isCreatingEvent: function(trueOrFalse) {

		if(trueOrFalse === false) {

			this.state.newEvent.length = 0;
			this.setState({showEventList: true, isCreating: false});
		}

		if(trueOrFalse === true) {

			this.cancelEventEditing();
			this.setState({showEventList: false, isCreating: true});
		}
	},
	editEvent: function(eventObj) {

		this.state.eventBeingEdited.push(React.createElement(event, {event: eventObj, showDateEvents: this.showDateEvents, eventView: 'edit', cancel: this.cancelEventEditing}));
		this.setState({isEditing: true, showEventList: false});
	},
	cancelEventEditing: function() {

		this.setState({eventBeingEdited: [], isEditing: false, showEventList: true});
	},
	showDateEvents: function(eventsArray) {
		
		this.isCreatingEvent(false);
		this.cancelEventEditing();

		this.state.eventList.length = 0;
		this.setState({notification: ''});

		if(eventsArray !== undefined && eventsArray.length > 0) {

			this.setState({eventListDate: eventsArray[0].startDate.replace(/-/g, ' ')});

			for(var i = 0; i < eventsArray.length; i++) {

				this.state.eventList.push(React.createElement(event, {
					eventView: 'list',   
					event: eventsArray[i],
					showDateEvents: this.showDateEvents,
					editEvent: this.editEvent
				}));
			}
		}
	},
	render: function() {	

		return (

			<div id="app">

				<button type="button" className="button" onClick={this.showPreviousMonth}>Last Month</button>
				<button type="button" className="button button-next" onClick={this.showNextMonth}>Next Month</button>

				{React.createElement(calendar, {ref:this.state.month, month: this.state.month, year: this.state.year, createEvent: this.createNewEvent, showDateEvents: this.showDateEvents})}
				{this.state.eventList.length > 0  && this.state.showEventList ? <h3>Events for: {this.state.eventListDate}</h3> : null}
				{this.state.eventList.length < 1 && this.state.showEventList ? <h3>There are no events scheduled for today.</h3> : null}
				{this.state.isEditing && this.state.eventBeingEdited.length > 0 ? this.state.eventBeingEdited : null}
				{this.state.notification !== '' ? <h3>{this.state.notification}</h3> : null}
				{this.state.showEventList ? this.state.eventList : null}
				{this.state.isCreating ? this.state.newEvent : null}

			</div>
		);
	}
});

ReactDOM.render(React.createElement(app), document.getElementById('view'));