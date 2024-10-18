import React from "react";
import { Typography } from "@material-tailwind/react";
import { SecondAppEmbedOrder } from './index';

export function PageOnHoldOrder() {

  return (
    <div className="mt-12">
      <div id="heading-tit"><h2>Liste des commandes</h2></div>
      <SecondAppEmbedOrder/>
    </div>
  );
}

export default PageOnHoldOrder;
