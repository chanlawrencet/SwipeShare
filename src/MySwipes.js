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

class MySwipes extends React.Component{

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
        const {userEmail} = this.props;
        const body = {
            email: userEmail
        };
        fetch('https://swipeshareapi.herokuapp.com/getuserswipes',
            {method:'POST',
                body:JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }})
            .then(response => response.json())
            .then(data => {
                this.setState({giving: data.giving, receiving: data.receiving})
            }).catch(x => {
            console.log('no data', x)
            return('no data')
        })
    }

    constructor(props){
        super(props);
        this.state = {
            receiving: [],
            giving: [],
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
        console.log(theCardInfo)
        return(
            <Card key={id + location + Math.random()} style={{marginBottom:10}}>
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
                        }}>Remove Instance</Button>
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

    cards(){
        const {giving, receiving} = this.state;
        const filtersList = this.makeFilters();
        let givingL = [];
        let receivingL = [];
        giving.forEach(x => {
                if (filtersList.includes(x.location)){
                    givingL.push(this.makeCard(x))
                }
            }
        );

        receiving.forEach(x => {
                if (filtersList.includes(x.location)){
                    receivingL.push(this.makeCard(x))
                }
            }
        );

        return (
            <div>
                <div style={{fontSize: 30, textAlign: 'left', paddingBottom:5 }} key='mToday2'>Giving:</div>
                {givingL.length === 0 ? this.makeUnavailableFiltersCard('mToday2') : givingL}
                <div style={{fontSize: 30, textAlign: 'left', paddingBottom:5}} key='mTom2'>Receiving</div>
                {receivingL.length === 0 ? this.makeUnavailableFiltersCard('mTomorrow2') : receivingL}
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
                    key='carm2'
                    label='Carmichael'
                    clickable
                    color={carmichael ? 'primary' : 'default'}
                    onClick={() => this.setState({filters: {
                            carmichael: !carmichael, dewick: dewick, hodgdon: hodgdon
                        }})}
                />
                <Chip
                    className="chip"
                    key='dew2'
                    label='Dewick'
                    clickable
                    color={dewick ? 'primary' : 'default'}
                    onClick={() => this.setState({filters: {
                            carmichael: carmichael, dewick: !dewick, hodgdon: hodgdon
                        }})}
                />
                <Chip
                    className="chip"
                    key='hodge2'
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
        const {showLoginMessage, enteredDate, enteredDiningHall, cards, showConfirmation, showGiverForm, selectedID, selectedLocation, selectedTime} = this.state;
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
                    <DialogTitle id="alert-dialog-title">Please confirm your removal</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            You're deleting a meal at {selectedLocation ? this.toPrettyLocationString(selectedLocation) : null } at {this.toPrettyTimeString(selectedTime)}
                        </DialogContentText>
                        <DialogContentText id="alert-dialog-description2">
                            You and any impacted users will receive an email alert as a notification.
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
                            Remove
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default MySwipes;