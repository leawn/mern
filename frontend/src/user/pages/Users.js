import React from 'react';
import UsersList from "../components/UsersList";

const Users = () => {
    const USERS = [
        {
            _id: 'u1',
            name: 'Leo',
            image: '',
            places: 2
        }
    ];

    return (
        <UsersList items={USERS}/>
        );
}

export default Users;