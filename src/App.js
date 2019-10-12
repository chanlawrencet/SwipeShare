import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close"
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import Grid from "@material-ui/core/Grid";
import Cards from './Cards'
import cookie from 'react-cookies'

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            hello: 'world',
            userEmail: cookie.load('email'),
            userVerified: cookie.load('verified'),
            cards: [
                {
                    location: 'carmichael',
                    time: '10pm'
                },
                {
                    location: 'carmichael',
                    time: '10pm'
                },
                {
                    location: 'carmichael',
                    time: '10pm'
                },
                {
                    location: 'carmichael',
                    time: '10pm'
                },
                {
                    location: 'hodgdon',
                    time: '10pm'
                }
            ],
            showLogin: false,
            enteredEmail: '',
            enteredCode: '',
            enteredDate: new Date(),
            showLoginMessage: false,
            showInvalidMessage: false,
            showSuccessMessage: false,
            showCodeField: true,
            showGiverForm: false,
            enteredDiningHall: ''
        };
    }


    submitEmail = () => {
        const {enteredEmail} = this.state
        if (this.isValidEmail(enteredEmail)){
            this.setState({
                showSuccessMessage: true
            })
        } else {
            this.setState({
                showInvalidMessage: true
            });
            return false;
        }
        const success = true;
        if (success){
            this.setState({showCodeField:true, enteredCode: ''})
        }
    }


    submitCode = () => {
        const {enteredCode, enteredEmail} = this.state
        if (!this.isValidEmail(enteredEmail)){
            this.setState({
                showInvalidMessage: true
            });
            return false;
        }
        console.log(enteredCode)
    };

    isValidEmail = enteredEmail => {
        const length = enteredEmail.length;
        return enteredEmail.substring(length - 10, length) === '@tufts.edu'
    };

    loginWindow(){
        const {enteredEmail, enteredCode, showCodeField} = this.state
        return(
            <div>
                <TextField
                    required
                    id="outlined-email-input"
                    label="Email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    margin="normal"
                    variant="outlined"
                    style={{width: 450}}
                    value={enteredEmail}
                    onChange={e => this.setState({enteredEmail: e.target.value, showInvalidMessage: false})}
                />
                <br/>
                {showCodeField ? (
                    <div>
                        <TextField
                            required
                            id="outlined-email-input"
                            label="Code"
                            name="code"
                            margin="normal"
                            variant="outlined"
                            style={{width: 450}}
                            value={enteredCode}
                            onChange={e => this.setState({enteredCode: e.target.value})}
                        />

                        <div style={{marginLeft:320,  cursor: 'pointer', textDecoration: 'underline'}} onClick={() => this.setState({showCodeField: false})}>Don't have a code?</div>
                    </div>
                ) : null}
                {showCodeField ?
                    <Button type='submit' variant='contained' onClick={this.submitCode}>submit</Button> :
                    <div>
                        <div style={{marginLeft:300,  cursor: 'pointer', textDecoration: 'underline'}} onClick={() => this.setState({showCodeField: true})}>Have a code already?</div>
                        <Button type='submit' variant='contained' onClick={this.submitEmail}>send code</Button>
                    </div>

                }

            </div>
        )
    }

    handleCloseGiverForm = () => {
        this.setState({showGiverForm: false})
    };

    render(){
        const {userVerified, userEmail, enteredDate, showLogin, showLoginMessage, showInvalidMessage, showSuccessMessage, showGiverForm, enteredDiningHall} = this.state;
        return (
            <div className="App">
                <div style={{fontSize:50, marginTop:10}}>Swipe Share</div>
                <div style={{fontSize:20}}>A way to share your mealswipes!</div>
                <br/>
                {userEmail ? <div>
                    <div>Logged in as {userEmail}.</div>
                    <Button onClick={() => {
                        this.setState({userEmail: null})
                        cookie.remove('email', { path: '/' })
                        cookie.remove('verified', { path: '/' })
                    }}>Logout</Button>
                </div> : null}
                <Button  variant='contained' onClick={() => this.setState({showLogin: !showLogin})}>login</Button>
                {showLogin ? this.loginWindow() : null}
                <br/>
                <br/>
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

                <div style={{fontSize:30, textAlign:'left', marginLeft:'15%', marginBottom:10}}>Available Meal Swipes:</div>
                <Cards/>
                <Dialog fullWidth open={showGiverForm} onClose={this.handleCloseGiverForm} aria-labelledby="form-dialog-title">
                    <DialogTitle style={{fontSize: 100}} id="form-dialog-title">Give a mealswipe!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the information below:
                        </DialogContentText>
                        <InputLabel>Dining Hall</InputLabel>
                        <Select
                            style={{width:200}}
                            value={enteredDiningHall}
                            onChange={e => this.setState({enteredDiningHall: e.target.value})}
                        >
                            <MenuItem value='carmichael'>Carmichael</MenuItem>
                            <MenuItem value='dewick'>Dewick</MenuItem>
                            <MenuItem value='hodgdon'>Hodgdon</MenuItem>
                        </Select>
                    </DialogContent>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-around">
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
                            <br/>
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
                        <Button onClick={this.handleCloseGiverForm} color="primary">
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
                    open={showInvalidMessage}
                    onClose={() => this.setState({showInvalidMessage: false})}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    autoHideDuration={6000}
                    message={<span id="message-id">Not a @tufts.edu address!</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            onClick={() => this.setState({showInvalidMessage: false})}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
                <Snackbar
                    variant="error"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={showSuccessMessage}
                    onClose={() => this.setState({showSuccessMessage: false})}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    autoHideDuration={6000}
                    message={<span id="message-id">Check your email for a code!</span>}

                    action={[
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            onClick={() => this.setState({showSuccessMessage: false})}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
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
                    autoHideDuration={6000}
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
        );
    }
}
export default App;