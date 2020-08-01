import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Card,
  Button,
  CardImg,
  CardTitle,
  CardText,
  CardGroup,
  CardSubtitle,
  CardBody
} from "reactstrap";

const state = {
  labels: ["MONEY", "MONEY", "MONEY", "MONEY", "MONEY"],
  datasets: [
    {
      label: "Spending",
      backgroundColor: ["#B21F00", "#C9DE00", "#2FDE00", "#00A6B4", "#6800B4"],
      hoverBackgroundColor: [
        "#501800",
        "#4B5000",
        "#175000",
        "#003350",
        "#35014F"
      ],
      data: [65, 59, 80, 81, 56]
    }
  ]
};

export default class Chart extends React.Component {
  render() {
    return (
      <Card style={{ margin: "1rem" }}>
        <CardBody>
          <Pie
            data={state}
            options={{
              title: {
                display: true,
                text: "Average Spending per month",
                fontSize: 20
              },
              legend: {
                display: true,
                position: "right"
              }
            }}
          />
          <CardTitle>Card title</CardTitle>
          <CardSubtitle>Card subtitle</CardSubtitle>
          <CardText>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This card has even longer content than the
            first to show that equal height action. This is a wider card with
            supporting text below as a natural lead-in to additional content.
            This card has even longer content than the first to show that equal
            height action. This is a wider card with supporting text below as a
            natural lead-in to additional content. This card has even longer
            content than the first to show that equal height action. This is a
            wider card with supporting text below as a natural lead-in to
            additional content. This card has even longer content than the first
            to show that equal height action. This is a wider card with
            supporting text below as a natural lead-in to additional content.
            This card has even longer content than the first to show that equal
            height action.
          </CardText>
          <Button>Button</Button>
        </CardBody>
      </Card>
    );
  }
}
