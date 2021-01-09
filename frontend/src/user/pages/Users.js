import React from 'react';
import UsersList from "../components/UsersList";

const Users = () => {
    const USERS = [
        {
            _id: 'u1',
            name: 'Leo',
            image: 'https://i.ytimg.com/vi/M2u20FQiYok/maxresdefault.jpg',
            places: 2
        }
    ];

    return (
        <UsersList items={USERS}/>
        );
}

export default Users;