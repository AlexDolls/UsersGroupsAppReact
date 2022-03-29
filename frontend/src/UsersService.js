import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000/userslist';

export default class UserssService{
	
	constructor(){}

	getUsers(){
                const url = `${API_URL}/api/users/`;
                return axios.get(url);
        }
	updateUserUsername(customer_id, username){
		const url = `${API_URL}/api/users/${customer_id}/change/username/?username=${username}`;
		return axios.get(url);
	}
	updateUserGroup(customer_id, group_id){
		const url = `${API_URL}/api/users/${customer_id}/change/addgroup/?group_id=${group_id}`;
		return axios.get(url);
	}
	createUser(username, password, group_id){
                const url = `${API_URL}/api/users/create/${username}/${password}/?group_id=${group_id}`;
                return axios.get(url);
        }
	removeUser(user_id){
                const url = `${API_URL}/api/users/${user_id}/remove/`;
                return axios.get(url);
        }
}

export class GroupsService{
	constructor(){}

	getGroups(){
                const url = `${API_URL}/api/groups/`;
                return axios.get(url);
        }
	createGroup(group_name, group_desc){
		if (group_desc === "")
			group_desc = " "
		const url = `${API_URL}/api/groups/create/${group_name}/${group_desc}/`
		return axios.get(url);
	}
	removeGroup(group_id){
                const url = `${API_URL}/api/groups/${group_id}/remove/`
                return axios.get(url);
        }
	updateGroupDesc(group_id, group_desc) {
		if (group_desc === "")  
                        group_desc = " "
		const url = `${API_URL}/api/groups/${group_id}/change/groupdesc/${group_desc}/`
                return axios.get(url);
	}
	updateGroupName(group_id, group_name) {
                const url = `${API_URL}/api/groups/${group_id}/change/groupname/${group_name}/`
                return axios.get(url);
        }

}
