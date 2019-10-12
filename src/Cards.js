import React from 'react'
import {Card} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close"
import MenuItem from "@material-ui/core/MenuItem";
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import Grid from "@material-ui/core/Grid";

// https://codewithhugo.com/add-date-days-js/
// https://stackoverflow.com/questions/43855166/how-to-tell-if-two-dates-are-in-the-same-day

class Cards extends React.Component{

    toPrettyTimeString = time => {
        const theDate = new Date(time);
        const timeString = theDate.toLocaleTimeString([], {month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'});
        let finalString = timeString;
        if (timeString.charAt(0) === '0'){
            finalString = timeString.slice(1);
        }
        return finalString
    }


    toPrettyLocationString = location => {
        return location.charAt(0).toUpperCase() + location.slice(1)
    }


    requestCards = () => {
        var request = new Request('https://swipeshareapi.herokuapp.com/', {method:'GET'});
        fetch(request)
            .then(response => response.json())
            .then(data => {
                this.setState({cards: data.entries})
            }).catch(x => {
            console.log('no data', x)
            return('no data')
        })
    }

    constructor(props){
        super(props);
        this.state = {
            cards:[],
            filters: {
                carmichael: true,
                dewick: true,
                hodgdon: true
            },
            selectedID: '',
            showConfirmation: false,
            showLoginMessage: false,
            enteredDate: new Date(),
            showGiverForm: false,
            enteredDiningHall: '',
        }

    }

    makeUnavailableFiltersCard(theKey){
        return(
            <Card key={theKey} style={{marginBottom:10}}>
                <CardContent>
                    <Typography variant='h6' align='center'>
                        No meals available at this time for this time and filters.
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    makeCard(theCardInfo){
        const {userVerified, userEmail} = this.props;
        const {location, time, id} = theCardInfo;
        return(
            <Card key={id + location} style={{marginBottom:10}}>
                <CardContent>
                    <Typography variant='h5' align='left'>
                        {this.toPrettyLocationString(location)} - {this.toPrettyTimeString(time)}
                    </Typography>
                </CardContent>
                <div>
                    <CardActions align='right' style={{justifyContent: 'flex-end'}}>
                        <Button size="medium" onClick={() => {
                            if (userVerified && userEmail !== ''){
                                console.log('good')
                                this.setState({
                                    selectedID: id.toString(),
                                    selectedTime: time,
                                    showConfirmation: true
                                })
                            } else {
                                this.setState({showLoginMessage: true})
                            }
                        }}>Request Meal</Button>
                    </CardActions>
                </div>

            </Card>

        )
    }

    makeFilters(){
        const {filters} = this.state;
        let toReturn = [];
        if (filters.carmichael){
            toReturn.push('carmichael')
        }
        if (filters.dewick){
            toReturn.push('dewick')
        }
        if (filters.hodgdon){
            toReturn.push('hodgdon')
        }

        return toReturn
    }

    sameDay = (d1, d2) => {
        console.log(d1, d2)
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    addDays = (date, days) => {
        const copy = new Date(Number(date))
        copy.setDate(date.getDate() + days)
        return copy
    }
    cards(){
        const {cards} = this.state;
        let today = [];
        let tomorrow = [];
        let rest = [];
        const filtersList = this.makeFilters();
        const todayDate = new Date()
        const tomorrowDate = this.addDays(todayDate, 1)
        cards.forEach(x => {

                if (filtersList.includes(x.location) && this.sameDay(todayDate, new Date(x.time))){
                    today.push(this.makeCard(x))
                } else if (filtersList.includes(x.location) && this.sameDay(tomorrowDate, new Date(x.time))){
                    tomorrow.push(this.makeCard(x))
                } else if (filtersList.includes(x.location)){
                    rest.push(this.makeCard(x))
                }

            }
        );

        return (
            <div>
                <div style={{fontSize: 30, textAlign: 'left', paddingBottom:5 }} key='mToday'>Meal swipes today</div>
                {today.length === 0 ? this.makeUnavailableFiltersCard('mTodayc') : today}
                <div style={{fontSize: 30, textAlign: 'left', paddingBottom:5}} key='mTom'>Meal swipes tomorrow</div>
                {tomorrow.length === 0 ? this.makeUnavailableFiltersCard('mTomorrowc') : tomorrow}
                <div style={{fontSize: 30, textAlign: 'left', paddingBottom:5}} key='mBeyond'>Meal swipes beyond</div>
                {rest.length === 0 ? this.makeUnavailableFiltersCard('mRest') : rest}
            </div>
        )
    }

    showOptions(){
        const {filters} = this.state;
        const {carmichael, dewick, hodgdon} = filters;
        return(
            <div>
                <Chip
                    className="chip"
                    key='carm'
                    label='Carmichael'
                    clickable
                    color={carmichael ? 'primary' : 'default'}
                    onClick={() => this.setState({filters: {
                            carmichael: !carmichael, dewick: dewick, hodgdon: hodgdon
                        }})}
                />
                <Chip
                    className="chip"
                    key='dew'
                    label='Dewick'
                    clickable
                    color={dewick ? 'primary' : 'default'}
                    onClick={() => this.setState({filters: {
                            carmichael: carmichael, dewick: !dewick, hodgdon: hodgdon
                        }})}
                />
                <Chip
                    className="chip"
                    key='hodge'
                    label='Hodgdon'
                    clickable
                    color={hodgdon ? 'primary' : 'default'}
                    onClick={() => this.setState({filters: {
                            carmichael: carmichael, dewick: dewick, hodgdon: !hodgdon
                        }})}
                />
            </div>
        )
    }

    componentDidMount() {
        this.requestCards()
        setInterval(this.requestCards, 10000)
    }
    handleCloseGiverForm = () => {
        this.setState({showGiverForm: false})
    };


    render() {
        const {showLoginMessage, enteredDate, enteredDiningHall, showConfirmation, showGiverForm, selectedID, selectedLocation, selectedTime} = this.state;
        const {userEmail, userVerified} = this.props
        return(
            <div style={{marginLeft:'15%', marginRight: '15%'}}>
                <Button  variant='contained' onClick={() => {
                    if (!userVerified){
                        console.log("NOT ALLOWED");
                        this.setState({showLoginMessage: true});
                        return;
                    }
                    this.setState({showGiverForm: true}
                    )}}>Give a swipe</Button>
                <br/>
                <br/>
                {this.showOptions()}
                {this.cards()}
                <Dialog
                    open={showConfirmation}
                    onClose={() => this.setState({showConfirmation: false})}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Please confirm your request</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            You're agreeing to a meal at {selectedLocation ? this.toPrettyLocationString(selectedLocation) : null } at {this.toPrettyTimeString(selectedTime)}
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-description2">
                            You will receive an email alert as a reminder.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({showConfirmation: false})} color="primary">
                            Back
                        </Button>
                        <Button onClick={() => {
                            const body = {
                                id: selectedID,
                                receiver_email: userEmail
                            };
                            fetch('https://swipeshareapi.herokuapp.com/makerequest',
                                {method:'POST',
                                    body:JSON.stringify(body),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }})
                                .then(response => response.status)
                                .then(status => {
                                    if (status !== 200){
                                        console.log('big bad')
                                    } else {
                                        console.log('success')
                                        this.requestCards()
                                    }
                                }).catch(x => {
                                console.log('no data', x)
                                return('no data')
                            })
                            this.setState({showConfirmation: false})
                        }} color="primary" autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog fullWidth open={showGiverForm} onClose={this.handleCloseGiverForm} aria-labelledby="form-dialog-title">
                    <DialogTitle style={{fontSize: 100}} id="form-dialog-title">Give a mealswipe!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the information below:
                        </DialogContentText>

                    </DialogContent>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-around">
                            <div>
                                <InputLabel style={{marginTop: 17}} shrink htmlFor="age-label-placeholder">
                                    Dining Hall
                                </InputLabel>
                                <Select
                                    style={{width:220}}
                                    shrink
                                    value={enteredDiningHall}
                                    onChange={e => this.setState({enteredDiningHall: e.target.value})}
                                >
                                    <MenuItem value='carmichael'>Carmichael</MenuItem>
                                    <MenuItem value='dewick'>Dewick</MenuItem>
                                    <MenuItem value='hodgdon'>Hodgdon</MenuItem>
                                </Select>
                            </div>
                            <KeyboardDatePicker
                                style={{fontsize: 20}}
                                disableToolbar
                                disablePast
                                variant="inline"
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="Date"
                                value={enteredDate}
                                onChange={newDate => this.setState({enteredDate: newDate})}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            <KeyboardTimePicker
                                margin="normal"
                                id="time-picker"
                                label="Time"
                                value={enteredDate}
                                onChange={newDate => this.setState({enteredDate: newDate})}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                    <DialogActions>
                        <Button onClick={this.handleCloseGiverForm} color="primary">
                            Cancel
                        </Button>
                        <Button disabled={!enteredDiningHall} onClick={() => {
                            const body = {
                                giver_email: userEmail,
                                location: enteredDiningHall,
                                time: enteredDate
                            };
                            fetch('https://swipeshareapi.herokuapp.com/addentry',
                                {method:'POST',
                                    body:JSON.stringify(body),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }})
                                .then(response => response.status)
                                .then(status => {
                                    if (status === 200){
                                        this.handleCloseGiverForm()
                                        this.requestCards()
                                        this.setState({
                                            enteredDiningHall: '',
                                            time: new Date()
                                        })
                                    } else {
                                        console.log('big bad')
                                    }
                                }).catch(x => {
                                console.log('no data', x)
                                return('no data')
                            })
                        }} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    variant="error"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={showLoginMessage}
                    onClose={() => this.setState({showLoginMessage: false})}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    autoHideDuration={2000}
                    message={<span id="message-id">Please log in first!</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            onClick={() => this.setState({showLoginMessage: false})}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </div>
        )
    }
}

export default Cards;