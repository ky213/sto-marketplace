import React, { useEffect } from 'react';
import { AvInput } from 'availity-reactstrap-validation';
import Pikaday from 'pikaday';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

import './style.scss';

interface DatePickerProps {
  id: string;
  name: string;
  value: string;
  setDate?: (date: Date) => any;
}

export const DatePicker = (props: DatePickerProps) => {
  useEffect(() => {
    const field = document.getElementById(props.id);
    const picker = new Pikaday({
      field,
      yearRange: 100,
      format: APP_LOCAL_DATE_FORMAT,
      keyboardInput: false,
      onSelect(date: Date) {
        field.nodeValue = date.toString();
        if (props.setDate) props.setDate(date);
      }
    });
    field.parentNode.insertBefore(picker.el, field.nextSibling);
  }, []);

  return (
    <div className="p-0 m-0 position-relative">
      <AvInput
        id={props.id}
        type="text"
        className="form-control "
        name={props.name}
        value={props.value}
        validate={{
          required: { value: true, errorMessage: 'This field is required.' }
        }}
      />
    </div>
  );
};
