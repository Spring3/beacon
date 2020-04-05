import React from 'react';
import { Link, Match } from '@reach/router';
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
  justify-content: space-around;
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
            <Match path="/app">
              {props =>
                props.match
                  ? <MapIcon size={35} />
                  : <MapOutlineIcon size={35} />
              }
            </Match>
          </Link>
        </ListItem>
        <ListItem>
          <Match path="/app">
            {props =>
              props.match
                ? <Logo size={40} />
                : <Logo size={40} disabled />
            }
          </Match>
        </ListItem>
        <ListItem>
          <Link to="profile">
            <Match path="/app/profile">
              {props =>
                props.match
                  ? <AccountIcon size={35} />
                  : <AccountOutlineIcon size={35} />
              }
            </Match>
          </Link>
        </ListItem>
      </List>
    </Nav>
  );
};

export {
  Navbar
};
