import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useSocket } from '../contexts/SocketContext';
import { ClientEvents, ServerEvents } from '../enums/socketEvents';
import { isLight } from '../utils/color';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/Messages';

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
  padding: 12px 14px;
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

  user-select: none;

  &:hover {
    border-color: silver;
  }
`;

const SubmitButton = styled(Button)`
  margin-top: 2rem;
`;

const WelcomeModal = () => {
  const socket = useSocket();
  const [allDepartments, setAllDepartments] = useState([]);
  const [error, setError] = useState();
  const [selectedDepartments, setSelectedDepartments] = useState({});

  useEffect(() => {
    const handleResponse = (response) => {
      setAllDepartments(response.data.departments);
    };

    socket.on(ServerEvents.organizationUnits, handleResponse);

    socket.emit(ClientEvents.organizationUnits);

    return () => {
      socket.removeListener(ServerEvents.organizationUnits, handleResponse);
    };
  }, []);

  const toggleTeam = (departmentId, teamId) => {
    const mapOfTeams = selectedDepartments[departmentId];
    mapOfTeams[teamId].isSelected = !mapOfTeams[teamId].isSelected;
    setSelectedDepartments({
      ...selectedDepartments,
      [departmentId]: { ...mapOfTeams }
    });
  };

  const toggleDepartment = (id) => {
    if (!selectedDepartments[id]) {
      const department = allDepartments.find((department) => department._id === id);
      setSelectedDepartments({
        ...selectedDepartments,
        [id]: department.teams.reduce((acc, team) => ({ ...acc, [team._id]: { isSelected: false, color: team.color, name: team.name } }), {})
      });
      setError(undefined);
    } else {
      const selectedDepartmentsCopy = { ...selectedDepartments };
      delete selectedDepartmentsCopy[id];
      setSelectedDepartments(selectedDepartmentsCopy);
      if (!Object.keys(selectedDepartmentsCopy).length) {
        setError(new Error('Please select at least one department'));
      }
    }
  };

  const onSubmit = () => {

  };

  const renderListOfTeams = (departmentId, mapOfTeams) => {
    const { name } = allDepartments.find(department => department._id === departmentId);
    return (
      <>
        <h3>Which team(s) of {name} department?</h3>
        {
          Object.entries(mapOfTeams).map(
            ([id, team]) => (
              <Tag
                key={id}
                color={team.color}
                isLight={isLight(team.color)}
                isSelected={selectedDepartments[departmentId][id].isSelected}
                onClick={() => toggleTeam(departmentId, id)}
              >
                {team.name}
              </Tag>
            )
          )
        }
      </>
    );
  }

  const entriesOfSelectedDepartmentsWithTeams = Object.entries(selectedDepartments).filter(([_, mapOfTeams]) => !!Object.keys(mapOfTeams).length);
  const hasSelectedDepartmentWithTeams = !!entriesOfSelectedDepartmentsWithTeams.length;
  let hasNotSelectedASingleTeam = false;
  let validationError = error;

  if (hasSelectedDepartmentWithTeams) {
    hasNotSelectedASingleTeam = true;
    for (const [_, mapOfTeams] of entriesOfSelectedDepartmentsWithTeams) {
      for (const team of Object.values(mapOfTeams)) {
        console.log(team);
        if (team.isSelected) {
          hasNotSelectedASingleTeam = false;
        }
      }
    }

    if (hasNotSelectedASingleTeam) {
      validationError = new Error('Please select at least one team per department');
    }
  }
  const isSubmitDisabled = !!validationError || !Object.keys(selectedDepartments).length || (hasSelectedDepartmentWithTeams && hasNotSelectedASingleTeam);

  return (
    <Container>
      <form onSubmit={onSubmit}>
        <h1>Welcome to Beacon!</h1>
        <h3>Please select your department(s)</h3>
        <TagList>
          {allDepartments.map((department) => (
            <Tag
              key={department._id}
              color={department.color}
              isLight={isLight(department.color)}
              isSelected={!!selectedDepartments[department._id]}
              onClick={() => toggleDepartment(department._id)}
            >
              {department.name}
            </Tag>
          ))}
        </TagList>
        <TagList>
          {entriesOfSelectedDepartmentsWithTeams.map(
            ([departmentId, mapOfTeams]) => renderListOfTeams(departmentId, mapOfTeams)
          )}
        </TagList>
        {validationError ? <ErrorMessage>{validationError.message}</ErrorMessage> : null}
        <SubmitButton
          fluid
          type="submit"
          disabled={isSubmitDisabled}
        >
          Submit
        </SubmitButton>
      </form>
    </Container>
  );
};

export {
  WelcomeModal
};
