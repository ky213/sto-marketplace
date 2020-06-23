import React from 'react';
import Downshift from 'downshift';
import { Alert } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';

export interface AutoCompleteProps {
  name: string;
  value: string;
  items: { [value: string]: string }[];
  selectItem: (value: any) => any;
  suggestItems: (value: string) => any;
}

export const AutoComplete = ({ value, items, selectItem, suggestItems }: AutoCompleteProps) => {
  return (
    <Downshift
      initialInputValue={value}
      onChange={selectItem}
      itemToString={item => (item ? item.value : '')}
      onInputValueChange={suggestItems}
    >
      {({ getInputProps, getItemProps, getMenuProps, isOpen, inputValue, highlightedIndex, selectedItem, getRootProps }) => (
        <AvForm className="position-relative">
          <div {...getRootProps({ refKey: '' }, { suppressRefError: true })}>
            <AvInput
              name="any"
              {...getInputProps()}
              required
              validate={{
                required: { value: true, errorMessage: 'This field is required.' }
              }}
            />
          </div>
          <div {...getMenuProps()} className="position-absolute w-100" style={{ zIndex: 1 }}>
            {isOpen ? (
              items.length ? (
                items
                  .filter(item => !inputValue || item.value?.includes(inputValue))
                  .map((item, index) => (
                    <div
                      className="border border-top-0 p-2"
                      key={index}
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
              ) : (
                <Alert color="warning" className="">
                  no result
                </Alert>
              )
            ) : null}
          </div>
        </AvForm>
      )}
    </Downshift>
  );
};
