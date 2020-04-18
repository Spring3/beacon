import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const StyledEditableSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  a {
    text-decoration: underlined;
    color: ${props => props.theme.colors.blue};
    font-weight: bold;
  }
`;

const EditableSection = ({ title, onEdit }) => {
  const delegateClick = (event) => {
    event.preventDefault();
    onEdit();
  };

  if (onEdit) {
    return (
      <StyledEditableSection>
        <h4>{title}</h4>
        <a
          href="#"
          onClick={delegateClick}
        >
          Edit
        </a>
      </StyledEditableSection>
    );
  }

  return (
    <StyledEditableSection>
      <h4>{title}</h4>
    </StyledEditableSection>
  )
}

EditableSection.propTypes = {
  title: PropTypes.string.isRequired,
  onEdit: PropTypes.func
}

export {
  EditableSection
};
