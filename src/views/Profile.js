import React from 'react';
import styled from '@emotion/styled';
import Toggle from 'react-toggle';
import Select from 'react-select';
import 'react-toggle/style.css';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { TagList, Tag } from '../components/TagList';
import { EditableSection } from '../components/EditableSection';
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
  justify-content: space-between;
  div:first-child {
    display: inline-flex;
    align-items: center;
    img {
      border-radius: 50%;
      max-width: 90px;
      max-height: 90px;
      margin-right: 1rem;
    }

    h3 {
      box-sizing: border-box;
      max-width: 100%;
      overflow: hidden;
      overflow-wrap: break-word;
    }
  }
`;

const SettingsList = styled.ul`
  list-style-type: none;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;

  li > label {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const Profile = () => {
  const { logout, user } = useAuth();
  const { autoNotify, toggleAutomaticNotification, departments } = useSettings();
  return (
    <Wrapper>
      <UserData>
        <div>
          <img src={user.photo} />
          <h3>{user.name}</h3>
        </div>
        <Button onClick={logout}>Log out</Button>
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
      <TagList>
        <EditableSection title="Departments" onEdit={() => {}} />
        {(departments || []).map((department) => (
          <Tag
            key={department._id}
            fluid
            color={department.color}
          >
            {department.name}
          </Tag>
        ))}
      </TagList>
    </Wrapper>
  );
};

export {
  Profile
}
