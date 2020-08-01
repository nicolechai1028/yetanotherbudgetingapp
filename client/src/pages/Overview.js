import React from "react";
import Navigation from "../components/navbar/navbar";
import { Container, Row, Col } from "reactstrap";
import InfoCards from "../components/InfoCards/infocards";
import Chart from "../components/overviewinfo/ovinfo";

function Overview({ header }) {
  return (
    <Container className="themed-container" fluid={true}>
      <Row>
        <Col sm="12">
          <Navigation header={header} />
        </Col>
      </Row>

      <Row style={{ marginLeft: "2rem", marginRight: "2rem" }}>
        <Col xs="6" sm="4">
          <InfoCards />
          <Col xs="4" sm="12" style={{ padding: "0px" }}>
            <InfoCards />
          </Col>
          <Col xs="4" sm="12" style={{ padding: "0px" }}>
            <InfoCards />
          </Col>
        </Col>

        <Col xs="6" sm="4">
          <InfoCards />
          <Col xs="4" sm="12" style={{ padding: "0px" }}>
            <InfoCards />
          </Col>
        </Col>

        <Col xs="6" sm="4" style={{ height: "50%" }}>
          <Chart />
        </Col>
      </Row>
    </Container>
  );
}

export default Overview;
