class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(config == undefined){
            throws ('config isn\'t passed');
        }
        this.states = config.states;
        this.activeState = config.initial;
        this.initial = config.initial;
        this.prevState = false;
        this.triggerSuccess = false;
        this.redoCall = false;
        this.history={
            data : [this.initial],
            index : 0
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        //console.log(this.activeState);
        return this.activeState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if(!this.states.hasOwnProperty(state)){
            throws('state isn\'t exist');
        }

        this.activeState = state;

        this.history.data.push(this.activeState);
        this.history.index ++;
        this.redoCall = false;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let state = this.states[this.activeState].transitions[event];
        if(state == undefined){
            this.triggerSuccess = false;
            throws('event in current state isn\'t exist');
        }
        this.triggerSuccess = true;
        this.changeState(state);

    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.activeState = this.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {

        let arr = [];

        if(event == undefined){
            for(let key in this.states){
                arr.push(key);
            }
            return arr;
        }

        for(let key in this.states){
            if(this.states[key].transitions
                    .hasOwnProperty(event)){
                arr.push(key);
            }
        }
        return arr;
        //return Object.keys(this.states).toArray();
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        this.history.index--;
        if(this.history.data[this.history.index] == undefined)
            return false;

        this.redoCall = true;
        //console.log(this.history.data);
        this.activeState = this.history.data[this.history.index];


        if(this.triggerSuccess == true){
            //console.log(true);
            return true;
        }
        console.log(this.history);
        //return this.activeState;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this.history.data[this.history.index + 1] == undefined){
            return false;
        }

        if(this.redoCall == false)
            return false;

        this.history.index++;
        this.activeState = this.history.data[this.history.index];

        if(this.triggerSuccess == true){
            //console.log(true);
            return true;
        }

    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history.data.length = 0;
        this.history.index = -1;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
