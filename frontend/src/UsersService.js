import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000/userslist';

export default class UserssService{
	
	constructor(){}

	getUsers(){
                const url = `${API_URL}/api/users/`;
                return axios.get(url);
        }
	updateUserUsername(user_id, username){
		const url = `${API_URL}/api/users/${user_id}/change/username/`;
		return axios.put(url, {
			"username":username
		});
	}
	updateUserGroup(user_id, group_id){
		const url = `${API_URL}/api/users/${user_id}/change/addgroup/`;
		return axios.put(url, {
			"group_id": group_id
		});
	}
	createUser(username, password, group_id){
                const url = `${API_URL}/api/users/create/`;
		const body = {
			"username": username,
			"password": password,
			"group_id": group_id
		}
                return axios.post(url, body);
        }
	removeUser(user_id){
                const url = `${API_URL}/api/users/${user_id}/remove/`;
                return axios.delete(url);
        }
}

export class GroupsService{
	constructor(){}

	getGroups(){
                const url = `${API_URL}/api/groups/`;
                return axios.get(url);
        }
	createGroup(group_name, group_desc){
		const url = `${API_URL}/api/groups/create/`
		var body = {
			"group_name": group_name,
			"group_desc": group_desc
		}
		return axios.post(url, body);
	}
	removeGroup(group_id){
                const url = `${API_URL}/api/groups/${group_id}/remove/`
                return axios.delete(url);
        }
	updateGroupDesc(group_id, group_desc) {
		const url = `${API_URL}/api/groups/${group_id}/change/groupdesc/`
                return axios.put(url, {
			"group_desc": group_desc
		});
	}
	updateGroupName(group_id, group_name) {
                const url = `${API_URL}/api/groups/${group_id}/change/groupname/`
                return axios.put(url, {
			"group_name": group_name
		});
        }

}
