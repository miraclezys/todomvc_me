import $ from 'jquery';
import React from 'react';
import { render } from 'react-dom';
import './app.css';
import './base.css';

class ListItem extends React.Component {
    constructor(props) {
		super(props);
        this.state = {
            editing: false,
            inputValue: this.props.text
        };
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
	}

    handleDoubleClick(event) {
        this.setState({
            editing: true
        });
    }

    handleSubmit(event) {
        this.setState({
            editing: false
        });

        let mValue = this.state.inputValue.trim()
        if (mValue) {
            this.props.onKeyDown(mValue);
        } else {
            this.props.itemDelete();
        }
    }

    handleChange(event){
        this.setState({inputValue: event.target.value});
    }

    handleKeyDown(event) {
        if (event.keyCode != 13) {
            return;
        }
        event.preventDefault();
        this.handleSubmit();
    }

    componentDidUpdate() {
        if (this.state.editing) {
            this.textInput.focus();
        }
    }

	render() {
        let completeStyle = "";
        if (this.props.completed) {
            completeStyle = "completed";
        }
        else {
            completeStyle = "";
        } 

        let InputStyle = "disappear";
        let LabelStyle = "appear";
        if(this.state.editing) {
            InputStyle = "appear";
            LabelStyle = "disappear";
        } else {
            InputStyle = "disappear";
            LabelStyle = "appear";
        }
    	return (
			<li className="todoitem">
				<input type="checkbox" 
                    className="toggle-item"
                    checked={this.props.completed}
                    onChange={this.props.checkboxOnChange}
                />
                <label
                    className={completeStyle + " " + LabelStyle}
                    onDoubleClick={this.handleDoubleClick}>
                    {this.state.inputValue}
                </label>
				<input 
                    className={InputStyle + " " + "item-input"}
                    type="text" 
                    value={this.state.inputValue} 
                    onBlur={this.handleSubmit}
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleChange}
                    ref={(input) => {this.textInput = input;}}
                />
                <input
                    type = "button"
                    value = "x"
                    onClick = {this.props.itemDelete}
                />
			</li>
    	);
	}
}

class ListFooter extends React.Component {
    constructor (props) {
        super(props);
        this.selectOnChange = this.selectOnChange.bind(this);
    }

    selectOnChange (event) {
        this.props.showItem(event.target.value);
    }

    render() {
        var footerText = '';
        if (this.props.itemNum > 1 || this.props.itemNum < 1) {
            footerText = this.props.itemNum + " items left";
        } else {
            footerText = this.props.itemNum + " item left";
        }
        return (
            <footer>
                <label className="item-num">{footerText}</label>
                <div className="select-type">
                    <input type="radio" onChange={this.selectOnChange} name="show" value="All" defaultChecked={true} className="All"/>
                    <label htmlFor="All">All</label>
                    <input type="radio" onChange={this.selectOnChange} name="show" value="Active" className="Active"/> 
                    <label htmlFor="Active">Active</label>
                    <input type="radio" onChange={this.selectOnChange} name="show" value="Completed" className="Completed"/>
                    <label htmlFor="Completed">Completed</label>
                </div>
                <button className="clear-complete" onClick={this.props.completeItemDelete} >Clear completed</button>
            </footer>
        );
    }
}

function uuid() {
    var i, random;
    var uuid = '';

    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += '-';
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
            .toString(16);
    }
    return uuid;
}

class ListHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			headerValue: '',
			buttonCheck: false,
			arr: [],
            showArr: [],
            showType: "All"
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
        this.checkboxHeaderCheck = this.checkboxHeaderCheck.bind(this);
        this.updateShowArr = this.updateShowArr.bind(this);
	}

	handleChange(event) {
		this.setState({
			headerValue: event.target.value
		});
	}

	handleKeyDown(event) {
		if(event.keyCode != 13){
			return;
		};

		event.preventDefault();
        let mValue = this.state.headerValue.trim();
        if (mValue) {
            let temp = this.state.arr;
            temp.push({text: this.state.headerValue,
                        completed: false,
                        id: uuid()
            });

            this.updateShowArr(this.state.showType, temp);
            this.setState({
                arr: temp,
                headerValue: ''
            });
        }
	}

    checkboxHeaderCheck(event) {
        let temp = this.state.arr.map((item) => 
                    ({text: item.text, completed: !this.state.buttonCheck, id: item.id}));

        this.updateShowArr(this.state.showType, temp);
        this.setState((prevState) => ({
            buttonCheck: !prevState.buttonCheck,
            arr: temp
        }));
    }

    itemToggle(itemChecked) {
        let temp = this.state.arr.map((item) => item === itemChecked ?
                    {text: item.text, completed: !item.completed, id: item.id} : item);
        this.updateShowArr(this.state.showType, temp);
        this.setState({
            arr: temp
        });
    }

    itemKeyDown(itemEdit, mValue){   
        let temp = this.state.arr.map((item) => item === itemEdit ?
                    {id: item.id, text: mValue, completed: item.completed} : item);
        this.updateShowArr(this.state.showType, temp);
        this.setState({
            arr: temp
        });
    }

    itemDelete(itemDelete) {
        let temp = this.state.arr.filter(item => (item !== itemDelete));
        this.updateShowArr(this.state.showType, temp);
        this.setState({
            arr: temp
        });
    }

    completeItemDelete() {
        let temp = this.state.arr.filter(item => (item.completed == false));
        this.updateShowArr(this.state.showType, temp);
        this.setState({
            arr: temp
        });
    }

    showItem(mValue) {
        this.setState({
            showType: mValue
        });

        this.updateShowArr(mValue, this.state.arr);
    }

    updateShowArr(mValue, marr) {
        let temp = [];
        if (mValue == "All") {
            temp = marr;
        } else if(mValue == "Active") {
            temp = marr.filter(item => (item.completed == false));
        } else {
            temp = marr.filter(item => (item.completed == true));
        }
        this.setState({
            showArr: temp
        });
    }

    componentDidMount() {
        this.setState({
            showArr: this.state.arr
        });
    }

	render(){
        let sumItem = this.state.showArr.reduce((sum, obj) => (sum +  (obj.completed ? 0 : 1)), 0);

        let checked = false;
        if ((this.state.arr.length - sumItem) ==  this.state.arr.length) {
            checked = true;
        }

        let main = (
            <section>
                <ul>
                    {this.state.showArr.map((obj) => 
                        <ListItem  
                            id={obj.id} 
                            key={obj.id} 
                            text={obj.text}
                            completed={obj.completed}
                            checkboxOnChange={this.itemToggle.bind(this, obj)}
                            onKeyDown={this.itemKeyDown.bind(this, obj)}
                            itemDelete={this.itemDelete.bind(this, obj)}
                        />
                    )}
                </ul>
            </section>
        );

        let footer = <ListFooter
                        itemNum={sumItem}
                        showItem={this.showItem.bind(this)}
                        completeItemDelete={this.completeItemDelete.bind(this)}
                    />;

		return (
			<div className="todos">
				<header>
					<h1>todo</h1>
                    <div className="todo-header">
    					<input type="checkbox" 
                            className="toggle-all"
                            id="toggle-all"
                            onChange={this.checkboxHeaderCheck}
                            checked={checked}
                        />
                        <label htmlFor="toggle-all"> </label>
    					<input type="text" 
                            className="newtodo"
                            onChange={this.handleChange} 
                            onKeyDown={this.handleKeyDown} 
                            value={this.state.headerValue}
                            placeholder="What needs to be done?"
                            autoFocus={true}
                        />
                    </div>
				</header>

				{main}
				{footer}
                <div className="note">
                    <p>Double-click to edit a todo</p>
                    <p>Created by Candy Zhang</p>
                </div>
			</div>
		)
	}
}

render(<ListHeader />, $('#content')[0]);