import React, { useEffect } from 'react';
import { AvInput } from 'availity-reactstrap-validation';
import Pikaday from 'pikaday';

import './style.scss';

const DatePicker = props => {
  useEffect(() => {
    const field = document.getElementById('user-setting-dateOfBirth');
    const picker = new Pikaday({
      field,
      yearRange: 100,
      format: 'YYYY-MM-DD',
      keyboardInput: false,
      onSelect(date) {
        field.nodeValue = date.toString();
      }
    });
    field.parentNode.insertBefore(picker.el, field.nextSibling);
  }, []);

  return (
    <>
      <AvInput
        id="user-setting-dateOfBirth"
        type="text"
        className="form-control position-relative"
        name="setting.dateOfBirth"
        value={props.value}
        validate={{
          required: { value: true, errorMessage: 'This field is required.' }
        }}
      />
    </>
  );
};

export default DatePicker;
