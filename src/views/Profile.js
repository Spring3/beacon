import React, { useState } from 'react';
import styled from '@emotion/styled';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { TagList, Tag } from '../components/TagList';
import { EditableSection } from '../components/EditableSection';
import { useSettings } from '../contexts/SettingsContext';
import { useSocket } from '../contexts/SocketContext';
import { ClientEvents } from '../enums/socketEvents';
import { DepartmentSelector } from '../components/DepartmentSelector';
import { AbsoluteContainer } from '../components/AbsoluteContainer';

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
  const [showDepartmentsSelector, setShowDepartmentsSelector] = useState(false);
  const socket = useSocket();
  const { autoNotify, toggleAutomaticNotification, departments, setDepartments } = useSettings();
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
              onChange={() => {
                const newValue = toggleAutomaticNotification();
                socket.emit(ClientEvents.settingsUpdate, { data: { autoNotify: newValue } })
              }} />
          </label>
        </li>
        <li>
          <label>
            <span>Mute notifications</span>
            <Toggle
              checked={autoNotify}
              icons={false}
              onChange={() => {
                const newValue = toggleAutomaticNotification();
                socket.emit(ClientEvents.settingsUpdate, { data: { autoNotify: newValue } });
              }} />
          </label>
        </li>
      </SettingsList>
      <TagList>
        <EditableSection title="Departments" onEdit={() => { setShowDepartmentsSelector(true); }} />
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
      {showDepartmentsSelector && (
        <AbsoluteContainer>
          <DepartmentSelector
            onSubmit={(departments) => {
              setDepartments(departments);
              setShowDepartmentsSelector(false);
            }}
            onCancel={() => {
              setShowDepartmentsSelector(false);
            }}
          />
        </AbsoluteContainer>
      )}
    </Wrapper>
  );
};

export {
  Profile
}
