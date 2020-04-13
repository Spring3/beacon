import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Select from 'react-select';
import { useSocket } from '../contexts/SocketContext';
import { ClientEvents, ServerEvents } from '../enums/socketEvents';

const Container = styled.div`
  position: absolute;
  top: 0;
  z-index: 2;
  background: white;
  height: 100%;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
`;

const WelcomeModal = () => {
  const socket = useSocket();
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const handleResponse = (response) => {
      setDepartments(response.data.departments);
      setTeams(response.data.teams);
    };

    socket.on(ServerEvents.organizationUnits, handleResponse);

    socket.emit(ClientEvents.organizationUnits);

    return () => {
      socket.removeListener(ServerEvents.organizationUnits, handleResponse);
    };
  }, []);

  return (
    <Container>
      <form>
        <h1>Welcome to Beacon!</h1>
        <h3>Please select your department(s)</h3>
        <ul>
          {departments.map((department) => (
            <li
              key={department.id}
              color={department.color}
            >
              {department.name}
            </li>
          ))}
        </ul>
        <h3>Please select your team(s)</h3>
        <ul>
          {teams.map((team) => (
            <li
              key={team.id}
              color={team.color}
            >
              {team.name}
            </li>
          ))}
        </ul>
      </form>
    </Container>
  );
};

export {
  WelcomeModal
};
