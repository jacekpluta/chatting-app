import React from "react";
import Skeleton from "react-loading-skeleton";
import { Grid } from "semantic-ui-react";

export default function SkeletonMessages() {
  return Array(4)
    .fill()
    .map((item, index) => (
      <div key={index}>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={2}>
              <Skeleton square={true} height={40} width={40} />
            </Grid.Column>

            <Grid.Column width={3} style={{ paddingLeft: -5 }}>
              <Grid.Row>
                <Skeleton />
              </Grid.Row>
              <Grid.Row style={{ paddingTop: 5 }}>
                <Skeleton height={20} width={250} />
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    ));
}
