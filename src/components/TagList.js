import styled from '@emotion/styled';

const TagList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const Tag = styled.li`
  padding: 12px 14px;
  margin: 5px;
  display: ${props => props.fluid ? 'block' : 'inline-block'};
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

export {
  TagList,
  Tag
}
