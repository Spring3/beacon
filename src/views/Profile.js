import React from 'react';
import styled from '@emotion/styled';
import Toggle from 'react-toggle';
import Select from 'react-select';
import 'react-toggle/style.css';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { useSettings } from '../contexts/SettingsContext';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const UserData = styled.div`
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  img {
    border-radius: 50%;
    max-width: 70px;
    max-height: 70px;
    margin-right: 1rem;
  }

  h3 {
    box-sizing: border-box;
    max-width: 100%;
    overflow: hidden;
    overflow-wrap: break-word;
  }
`;

const SettingsList = styled.ul`
  list-style-type: none;
  margin: 0;
  display: flex;
  flex-direction: column;
  padding: 0;

  li > label {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
  }
`;

const Profile = () => {
  const { logout, user } = useAuth();
  const { autoNotify, toggleAutomaticNotification } = useSettings();
  return (
    <Wrapper>
      <UserData>
        <img src={user.photo} />
        <h3>{user.name}</h3>
      </UserData>
      <h4>Settings</h4>
      <SettingsList>
        <li>
          <label>
            <span>Notify users</span>
            <Toggle
              checked={autoNotify}
              icons={false}
              onChange={toggleAutomaticNotification} />
          </label>
        </li>
        <li>
          <label>
            <span>Mute notifications</span>
            <Toggle
              checked={autoNotify}
              icons={false}
              onChange={toggleAutomaticNotification} />
          </label>
        </li>
      </SettingsList>
      <div>
        <h4>Teams</h4>
        <Select
          isMulti={true}
          options={[
            { label: 'Team 1', value: 'Team 1' },
            { label: 'Team 2', value: 'Team 2' },
            { label: 'Team 3', value: 'Team 3' }
          ]}
        />
      </div>
      <hr></hr>
      <Button onClick={logout}>Log out</Button>
    </Wrapper>
  );
};

export {
  Profile
}
