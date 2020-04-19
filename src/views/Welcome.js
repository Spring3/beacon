import React from 'react';
import styled from '@emotion/styled';
import { useSettings } from '../contexts/SettingsContext';
import { DepartmentSelector } from '../components/DepartmentSelector';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background: white;
  height: 100%;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
`;

const Welcome = ({ children }) => {
  const settings = useSettings();

  if (Array.isArray(settings.departments) && settings.departments.length) {
    return children;
  }

  const onSubmit = (departments) => settings.setDepartments(departments);

  return (
    <Container>
      <h1>Welcome to Beacon!</h1>
      <DepartmentSelector onSubmit={onSubmit} />
    </Container>
  );
};

export {
  Welcome,
  DepartmentSelector
};
