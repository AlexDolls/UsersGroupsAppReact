import React from 'react';
import UsersService, {GroupsService}  from  './UsersService';



const default_user_password = "12345678"

console.log(React.version)

const usersService  =  new UsersService();
const groupsService = new GroupsService();

class Layout extends React.Component {
 	constructor(props){
  		super(props);
 		this.state = {users: "active", groups: "", table: React.createElement(UsersTable)};
 		this.handleClick = this.handleClick.bind(this);
 	}
	render(){
		return React.createElement(
			"div",
			{},
		React.createElement(
			"ul",
			{
				className: "nav nav-tabs",
			},
			React.createElement(
				"li",
				{
					className: "nav-item",
				},
				React.createElement(
					"button",
					{
						className: "nav-link" + " " + this.state.users,
						onClick: this.handleClick,
					},
					"Users"
				),
			),
			React.createElement(
                                "li",
                                {
                                        className: "nav-item",
                                },
                                React.createElement(
                                        "button",
                                        {
                                                className: "nav-link" + " " + this.state.groups,
						onClick: this.handleClick,
                                        },
                                        "Groups"
                                ),
                        ),
		),
		this.state.table
	)
	}
	handleClick(e) {
		if (e.target.innerHTML === "Users"){
			this.setState({
				users: "active",
				groups: "",
				table: React.createElement(UsersTable)
			})
		} else if (e.target.innerHTML === "Groups"){
			this.setState({
				users: "",
				groups: "active",
				table: React.createElement(GroupsTable)
			})
		}
	}
}
class UsersTable extends React.Component {
	constructor(props){
		super(props);
		this.handleClickDelete = this.handleClickDelete.bind(this);
		this.handleClickEdit = this.handleClickEdit.bind(this);
		this.handleClickAddUser = this.handleClickAddUser.bind(this)
		this.state = {users: [], groups: [],user_id_edit: "none"};
	}
	
	get_group_name(group_id){
		var result = "";
		for (var i = 0; i < this.state.groups.length; i++) {
			if (("" + group_id) === ("" + this.state.groups[i].id)){
				result = "" + this.state.groups[i].name;
			}
		}
		return result;
	}

	get_users(){
	usersService.getUsers()
		.then((result) => {
			this.setState({
                                        users:result.data,
                                        user_id_edit: "none",
                                });
		});
        }

	get_groups(){
	groupsService.getGroups()
		.then((result) => {
			this.setState({
                                        groups: result.data,
                                });
		});
        }

	
	componentDidMount() {
		this.get_users();
		this.get_groups();
	}

	render(){
		return React.createElement(
			"div",
			{},
			React.createElement(
			"table",
			{
				className:"table table-striped",
				style: {
					textAlign:"center",
				}
			},
			React.createElement(
				"thead",
				{},
				React.createElement(
					"tr",
					{},
					React.createElement("th", {scope:"col"}, "ID"),
					React.createElement("th", {scope:"col"}, "username"),
					React.createElement("th", {scope:"col"}, "created"),
					React.createElement("th", {scope:"col"}, "group"),
					React.createElement("th", {scope:"col"}, "actions"),
				)
			),
			React.createElement(
				"tbody",
				{},
				this.state.users.map(user => (
				React.createElement(
					"tr",
					"null",
					React.createElement("th", {scope:"row"}, user.id),
					React.createElement("td", {scope:"col"},
						React.createElement(
							"div",
							{
								id: "username" + user.id,
								style:{wordWrap: "break-word"}
							},
							this.give_edit_element(user.username, user.id),
						)
					),
					React.createElement("td", {scope:"col"}, user.date_joined),
					React.createElement("td", {scope:"col"},
						React.createElement(
							"div",
							{id: "selectgroups" + user.id},
							this.give_select_element(user.id, user.groups)
						)
					),
					React.createElement(
						"td",
						{
							scope:"col"
						},
						React.createElement(
							"button",
							{
								type: "button",
								id: "del" + user.id,
								value: user.id,
								onClick: this.handleClickDelete,
								className: "btn btn-danger",
							},
							"Delete"
						),
						this.give_edit_button(user.id),
						),
				)
				)),
			)
		),
		React.createElement(
                        "div",
                        {style:{padding: "10px"}},
                        React.createElement(
                                "button",
                                {
                                        type: "button",
                                        style: {marginRight: "10px", height: ""},
                                        onClick: this.handleClickAddUser,
                                        className: "btn btn-outline-success"
                                },
                                "Add User"
                        ),
                        React.createElement("input",
                                {
                                        type:"text",
                                        id: "addUserUsername",
                                        placeholder:"Username",
					onKeyPress: this.handleKeyPressAddUser,
                                        style: {marginRight:"10px"},
                                }
                        ),
                        React.createElement(
                                "select",
                                {
                                        id: "groupSelect",
					onKeyPress: this.handleKeyPressAddUser,
                                },
				React.createElement("option", {value: ""}, "None"),
                                this.state.groups.map(group => (
                                        React.createElement(
                                                "option",
                                                {
                                                        value:group.id,
                                                        key: group.id
                                                },
                                                group.name
                                        )
                                ))
                        )
                )

)
	}
	give_select_element(user_id, groups) {
		if ((user_id + "")  === this.state.user_id_edit) {
                return React.createElement(
                        "select",
                        {
                                id: "editselectgroup" + user_id,
                        },
			React.createElement("option", { value: "" }, "None"),
			this.state.groups.map(group => (
				React.createElement(
					"option",
					{
						value: group.id,
						key: group.id
					},
					group.name
				)
			))
                )
        }
                else{
                	return this.get_group_name(groups);
                }

	}

