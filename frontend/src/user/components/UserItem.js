import React from 'react';
import { Link } from 'react-router-dom';
import { StyledUserItem, StyledUserItemContent, StyledUserItemImage, StyledUserItemInfo } from "./StyledUserItem";
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";

const UsersItem = (props) => {
    return (
        <StyledUserItem>
            <StyledUserItemContent>
                <Card>
                    <Link to={`/${props._id}/places`}>
                        <StyledUserItemImage>
                            <Avatar image={props.image} alt={props.name}/>
                        </StyledUserItemImage>
                        <StyledUserItemInfo>
                            <h2>{props.name}</h2>
                            <h3>{props.placeCount} {props.placeCount === 1 ? 'place' : 'places'}</h3>
                        </StyledUserItemInfo>
                    </Link>
                </Card>
            </StyledUserItemContent>
        </StyledUserItem>
    );
}

export default UsersItem;