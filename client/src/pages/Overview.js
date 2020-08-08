import React from "react";
import {Redirect} from "react-router-dom"
import Navigation from "../components/NavigationBar/index";
import { Container, Row, Col } from "reactstrap";
import InfoCards from "../components/InfoCards/infocards";
import Chart from "../components/overviewinfo/ovinfo";
import {useAppContext} from '../utils/globalStates/stateProvider'

function Overview({ header }) {
  const [state, dispatch] = useAppContext();
  return (
    <>
    { (!state.user) && (!state.loading) ? <Redirect to="/login"/> : ""}
    <Container className="themed-container" fluid={true}>
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
    </>
  )
}

export default Overview;
