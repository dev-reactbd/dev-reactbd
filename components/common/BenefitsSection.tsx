import React from "react";
import { Card, CardContent } from "../ui/card";

interface Props {
  cardOneIcon: string;
  cardOneTitle: string;
  cardOneDescription: string;
  cardTwoIcon: string;
  cardTwoTitle: string;
  cardTwoDescription: string;
  cardThreeIcon: string;
  cardThreeTitle: string;
  cardThreeDescription: string;
}

const BenefitsSection = ({
  cardOneIcon,
  cardOneTitle,
  cardOneDescription,
  cardTwoIcon,
  cardTwoTitle,
  cardTwoDescription,
  cardThreeIcon,
  cardThreeTitle,
  cardThreeDescription,
}: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="text-3xl mb-2">{cardOneIcon}</div>
          <h3 className="font-semibold mb-2">{cardOneTitle}</h3>
          <p className="text-sm text-muted-foreground">{cardOneDescription}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="text-3xl mb-2">{cardTwoIcon}</div>
          <h3 className="font-semibold mb-2">{cardTwoTitle}</h3>
          <p className="text-sm text-muted-foreground">{cardTwoDescription}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="text-3xl mb-2">{cardThreeIcon}</div>
          <h3 className="font-semibold mb-2">{cardThreeTitle}</h3>
          <p className="text-sm text-muted-foreground">
            {cardThreeDescription}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BenefitsSection;
