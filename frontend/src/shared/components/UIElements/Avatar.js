import React from 'react';
import {StyledAvatar} from "./StyledAvatar";

const Avatar = props => {
    return (
        <StyledAvatar>
            <img
                src={props.image}
                alt={props.alt}
                style={{ width: props.width, height: props.height}}
            />
        </StyledAvatar>
    );
}

export default Avatar;