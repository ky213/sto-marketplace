import React from 'react';
import Downshift, { A11yStatusMessageOptions } from 'downshift';
import { Alert } from 'reactstrap';
import { AvForm, AvInput } from 'availity-reactstrap-validation';

export interface AutoCompleteProps {
  inputId: string;
  resultId: string;
  initialValue: string;
  initialItem: { [value: string]: string };
  items: { [value: string]: string }[];
  selectItem: (value: any) => any;
  suggestItems: (value: string) => any;
  status?: (value: A11yStatusMessageOptions<any>) => any;
}

export const AutoComplete = ({
  inputId,
  resultId,
  initialValue,
  items,
  initialItem,
  selectItem,
  suggestItems,
  status
}: AutoCompleteProps) => {
  return (
    <Downshift
      initialInputValue={initialValue}
      initialSelectedItem={initialItem}
      onChange={selectItem}
      itemToString={item => (item ? item.value : '')}
      onInputValueChange={suggestItems}
      getA11yStatusMessage={status}
    >
      {({ getInputProps, getItemProps, getMenuProps, isOpen, inputValue, highlightedIndex, selectedItem, getRootProps }) => (
        <AvForm className="position-relative">
          <div {...getRootProps({ refKey: '' }, { suppressRefError: true })}>
            <AvInput
              {...getInputProps()}
              id={inputId}
              name="any"
              required
              validate={{
                required: { value: true, errorMessage: 'This field is required.' }
              }}
            />
          </div>
          <div
            {...getMenuProps()}
            id={resultId}
            className="position-absolute w-100"
            style={{ zIndex: 1, maxHeight: '200px', overflow: 'scroll' }}
          >
            {isOpen ? (
              items.length ? (
                items
                  .filter(item => !inputValue || item.value?.includes(inputValue))
                  .map((item, index) => (
                    <div
                      className="border border-top-0 p-2 item"
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
                <Alert color="warning">no result</Alert>
              )
            ) : null}
          </div>
        </AvForm>
      )}
    </Downshift>
  );
};
