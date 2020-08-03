import React from "react";
import { Card, Button, CardTitle, CardText, Row } from "reactstrap";

const InfoCards = props => {
  return (
    <div>
      <Card
        body
        outline
        color="success"
        style={{
          margin: "1rem"
        }}
      >
        <CardTitle className="text-center">Special Title Treatment</CardTitle>
        <CardText>
          With supporting text below as a natural lead-in to additional content.
        </CardText>
        <Row className="mx-auto">
          <Button
            className="btn-lg"
            style={{
              margin: "1rem",
              backgroundColor: "#20bf55",
              border: "none"
            }}
          >
            Budgeted
          </Button>
          <Button
            className="btn-lg"
            style={{
              margin: "1rem",
              backgroundColor: "#01baef",
              border: "none"
            }}
          >
            Available
          </Button>
        </Row>
      </Card>
    </div>
  );
};

export default InfoCards;
