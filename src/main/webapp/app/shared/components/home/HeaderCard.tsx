import React from 'react';
import { Row, Col, Card, CardTitle, CardBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './card-header.scss';

const HeaderCard = ({ title, amount, growth = null, icon, bg = null }) => {
  return (
    <Card className="p-0 mb-4 mb-xl-0">
      <CardBody className={`py-2 bg-${bg}`}>
        <Row>
          <Col>
            <CardTitle tag="p" className={`text-${title.color} mb-1`}>
              {title.content}
            </CardTitle>
            <h6 className={`font-weight-bold mb-0 text-${amount.color}`}>CHF {amount.value}</h6>
          </Col>
          <Col className={`col-3 p-0`}>
            <div className={`icon ml-auto mr-1 bg-${icon.background}  rounded-circle shadow`}>
              <FontAwesomeIcon icon={icon.name} color={icon.color} />
            </div>
          </Col>
        </Row>

        <p className="mt-3 mb-0 text-muted text-sm">
          <span className={`text-${growth?.color} mr-2`}>
            <FontAwesomeIcon icon={`arrow-${growth?.status}`} /> {growth?.value}
          </span>{' '}
          {growth && <span className="text-nowrap">{'Since last month'}</span>}
        </p>
      </CardBody>
    </Card>
  );
};

export default HeaderCard;
