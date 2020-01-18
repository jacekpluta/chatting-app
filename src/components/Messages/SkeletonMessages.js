import React from "react";
import Skeleton from "react-loading-skeleton";
import { Grid } from "semantic-ui-react";

export default function SkeletonMessages() {
  return Array(10)
    .fill()
    .map((item, index) => (
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column width={1}>
            <Skeleton square={true} height={50} width={50} />
          </Grid.Column>

          <Grid.Column width={3}>
            <Grid.Row>
              <Skeleton />
            </Grid.Row>
            <Grid.Row style={{ paddingTop: 5 }}>
              <Skeleton height={20} width={580} />
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    ));
}