	give_edit_element(username, user_id){
		if ((user_id + "")  === this.state.user_id_edit) {
		return React.createElement(
			"input",
			{
				type: "text",
				className: "form-control",
				id: "input" + user_id,
				defaultValue: username
			}
		)
	}
		else{
		return username
		}
	}
	give_edit_button(user_id){
		var btnclass = "btn btn-info"
		var btntext = "Edit"
		if ((user_id + "")  === this.state.user_id_edit) {
			btnclass = "btn btn-success"
			btntext = "Confirm"
        }
                return React.createElement(
                                "button",
                                {
                                        type: "button",
                                        className: btnclass,
                                        id: "edit" + user_id,
                                        value: user_id,
                                        onClick: this.handleClickEdit,
                                        style: {marginLeft: "10px"}
                                },
                                btntext
                        )

	}
	
	handleKeyPressAddUser = (event) => {
		if(event.key === "Enter"){
			this.handleClickAddUser(event);
		}
	}

	handleClickDelete(e) {
		usersService.removeUser(e.target.value)
			.then((result) => {
				this.get_users();
                                console.log(result.data.detail)
			});
	}

	handleClickEdit(e) {
		if (("" + e.target.value) === "" + (this.state.user_id_edit)){
			const new_username = document.querySelector("#input" + e.target.value).value
			const group_select_dom = document.querySelector('#editselectgroup' + e.target.value);
			const group_id = group_select_dom.options[group_select_dom.selectedIndex].value
			console.log("Group ID = " + group_id)

			usersService.updateUserGroup(e.target.value, group_id)
				.then((result_group) => {
					usersService.updateUserUsername(e.target.value, new_username)
                                		.then((result_username) => {
                                        		this.get_users();
							if (result_group.data.detail)
								console.log(result_group.data.detail)
							if (result_group.data.error)
								alert(result_group.data.error)
							if (result_username.data.detail)
								console.log(result_username.data.detail)
							if (result_username.data.error)
								alert(result_username.data.error)
                                		});
				});
		}else{
		this.setState({
			user_id_edit: "" + e.target.value
		});
		}
	}
	handleClickAddUser(e) {
                const username_input_dom = document.querySelector('#addUserUsername');
                const group_select_dom = document.querySelector('#groupSelect');
                const username = username_input_dom.value + "";
                const group_id = group_select_dom.options[group_select_dom.selectedIndex].value

		usersService.createUser(username, default_user_password, group_id)
			.then((result) => {
				this.get_users();
				if (result.data.error)
                                	alert(result.data.error)
                                else
                                        console.log(result.data.detail)
				});
        }
}

class GroupsTable extends React.Component {
	constructor(props){
		super(props);
		this.handleClickEdit = this.handleClickEdit.bind(this);
		this.handleClickDelete = this.handleClickDelete.bind(this);
		this.handleClickAddGroup = this.handleClickAddGroup.bind(this);
		this.state = {
			groups: [],
			group_id_edit: "none",
		};
	}

        get_groups(){
		groupsService.getGroups()
			.then((result) => {
				this.setState({
                                        groups: result.data,
                                        group_id_edit: "none",
                                });
			});
        }

        componentDidMount() {
                this.get_groups();
        }

