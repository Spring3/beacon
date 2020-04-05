import React from 'react';
import { Link } from '@reach/router';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import AccountIcon from 'mdi-react/AccountIcon';
import MapOutlineIcon from 'mdi-react/MapOutlineIcon';
import MapIcon from 'mdi-react/MapIcon';
import styled from '@emotion/styled';
import { Logo } from '../components/Logo';

const Nav = styled.nav`
  z-index: 2;
  position: absolute;
  bottom: 0px;
  width: 100%;
`;

const List = styled.ul`
  list-style-type: none;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: ${props => props.theme.colors.white};
  margin: 0;
  padding: 10px 0px;
`;

const ListItem = styled.li`
  cursor: pointer;
`;

const Navbar = () => {
  return (
    <Nav>
      <List>
        <ListItem>
          <Link to="/app">
            <MapOutlineIcon size={35} />
          </Link>
        </ListItem>
        <ListItem>
          <Logo size={40} />
        </ListItem>
        <ListItem>
          <Link to="profile">
            <AccountOutlineIcon size={35} />
          </Link>
        </ListItem>
      </List>
    </Nav>
  );
};

export {
  Navbar
};
