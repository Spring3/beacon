import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { DepartmentSelector } from '../components/DepartmentSelector';
import { AbsoluteContainer } from '../components/AbsoluteContainer';


const Welcome = ({ children }) => {
  const settings = useSettings();

  if (Array.isArray(settings.departments) && settings.departments.length) {
    return children;
  }

  const onSubmit = (departments) => settings.setDepartments(departments);

  return (
    <AbsoluteContainer>
      <h1>Welcome to Beacon!</h1>
      <DepartmentSelector onSubmit={onSubmit} />
    </AbsoluteContainer>
  );
};

export {
  Welcome,
  DepartmentSelector
};