	render(){
		return React.createElement(
			"div",
			{},
		React.createElement(
			"table",
			{
				className: "table table-striped",
				style: {textAlign: "center"},
			},
			React.createElement(
				"thead",
				{},
				React.createElement(
					"tr",
					{},
					React.createElement("th", {scope:"col"}, "ID"),
					React.createElement("th", {scope:"col"}, "Name"),
					React.createElement("th", {scope:"col"}, "Description"),
					React.createElement("th", {scope:"col"}, "Actions"),
				)
			),
			React.createElement(
				"tbody",
				{},
				this.state.groups.map(group => (
					React.createElement(
						"tr",
						{},
						React.createElement("th", {scope:"row"}, group.id),
						React.createElement("td", {}, this.give_edit_element(group.name, group.id)),
						React.createElement("td", {}, this.give_edit_desc(group.description, group.id)),
						React.createElement(
							"td",
							{},
							React.createElement(
                                                "div",
                                                {},
                                                React.createElement(
                                                        "button",
                                                        {
                                                                type: "button",
                                                                id: "del" + group.id,
                                                                value: group.id,
                                                                onClick: this.handleClickDelete,
                                                                className: "btn btn-danger",
                                                        },
                                                        "Delete"
                                                ),
                                                this.give_edit_button(group.id),
                                                ),
						)
					)
				))
			)
		),
			React.createElement(
                                                "div",
                                                {style:{padding: "10px"}},
                                                React.createElement(
                                                        "button",
                                                        {
                                                                type: "button",
                                                                style: {marginRight: "10px", height: ""},
                                                                onClick: this.handleClickAddGroup,
                                                                className: "btn btn-outline-success"
                                                        },
                                                        "Add Group"
                                                ),
                                                React.createElement(
							"input",
                                                        {
                                                                type:"text",
                                                                id: "newGroupName",
                                                                placeholder:"Name",
								onKeyPress: this.handleKeyPressAddGroup,
                                                                style: {marginRight:"10px"},
                                                        }
                                                ),
                                                React.createElement(
                                                        "input",
                                                        {       type: "text",
                                                                id: "newGroupDesc",
								onKeyPress: this.handleKeyPressAddGroup,
                                                                placeholder: "Description",
                                                        },
                                                )
                                        )

		)
	}

	give_edit_desc(name, group_id){
                if ((group_id + "")  === this.state.group_id_edit) {
                return React.createElement(
                        "input",
                        {
                                type: "text",
                                id: "inputdesc" + group_id,
                                defaultValue: name
                        }
                )
        }
                else{
                return name
                }
        }

	give_edit_element(name, group_id){
                if ((group_id + "")  === this.state.group_id_edit) {
                return React.createElement(
                        "input",
                        {
                                type: "text",
                                id: "inputname" + group_id,
                                defaultValue: name
                        }
                )
        }
                else{
                return name
                }
        }

        give_edit_button(group_id){
                var btnclass = "btn btn-info"
                var btntext = "Edit"
                if ((group_id + "")  === this.state.group_id_edit) {
                        btnclass = "btn btn-success"
                        btntext = "Confirm"
        }
                return React.createElement(
                                "button",
                                {
                                        type: "button",
                                        className: btnclass,
                                        id: "edit" + group_id,
                                        value: group_id,
                                        onClick: this.handleClickEdit,
                                        style: {marginLeft: "10px"}
                                },
                                btntext
                        )

        }

	handleKeyPressAddGroup = (event) => {
	  if(event.key === 'Enter'){
		this.handleClickAddGroup(event);
	  }
	}	
	
	handleClickAddGroup(e) {
		var add_group_name = document.querySelector("#newGroupName").value
		var add_group_desc = document.querySelector("#newGroupDesc").value

		groupsService.createGroup(add_group_name, add_group_desc)
			.then((result) => {
				this.get_groups();
                                        if (result.data.error)
                                                alert(result.data.error)
                                        else
                                                console.log(result.data.detail)
			});
	}
	
	handleClickDelete(e) {
		var group_id = e.target.value
		groupsService.removeGroup(group_id)
			.then((result) => {
				this.get_groups();
                                        if (result.data.error)
                                                alert(result.data.error)
                                        else
                                                console.log(result.data.detail)
			});
		}
	
	handleClickEdit(e) {
                if (("" + e.target.value) === "" + (this.state.group_id_edit)){
                        const group_name = document.querySelector("#inputname" + e.target.value).value
			const group_desc = document.querySelector("#inputdesc" + e.target.value).value

                       	groupsService.updateGroupDesc(e.target.value, group_desc)
                                .then((result_desc) => {
                                        groupsService.updateGroupName(e.target.value, group_name)
                                                .then((result_name) => {
							console.log(result_desc)
                                                        this.get_groups();
                                                        if (result_desc.data.error)
                                                                alert(result_desc.data.error);
                                                        else
                                                                console.log(result_desc.data.detail);

                                                        if (result_name.data.error)
                                                                alert(result_name.data.error);
                                                        else
                                                                console.log(result_name.data.detail);
                                                });
                                });
 
                }else{
                this.setState({
                        group_id_edit: "" + e.target.value
                });
                }
        }


}

export default Layout;
