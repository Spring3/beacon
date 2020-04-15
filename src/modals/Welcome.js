import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useSocket } from '../contexts/SocketContext';
import { ClientEvents, ServerEvents } from '../enums/socketEvents';
import { isLight } from '../utils/color';
import { Button } from '../components/Button';

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

const TagList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const Tag = styled.li`
  padding: 8px 10px;
  margin: 5px;
  display: inline-block;
  background-color: ${props => props.isSelected ? props.color : '#E8E8E8'};
  color: ${props => props.isSelected
    ? props.isLight
      ? props.theme.colors.text
      : props.theme.colors.textLight
    : props.theme.colors.text
  };
  text-transform: capitalize;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    border-color: silver;
  }
`;

const WelcomeModal = () => {
  const socket = useSocket();
  const [serverData, setServerData] = useState({
    departments: [],
    teams: []
  });
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);

  useEffect(() => {
    const handleResponse = (response) => {
      setServerData({
        departments: response.data.departments,
        teams: response.data.teams
      });
    };

    socket.on(ServerEvents.organizationUnits, handleResponse);

    socket.emit(ClientEvents.organizationUnits);

    return () => {
      socket.removeListener(ServerEvents.organizationUnits, handleResponse);
    };
  }, []);

  const toggleTeam = (id) => {
    if (!selectedTeams.includes(id)) {
      setSelectedTeams([...selectedTeams, id]);
    } else {
      setSelectedTeams(selectedTeams.filter(teamId => teamId !== id));
    }
  };

  const toggleDepartment = (id) => {
    console.log('id', id);
    if (!selectedDepartments.includes(id)) {
      setSelectedDepartments([...selectedDepartments, id]);
    } else {
      setSelectedDepartments(selectedDepartments.filter(departmentId => departmentId !== id));
    }
  };

  const onSubmit = () => {};

  return (
    <Container>
      <form onSubmit={onSubmit}>
        <h1>Welcome to Beacon!</h1>
        <h3>Please select your department(s)*</h3>
        <TagList>
          {serverData.departments.map((department) => (
            <Tag
              key={department._id}
              color={department.color}
              isLight={isLight(department.color)}
              isSelected={selectedDepartments.includes(department._id)}
              onClick={() => toggleDepartment(department._id)}
            >
              {department.name}
            </Tag>
          ))}
        </TagList>
        <h3>Please select your team(s)</h3>
        <TagList>
          {serverData.teams.map((team) => (
            <Tag
              key={team._id}
              color={team.color}
              isLight={isLight(team.color)}
              isSelected={selectedTeams.includes(team._id)}
              onClick={() => toggleTeam(team._id)}
            >
              {team.name}
            </Tag>
          ))}
        </TagList>
        <Button fluid type="submit">Submit</Button>
      </form>
    </Container>
  );
};

export {
  WelcomeModal
};
