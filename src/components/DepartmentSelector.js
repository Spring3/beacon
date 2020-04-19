import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useSocket } from '../contexts/SocketContext';
import { ClientEvents, ServerEvents } from '../enums/socketEvents';
import { isLight } from '../utils/color';
import { ErrorMessage } from './Messages';
import { TagList, Tag } from './TagList';
import { Button } from './Button';

const SubmitButton = styled(Button)`
  margin-top: 2rem;
`;

const DepartmentSelector = ({ onSubmit }) => {
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

  const onFormSubmit = (event) => {
    event.preventDefault();
    const selectedDepartmentIds = Object.keys(selectedDepartments);
    const departments = allDepartments
      .filter(department => selectedDepartmentIds.includes(department._id))
      .map((department) => {
        if (department.teams.length) {
          return {
            ...department,
            teams: department.teams.filter((team) => selectedDepartments[department._id][team._id].isSelected)
          };
        }
        return department;
      });
    const justIds = departments.map((department) => ({
      _id: department._id,
      teams: department.teams.map((team) => team._id)
    }));
    socket.emit(ClientEvents.settingsUpdate, { data: { departments: justIds } });
    onSubmit(departments);
  };

  const renderListOfTeams = (departmentId, mapOfTeams) => {
    return Object.entries(mapOfTeams).map(
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
    );
  };

  const entriesOfSelectedDepartmentsWithTeams = Object.entries(selectedDepartments).filter(([_, mapOfTeams]) => !!Object.keys(mapOfTeams).length);
  const hasSelectedDepartmentWithTeams = !!entriesOfSelectedDepartmentsWithTeams.length;
  let hasNotSelectedASingleTeam = false;
  let validationError = error;

  if (hasSelectedDepartmentWithTeams) {
    hasNotSelectedASingleTeam = true;
    for (const [_, mapOfTeams] of entriesOfSelectedDepartmentsWithTeams) {
      for (const team of Object.values(mapOfTeams)) {
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
    <form onSubmit={onFormSubmit}>
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
          ([departmentId, mapOfTeams]) => {
            const { name } = allDepartments.find(department => department._id === departmentId);
            return (
              <div key={departmentId}>
                <h3>Which team(s) of {name} department?</h3> 
                {renderListOfTeams(departmentId, mapOfTeams)}
              </div>
            );
          }
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
  );
}

export { DepartmentSelector };
