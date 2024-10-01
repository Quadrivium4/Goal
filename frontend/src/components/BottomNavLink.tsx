import React, { ReactNode } from 'react';
import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';

const BottomNavLink = ({href, Icon}: {href: string, Icon: IconType}) =>{
    return (
        <Link to={href}>
            <Icon></Icon>
        </Link>
    )
}
export default BottomNavLink