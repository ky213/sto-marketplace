import React from 'react';
import Downshift from 'downshift';
import { AvInput, AvForm } from 'availity-reactstrap-validation';

export interface AutoCompleteProps {
  name: string;
  value: number;
  items: [];
  selectItem: () => any;
  suggestItems: () => any;
}

export const AutoComplete = ({ name, items, selectItem, suggestItems }: AutoCompleteProps) => {
  return (
    <Downshift onChange={selectItem} itemToString={item => (item ? item.value : '')} onInputValueChange={suggestItems}>
      {({ getInputProps, getItemProps, getMenuProps, isOpen, inputValue, highlightedIndex, selectedItem, getRootProps }) => (
        <div className="position-relative">
          <div {...getRootProps({}, { suppressRefError: true })}>
            <input name={name} className="form-control" {...getInputProps()} required />
          </div>
          <div {...getMenuProps()} className="position-absolute w-100" style={{ zIndex: 1 }}>
            {isOpen
              ? items
                  .filter(item => !inputValue || item.value?.includes(inputValue))
                  .map((item, index) => (
                    <div
                      key={item.value}
                      {...getItemProps({
                        index,
                        item,
                        style: {
                          backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                          fontWeight: selectedItem === item ? 'bold' : 'normal'
                        }
                      })}
                    >
                      {item.value}
                    </div>
                  ))
              : null}
          </div>
        </div>
      )}
    </Downshift>
  );
};
